import json, threading, pathlib, time, urllib.parse, copy, os
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from playwright.sync_api import sync_playwright
ROOT=pathlib.Path(__file__).resolve().parent / 'web'
OWNER='11111111-1111-4111-8111-111111111111'
OTHER='22222222-2222-4222-8222-222222222222'
DB={}; mutex=threading.Lock(); CALLS=[]
SDK=r'''
window.supabase={createClient:()=>{
 let session=JSON.parse(localStorage.getItem('test-auth')||'null'), cb=()=>{};
 const call=async(path,opts={})=>{if(window.__offline)throw new Error('offline');return window.__mock({path,user:session?.user.id||'',body:opts.body?JSON.parse(opts.body):{}});};
 const auth={
  onAuthStateChange:f=>{cb=f;setTimeout(()=>cb('INITIAL_SESSION',session),0);return{data:{subscription:{unsubscribe(){}}}}},
  getSession:async()=>({data:{session},error:null}),
  getUser:async()=>{const r=await call('/__api/user');return {data:{user:r.data},error:r.error}},
  signInWithPassword:async p=>{const r=await call('/__api/login',{method:'POST',body:JSON.stringify(p)});if(r.error)return r;session=r.data;localStorage.setItem('test-auth',JSON.stringify(session));cb('SIGNED_IN',session);return{data:{session},error:null}},
  signOut:async()=>{session=null;localStorage.removeItem('test-auth');cb('SIGNED_OUT',null);return{error:null}}
 };
 return {auth,from:table=>{const q={id:'',select(){return q},eq(k,v){q.id=v;return q},abortSignal(){return q},maybeSingle(){return call('/__api/table?table='+table+'&id='+q.id)}};return q},rpc:(name,p)=>{const q={abortSignal(){return q},then(resolve,reject){return call('/__api/rpc',{method:'POST',body:JSON.stringify(p)}).then(resolve,reject)}};return q}};
}};
'''
# The managed browser disallows all network navigation, even localhost.
# Render embedded source with set_content; mock storage/SDK/backend explicitly.
def mock(req):
 path=req['path'];uid=req['user'];body=req['body'];u=urllib.parse.urlparse(path)
 if u.path=='/__api/login':
  if body.get('password')!='test-password':return {'data':None,'error':{'message':'invalid'}}
  return {'data':{'user':{'id':OWNER if body['email']=='owner@example.com' else OTHER,'email':body['email']}},'error':None}
 if u.path=='/__api/user':return {'data':{'id':uid,'email':'owner@example.com' if uid==OWNER else 'other@example.com'},'error':None}
 if u.path=='/__api/table':
  q=urllib.parse.parse_qs(u.query)
  if uid!=OWNER or q.get('id',[''])[0]!=OWNER:return {'data':None,'error':None}
  if q['table'][0]=='reto100_allowed_users':return {'data':{'user_id':OWNER},'error':None}
  return {'data':copy.deepcopy(DB.get(uid)),'error':None}
 if u.path=='/__api/rpc':
  if uid!=OWNER:return {'data':None,'error':{'code':'42501','message':'RETO100_NOT_ALLOWED'}}
  cur=DB.get(uid);rev=cur['revision'] if cur else 0
  if body['p_revision']!=rev:return {'data':None,'error':{'code':'40001','message':'RETO100_CONFLICT'}}
  DB[uid]={'data':body['p_data'],'revision':rev+1,'updated_at':'2026-10-20T12:00:%02dZ'%((rev+1)%60),'device_id':body['p_device']};CALLS.append(copy.deepcopy(body))
  return {'data':[{'revision':rev+1,'updated_at':DB[uid]['updated_at']}],'error':None}
 return {'data':None,'error':{'message':'unknown'}}
import re
html=(ROOT/'index.html').read_text()
html=re.sub(r'<link rel="stylesheet" href="([^"]+)">',lambda m:'<style>'+ (ROOT/m[1]).read_text()+'</style>',html)
config="window.RETO100_CLOUD_CONFIG={supabaseUrl:'https://test-project.supabase.co',publishableKey:'sb_publishable_testing'};"
def script(m):
 src=m[1]
 text=SDK if src.startswith('https:') else config if src=='config.js' else (ROOT/src).read_text()
 return '<script>'+text+'</script>'
