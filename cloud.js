/* Reto 100 Cloud 1.0: Supabase Auth + RLS + optimistic snapshot synchronization.
 * No admin keys. UI preferences remain local. No automatic conflict overwrites.
 */
(() => {
'use strict';
const $ = s => document.querySelector(s);
const app = window.Reto100;
const cfg = window.RETO100_CLOUD_CONFIG || {};
const clone = v => JSON.parse(JSON.stringify(v));
const canonical = v => JSON.stringify(sort(v));
function sort(v) {
  if (Array.isArray(v)) return v.map(sort);
  if (v && typeof v === 'object') return Object.fromEntries(Object.keys(v).sort().map(k => [k,sort(v[k])]));
  return v;
}
const localFields = ['trainingDate','activityDate','exerciseFilter','equipment','shopView'];
function payload(raw = app.getState()) {
  const s = clone(raw); delete s.ui;
  for (const k of localFields) delete s.enhanced[k];
  return s;
}
function apply(raw) {
  const local = app.getState(), s = clone(raw);
  s.ui = local.ui;
  s.enhanced = {...s.enhanced};
  for (const k of localFields) s.enhanced[k] = local.enhanced[k];
  app.cloudApply(s);
}
const gate = $('#cloud-gate'), modal = $('#cloud-modal');
let client, user, ready = false, booting = false, busy = false, epoch = 0;
let revision = 0, base = '', savedAt = null, conflict = null, notice = '';
let debounce, releaseEditor = null, explicitLogout = false, cacheProblem = false;
let cachePrefix = '', tabId = crypto.randomUUID ? crypto.randomUUID() : String(Date.now())+Math.random();
let checkedRemote = false, lastTransient = '';

const dirty = () => ready && canonical(payload()) !== base;
function download(name, data) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(data,null,2)], {type:'application/json;charset=utf-8'}));
  const a = document.createElement('a'); a.href=url; a.download=name; a.click(); setTimeout(()=>URL.revokeObjectURL(url),2000);
}
function cacheKey() {return cachePrefix + user.id;}
function persist() {
  if (!user || !ready) return;
  try {
    localStorage.setItem(cacheKey(),JSON.stringify({userId:user.id,state:app.getState(),base,revision,savedAt,writer:tabId}));
    cacheProblem = false;
  } catch (_) {cacheProblem = true;}
}
function readCache(id) {
  try {
    const c = JSON.parse(localStorage.getItem(cachePrefix+id));
    if (!c || c.userId!==id || !Number.isSafeInteger(c.revision) || c.revision<0 || typeof c.base!=='string') return null;
    c.state=app.sanitize(c.state); return c;
  } catch (_) {return null;}
}
function gateText(message='', loading=false) {
  document.body.classList.add('cloud-locked');
  gate.replaceChildren();
  const card=document.createElement('section'); card.className='cloud-login-card';
  card.innerHTML=`<div class="cloud-kicker">RETO 100 / NUBE PERSONAL</div><div class="cloud-emblem" aria-hidden="true">100</div><h1>Tu esfuerzo.<br>En todos tus dispositivos.</h1><p class="cloud-intro">Entra en tu espacio de fuerza, alimentaci\u00f3n y actividad. Sin registros p\u00fablicos.</p><p id="cloud-login-message" role="status"></p><form id="cloud-login-form"><label for="cloud-email">Correo de tu cuenta de Reto 100</label><input id="cloud-email" name="email" type="email" autocomplete="username" required placeholder="tu@correo.es"><label for="cloud-password">Contrase\u00f1a de Reto 100</label><input id="cloud-password" name="password" type="password" autocomplete="current-password" required><button class="btn btn-primary" type="submit">Entrar en mi cuenta</button></form><p class="cloud-private-note">La cuenta se crea en Supabase, no desde esta p\u00e1gina. No utilices aqu\u00ed la contrase\u00f1a de tu base de datos.</p>`;
  gate.append(card); $('#cloud-login-message').textContent=message;
  for(const el of card.querySelectorAll('input,button')) el.disabled=loading;
  $('#cloud-login-form').addEventListener('submit', async e=>{
    e.preventDefault(); const email=$('#cloud-email').value.trim(), password=$('#cloud-password').value;
    for(const el of card.querySelectorAll('input,button')) el.disabled=true;
    $('#cloud-login-message').textContent='Comprobando tu cuenta...';
    try {
      const {data,error}=await client.auth.signInWithPassword({email,password});
      $('#cloud-password').value=''; if(error) throw error;
      await boot(data.session);
    } catch (_) {gateText('No se ha podido entrar. Comprueba el correo, la contrase\u00f1a y la configuraci\u00f3n de Supabase.');}
  });
}
function unlock() {document.body.classList.remove('cloud-locked'); gate.replaceChildren();}
function stateLabel() {
  if (!ready) return 'Acceso privado';
  if (conflict) return 'Revisar dos versiones';
  if (busy) return 'Sincronizando...';
  if (dirty()) return navigator.onLine ? 'Cambios pendientes' : 'Pendiente: sin conexi\u00f3n';
  return revision ? 'Sincronizado' : 'Importa tu copia';
}
function paint() {
  if(notice!==lastTransient && /^(Cambios del otro|Todo est)/.test(notice)){const n=notice;lastTransient=n;setTimeout(()=>{if(notice===n){notice='';paint()}},5500);}
  const b=$('#cloud-account'); b.textContent=stateLabel(); b.dataset.status=conflict?'conflict':dirty()?'pending':'ok';
  const warning=$('#cloud-banner');
  const text=cacheProblem ? 'No se puede guardar la copia local. Exporta tus datos antes de cerrar.' : conflict ? 'Hay cambios distintos en dos dispositivos. Abre Nube para elegir qu\u00e9 versi\u00f3n conservar.' : notice;
  warning.hidden=!ready || !text; warning.textContent=text;
  if (ready) $('#save-status').textContent=stateLabel()+(savedAt && !dirty() ? ' \u00b7 '+new Date(savedAt).toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'}) : '');
  if (modal.open) renderPanel();
}
function renderPanel() {
  const p=$('#cloud-content'); p.replaceChildren();
  const email=document.createElement('p'); email.className='small muted'; email.textContent=user?.email || 'Sin sesi\u00f3n'; p.append(email);
  const status=document.createElement('h3'); status.className='mt16'; status.textContent=stateLabel();p.append(status);
  const detail=document.createElement('p');detail.className='small muted mt12';
  detail.textContent=savedAt ? 'Revisi\u00f3n '+revision+' \u00b7 guardado en la nube: '+new Date(savedAt).toLocaleString('es-ES') : 'A\u00fan no hay un guardado confirmado en la nube. Importa tu copia en Ajustes o completa tu perfil.';p.append(detail);
  if(notice){const n=document.createElement('p');n.className='cloud-error';n.textContent=notice;p.append(n);}
  const row=document.createElement('div');row.className='flex wrap mt24';p.append(row);
  const button=(parent,text,fn,primary=false)=>{const b=document.createElement('button');b.type='button';b.className='btn'+(primary?' btn-primary':'');b.textContent=text;b.addEventListener('click',fn);parent.append(b);return b;};
  button(row,'Sincronizar ahora',()=>sync(true),true).disabled=busy||!!conflict;
  button(row,'Exportar copia local',()=>download('reto100-copia-'+new Date().toISOString().slice(0,10)+'.json',app.getState()));
  if(conflict){
    const box=document.createElement('section');box.className='cloud-conflict mt24';
    const title=document.createElement('h3');title.textContent='No hemos sobrescrito ninguna versi\u00f3n';box.append(title);
    const text=document.createElement('p');text.className='small mt12';text.textContent='Has editado sin tener la misma base en ambos dispositivos. No hay mezcla autom\u00e1tica: exporta las dos copias antes de elegir. La versi\u00f3n descartada no se sumar\u00e1 a la otra.';box.append(text);
    const when=document.createElement('p');when.className='tiny muted mt12';when.textContent=conflict.updated_at?'Nube: '+new Date(conflict.updated_at).toLocaleString('es-ES'):'La nube no contiene una copia.';box.append(when);
    const choices=document.createElement('div');choices.className='stack mt16';box.append(choices);
    button(choices,'Exportar mi versi\u00f3n local',()=>download('reto100-conflicto-local.json',app.getState()));
    button(choices,'Exportar la versi\u00f3n de la nube',()=>download('reto100-conflicto-nube.json',conflict.data||app.cloudDefault()));
    button(choices,'Usar la versi\u00f3n de la nube',()=>{
      if(!confirm('Sustituir lo de este dispositivo por la nube? Exporta antes los cambios locales que quieras conservar.'))return;
      const remote=conflict;conflict=null; apply(remote.data||app.cloudDefault());revision=Number(remote.revision)||0;savedAt=remote.updated_at||null;base=canonical(payload());persist();notice='Versi\u00f3n de la nube cargada.';paint();
    });
    button(choices,'Conservar lo de este dispositivo',async()=>{
      if(!confirm('Sustituir la nube por lo de este dispositivo? Exporta antes la copia de la nube. No se combinar\u00e1n los cambios.'))return;
      const remote=conflict;conflict=null;revision=Number(remote.revision)||0;base=canonical(remote.data?payload(app.sanitize(remote.data)):{});persist();await sync(true);
    });p.append(box);
  }
  const note=document.createElement('p');note.className='small muted mt24';note.textContent='Comprueba Sincronizado antes de cambiar de dispositivo. Las copias locales y los archivos JSON no est\u00e1n cifrados por la app. Usa tus propios dispositivos y exporta una copia peri\u00f3dica. La sincronizaci\u00f3n no conserva versiones hist\u00f3ricas.';p.append(note);
  const end=document.createElement('div');end.className='mt24';p.append(end);
  button(end,'Cerrar sesi\u00f3n en este dispositivo',logout);
}
function timeoutSignal() {return typeof AbortSignal.timeout==='function'?AbortSignal.timeout(15000):undefined;}
async function readRemote(id) {
  let q=client.from('reto100_state').select('data,revision,updated_at,device_id').eq('user_id',id);
  const signal=timeoutSignal();if(signal)q=q.abortSignal(signal);
  const {data,error}=await q.maybeSingle();if(error)throw error;return data;
}
function remoteKey(r) {return r?.data?canonical(payload(app.sanitize(r.data))):'';}
function accept(remote, replace=true) {
  if(replace && remote?.data) apply(remote.data);
  revision=Number(remote?.revision)||0;savedAt=remote?.updated_at||null;base=canonical(payload());checkedRemote=true;persist();
}
function setConflict(remote) {conflict=remote||{revision:0,data:null};notice='Sincronizaci\u00f3n detenida para que no se pierdan cambios.';persist();paint();}
async function acquireEditor(id) {
  if(releaseEditor || !navigator.locks) return true;
  return new Promise(resolve=>{
    navigator.locks.request('reto100-cloud-editor:'+cachePrefix+id,{ifAvailable:true},lock=>{
      if(!lock){resolve(false);return;}
      resolve(true);return new Promise(release=>{releaseEditor=release;});
    }).catch(()=>resolve(false));
  });
}
async function boot(session) {
  if(!session?.user)return;
  if(booting)return;
  if(ready && user?.id===session.user.id){sync();return;}
  booting=true; const mark=++epoch;gateText('Cargando tu espacio privado...',true);
  try {
    const {data:identity,error:identityError}=await client.auth.getUser();
    if(identityError || !identity?.user)throw new Error('IDENTITY');
    const id=identity.user.id;
    const {data:allowed,error}=await client.from('reto100_allowed_users').select('user_id').eq('user_id',id).maybeSingle();
    if(error || !allowed)throw new Error('NOT_ALLOWED');
    if(!await acquireEditor(id))throw new Error('OTHER_TAB');
    const remote=await readRemote(id);if(epoch!==mark)return;
    user=identity.user;const cache=readCache(id);
    revision=cache?.revision||0;savedAt=cache?.savedAt||null;conflict=null;notice='';
    if(cache)app.cloudApply(cache.state);else app.cloudApply(app.cloudDefault());
    base=cache?.base||canonical(payload());ready=true;checkedRemote=true;
    const pending=cache && canonical(payload(cache.state))!==cache.base;
    if(pending){
      if(remoteKey(remote)===canonical(payload()))accept(remote,false);
      else if((Number(remote?.revision)||0)!==revision)setConflict(remote);
    }else if(remote)accept(remote);
    else if(cache && cache.revision>0)setConflict(null);
    else{revision=0;base=canonical(payload());notice='Primera entrada: importa tu copia anterior en Ajustes o completa tu perfil. Los valores visibles son una plantilla, no tus medidas verificadas.';}
    unlock();persist();paint();if(dirty()&&!conflict)setTimeout(()=>sync(),50);
  } catch(e) {
    if(epoch!==mark)return;
    if(releaseEditor){releaseEditor();releaseEditor=null;}
    ready=false;user=null;
    const message=e.message==='OTHER_TAB'?'Reto 100 ya est\u00e1 abierta en otra pesta\u00f1a de este navegador. Ci\u00e9rrala y vuelve a entrar aqu\u00ed.':e.message==='NOT_ALLOWED'?'La cuenta no est\u00e1 autorizada o falta ejecutar el SQL. Revisa los pasos de Supabase y vuelve a entrar.':'No se ha podido cargar la cuenta. Revisa Internet, la URL y el estado del proyecto en Supabase. No se han sobrescrito tus datos.';
    gateText(message);
  } finally {booting=false;}
}
function inputInUse(){return document.activeElement?.matches('input,textarea,select')||$('#recipe-modal')?.open;}
async function sync(force=false) {
  if(!ready||busy||conflict||!user)return;
  busy=true;notice='';const mark=epoch,id=user.id;paint();
  try {
    if(!navigator.onLine)throw new Error('OFFLINE');
    const remote=await readRemote(id);if(epoch!==mark||!ready)return;
    const current=payload(), currentKey=canonical(current), currentDirty=currentKey!==base;
    if(currentDirty){
      if(remoteKey(remote)===currentKey){accept(remote,false);notice='';return;}
      if((Number(remote?.revision)||0)!==revision){setConflict(remote);return;}
      const sent=clone(current),sentKey=canonical(sent),expected=revision;
      if(new Blob([JSON.stringify(sent)]).size>1900000)throw new Error('SIZE');
      let q=client.rpc('reto100_save',{p_data:sent,p_revision:expected,p_device:tabId});
      const signal=timeoutSignal();if(signal)q=q.abortSignal(signal);
      const {data,error}=await q;
      if(epoch!==mark||!ready)return;
      if(error){
        if(error.code==='40001'||String(error.message).includes('RETO100_CONFLICT')){
          const latest=await readRemote(id);if(epoch===mark)setConflict(latest);return;
        }throw error;
      }
      const ack=Array.isArray(data)?data[0]:data;
      if(!ack||!Number.isSafeInteger(Number(ack.revision)))throw new Error('ACK');
      revision=Number(ack.revision);savedAt=ack.updated_at;base=sentKey;checkedRemote=true;persist();
      if(dirty())schedule();
    }else if((Number(remote?.revision)||0)!==revision){
      if(!remote){setConflict(null);return;}
      if(!force&&inputInUse()){notice='Hay datos nuevos en la nube. Termina de editar y pulsa Sincronizar ahora.';return;}
      accept(remote);notice='Cambios del otro dispositivo recibidos.';
    }else if(force){notice=revision?'Todo est\u00e1 al d\u00eda.':'A\u00fan no has importado una copia ni cambiado la plantilla.';}
  } catch(e) {
    if(epoch!==mark)return;
    notice=e.message==='SIZE'?'La copia es demasiado grande para esta versi\u00f3n. Exporta tus datos antes de continuar.':!navigator.onLine?'Sin Internet. Los cambios siguen pendientes en este navegador; se reintentar\u00e1n al volver la conexi\u00f3n.':'No se ha confirmado la sincronizaci\u00f3n. No se borran los cambios locales. Revisa Internet, Supabase y los permisos SQL.';
    persist();
  }finally{if(epoch===mark){busy=false;paint();}}
}
function schedule(){clearTimeout(debounce);debounce=setTimeout(()=>sync(),1100);}
function clearSession(removeCache=false){
  ++epoch;clearTimeout(debounce);const id=user?.id;
  if(removeCache&&id){try{localStorage.removeItem(cachePrefix+id)}catch(_){}}
  ready=false;busy=false;user=null;conflict=null;revision=0;base='';savedAt=null;notice='';
  if(releaseEditor){releaseEditor();releaseEditor=null;}
  for(const d of document.querySelectorAll('dialog[open]'))d.close();
  app.cloudResetLocal();gateText('Sesi\u00f3n cerrada.');paint();
}
async function logout(){
  if(busy){notice='Espera a que termine la sincronizaci\u00f3n antes de salir.';paint();return;}
  if(dirty()||conflict){alert('Hay cambios sin sincronizar. Exporta tu copia y resuelve la sincronizaci\u00f3n antes de cerrar sesi\u00f3n. Puedes cerrar la pesta\u00f1a: la copia local se conserva.');return;}
  explicitLogout=true;
  const {error}=await client.auth.signOut({scope:'local'});
  if(error){explicitLogout=false;notice='No se pudo cerrar la sesi\u00f3n. Revisa la conexi\u00f3n e int\u00e9ntalo de nuevo.';paint();return;}
  clearSession(true);explicitLogout=false;
}
$('#cloud-account').addEventListener('click',()=>{if(!ready)return;renderPanel();modal.showModal();});
$('#cloud-close').addEventListener('click',()=>modal.close());
window.addEventListener('reto100:rendered',()=>{if(ready)paint();});
window.addEventListener('reto100:changed',()=>{if(!ready)return;persist();paint();if(dirty())schedule();});
window.addEventListener('online',()=>sync());
window.addEventListener('offline',()=>{if(ready){notice='Sin Internet. Los nuevos cambios quedar\u00e1n pendientes en este dispositivo.';paint();}});
window.addEventListener('focus',()=>sync());
document.addEventListener('visibilitychange',()=>{if(!document.hidden)sync();});
window.addEventListener('beforeunload',e=>{if(dirty()||conflict){persist();e.preventDefault();e.returnValue='';}});
setInterval(()=>{if(!document.hidden)sync();},30000);
// Single-browser tab lock prevents concurrent edits sharing the same local cache.
window.Reto100Cloud={status:()=>({ready,revision,dirty:dirty(),conflict:!!conflict,savedAt,checkedRemote}),sync};
try {
  if(!app)throw new Error('APP');
  const url=new URL(cfg.supabaseUrl);
  if(url.protocol!=='https:'||!url.hostname.endsWith('.supabase.co')||!/^sb_publishable_[A-Za-z0-9_-]+$/.test(cfg.publishableKey||''))throw new Error('CONFIG');
  if(!window.supabase?.createClient)throw new Error('SDK');
  cachePrefix='reto100.cloud.cache.v1:'+url.host+':';
  client=window.supabase.createClient(url.origin,cfg.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false,storageKey:'reto100.auth:'+url.host}});
  // Never await Supabase calls inside onAuthStateChange's callback (auth lock).
  client.auth.onAuthStateChange((event,session)=>{
    if(event==='SIGNED_OUT'){setTimeout(()=>clearSession(explicitLogout),0);return;}
    if((event==='INITIAL_SESSION'||event==='SIGNED_IN')&&session)setTimeout(()=>boot(session),0);
  });
  gateText();
  client.auth.getSession().then(({data,error})=>{if(error){gateText('No se ha podido recuperar la sesi\u00f3n. Vuelve a entrar.');return;}if(data.session)boot(data.session);});
}catch(e){
  gateText(e.message==='SDK'?'No se ha cargado la biblioteca de acceso. Revisa Internet o el bloqueo de cdn.jsdelivr.net.':'Falta configurar esta instalaci\u00f3n. Abre web/config.js y pega la Project URL y la Publishable key de tu proyecto. Nunca una clave secreta.',true);
}
})();