html=re.sub(r'<script src="([^"]+)"[^>]*></script>',script,html)
def offline(page,value):
 page.evaluate('(v)=>{window.__offline=v;window.dispatchEvent(new Event(v?"offline":"online"))}',value)
checks=[]
def ok(name):checks.append(name);print('PASS',name,flush=True)
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path=os.environ.get('CHROMIUM_PATH') or None,args=['--no-sandbox'])
 contexts=[];errors=[]
 def page_new(mobile=False,store=None):
  c=browser.new_context(viewport={'width':390,'height':844} if mobile else {'width':1440,'height':1000});contexts.append(c)
  page=c.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
  page.expose_function('__mock',mock)
  page.evaluate("(initial)=>{window.__store=initial||{};Object.defineProperty(window,'localStorage',{value:{getItem:k=>Object.hasOwn(window.__store,k)?window.__store[k]:null,setItem:(k,v)=>{window.__store[k]=String(v)},removeItem:k=>{delete window.__store[k]},clear:()=>{window.__store={}}},configurable:true});window.__offline=false;Object.defineProperty(navigator,'onLine',{get:()=>!window.__offline,configurable:true});Object.defineProperty(navigator,'locks',{value:undefined,configurable:true});}",store)
  page.set_content(html,wait_until='load');page.wait_for_timeout(100)
  return c,page
 def login(page,email='owner@example.com'):
  page.fill('#cloud-email',email);page.fill('#cloud-password','test-password');page.click('#cloud-login-form button')
  page.wait_for_function('window.Reto100Cloud.status().ready')
 def change(page,js):page.evaluate('(function(){const s=Reto100.getState();'+js+';Reto100.cloudEdit(s)})()')
 def wait_saved(page):page.wait_for_function('Reto100Cloud.status().ready && !Reto100Cloud.status().dirty && Reto100Cloud.status().revision>0',timeout=10000)
 c1,a=page_new();a.screenshot(path=str(ROOT.parent / 'login-desktop.png'),full_page=True)
 assert a.locator('.shell').is_hidden();assert 'owner@example.com' not in a.locator('#cloud-gate').inner_text();ok('Signed-out interface hides app and previous data')
 login(a);assert a.evaluate('Reto100.getState().profile.weight')==75;ok('Authenticated authorized user, neutral initial profile')
 change(a,'s.profile={age:25,height:185,weight:90,benchActual:80};s.enhanced.activity["2026-10-20"]={steps:8200,walk:60}')
 wait_saved(a);assert DB[OWNER]['data']['enhanced']['activity']['2026-10-20']['steps']==8200;ok('First private save with revision acknowledgment')
 assert 'ui' not in DB[OWNER]['data'];assert 'trainingDate' not in DB[OWNER]['data']['enhanced'];ok('UI navigation preferences excluded from cloud data')
 before=len(CALLS);a.click('[data-action="nav"][data-page="recipes"]');a.wait_for_timeout(1300);assert len(CALLS)==before;ok('Navigation does not create needless cloud writes')
 c2,b=page_new(mobile=True);login(b);assert b.evaluate('Reto100.getState().profile.weight')==90;assert b.evaluate('Reto100.getState().enhanced.activity["2026-10-20"].steps')==8200;ok('Second independent device loads existing cloud snapshot')
 change(b,'s.profile.weight=89.5');wait_saved(b);a.evaluate('Reto100Cloud.sync(true)');assert a.evaluate('Reto100.getState().profile.weight')==89.5;ok('Two-way synchronized update')
 offline(a,True);change(a,'s.enhanced.activity["2026-10-20"].steps=9100');a.wait_for_timeout(1300);assert a.evaluate('Reto100Cloud.status().dirty');assert DB[OWNER]['data']['enhanced']['activity']['2026-10-20']['steps']==8200;ok('Offline edits remain local and pending')
 offline(a,False);a.evaluate('Reto100Cloud.sync()');wait_saved(a);assert DB[OWNER]['data']['enhanced']['activity']['2026-10-20']['steps']==9100;ok('Offline pending changes upload on reconnection')
 b.evaluate('Reto100Cloud.sync(true)');offline(a,True);change(a,'s.enhanced.activity["2026-10-20"].steps=9200');a.wait_for_timeout(1250)
 change(b,'s.enhanced.activity["2026-10-20"].steps=9300');wait_saved(b);offline(a,False);a.evaluate('Reto100Cloud.sync()');a.wait_for_function('Reto100Cloud.status().conflict');assert DB[OWNER]['data']['enhanced']['activity']['2026-10-20']['steps']==9300;assert a.evaluate('Reto100.getState().enhanced.activity["2026-10-20"].steps')==9200;ok('Divergent devices stop instead of silently overwriting')
 a.click('#cloud-account');a.on('dialog',lambda d:d.accept());a.get_by_role('button',name='Usar la versi\u00f3n de la nube',exact=True).click();assert a.evaluate('Reto100.getState().enhanced.activity["2026-10-20"].steps')==9300;ok('Explicit conflict resolution using cloud copy')
 a.click('#cloud-close');a.click('[data-action="nav"][data-page="settings"]');sample=a.evaluate('Reto100.getState()');sample['profile']['weight']=88.4
 a.locator('#import-file').set_input_files({'name':'previous-copy.json','mimeType':'application/json','buffer':json.dumps(sample).encode()});wait_saved(a);b.evaluate('Reto100Cloud.sync(true)');assert b.evaluate('Reto100.getState().profile.weight')==88.4;ok('Compatible JSON import propagates after confirmation')
 b.click('[data-action="nav"][data-page="activity"]');b.screenshot(path=str(ROOT.parent / 'sync-mobile.png'),full_page=True);assert b.evaluate('document.documentElement.scrollWidth<=window.innerWidth');ok('Mobile layout, steps and sync control fit viewport')
 a.click('[data-action="nav"][data-page="home"]');a.screenshot(path=str(ROOT.parent / 'sync-desktop.png'),full_page=True)
 a.click('#cloud-account');with_download=a.expect_download()
 with with_download as event:a.get_by_role('button',name='Exportar copia local',exact=True).click()
 f=event.value.path();data=json.loads(pathlib.Path(f).read_text());assert data['profile']['weight']==88.4;assert 'access_token' not in json.dumps(data);ok('JSON backup contains plan data, not authentication tokens')
 a.get_by_role('button',name='Cerrar sesi\u00f3n en este dispositivo',exact=True).click();a.wait_for_selector('#cloud-login-form');assert a.locator('.shell').is_hidden();assert a.evaluate('localStorage.getItem("reto100.personal.cloud.v1")') is None;ok('Logout hides and removes local account snapshot')
 c3,bad=page_new();bad.fill('#cloud-email','other@example.com');bad.fill('#cloud-password','test-password');bad.click('#cloud-login-form button');bad.wait_for_function('document.querySelector("#cloud-login-message").textContent.includes("autorizada")');assert bad.locator('.shell').is_hidden();ok('Unauthorized account denied by allowlist')
 # Lost connection across reload: preserve unsent draft in cache and reconcile on login.
 login(a);offline(a,True);change(a,'s.profile.weight=88.2');a.wait_for_timeout(1200);store=a.evaluate("window.__store");a.close();c1,a=page_new(store=store);a.wait_for_function('Reto100Cloud.status().ready');wait_saved(a);assert a.evaluate('Reto100.getState().profile.weight')==88.2;ok('Pending draft survives reload without overwriting by server snapshot')
 # App imports sanitize untrusted notes. Verify no execution.
 change(a,'s.logs=[{date:"2026-10-20",weight:88.2,note:"<img src=x onerror=alert(1)>",validLift:false}]');wait_saved(a);a.click('[data-action="nav"][data-page="progress"]');assert a.locator('img[src="x"]').count()==0;ok('Imported note is escaped in rendered history')
 assert not errors,errors
 ok('No uncaught JavaScript errors in tested flows')
 browser.close()

pathlib.Path(str(ROOT.parent / 'test-results.json')).write_text(json.dumps({'tests':checks,'js_errors':errors,'backend':'Managed browser disallows navigation. set_content rendering; mock storage, Supabase SDK and backend. Not a live Supabase or real-origin localStorage test.'},ensure_ascii=False,indent=2))
