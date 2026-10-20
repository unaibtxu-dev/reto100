/* Pure, deterministic nutrition estimates. Activity mapping is a disclosed app heuristic, not a validated prediction model. */
window.R100_CALC=(()=>{
'use strict';
const round25=n=>Math.round(n/25)*25;
const finite=(v,min,max)=>v!==null&&v!==''&&Number.isFinite(+v)&&+v>=min&&+v<=max;
function validate(x){const errors=[];for(const[k,min,max,name]of [['weight',40,220,'Peso: 40\u2013220 kg'],['height',130,230,'Altura: 130\u2013230 cm'],['age',18,100,'Edad: 18\u2013100 a\u00f1os'],['steps',0,40000,'Pasos: 0\u201340.000'],['days',0,6,'Gimnasio: 0\u20136 d\u00edas'],['minutes',20,120,'Sesi\u00f3n: 20\u2013120 minutos']])if(!finite(x[k],min,max))errors.push(name);
 if(!['male','female'].includes(x.sex))errors.push('Selecciona el coeficiente de sexo de la f\u00f3rmula.');
 if(!['seated','standing','manual'].includes(x.job))errors.push('Selecciona tu actividad laboral.');
 if(!['loss','maintain','gain'].includes(x.goal))errors.push('Selecciona el objetivo.');
 if(![10,15].includes(+x.deficit))errors.push('D\u00e9ficit orientativo: 10 o 15 %.');
 if(![1.6,1.8,2].includes(+x.proteinPerKg)||![0.7,0.8,0.9].includes(+x.fatPerKg))errors.push('Revisa los coeficientes de macronutrientes.');
 if(![0,200].includes(+x.gap))errors.push('Selecciona el reparto diario.');
 return errors;
}
function calculate(x){const errors=validate(x);if(errors.length)return{ok:false,errors};
 const w=+x.weight,h=+x.height,a=+x.age,days=Math.round(+x.days),minutes=+x.minutes,steps=+x.steps;
 const ree=10*w+6.25*h-5*a+(x.sex==='male'?5:-161);
 const stepFactor=steps<3000?1.2:steps<6000?1.3:steps<9000?1.4:steps<12000?1.5:1.6;
 const workFloor={seated:1.2,standing:1.35,manual:1.5}[x.job];
 const dailyFactor=Math.max(stepFactor,workFloor); // Do not add steps on top of a work estimate that includes those steps.
 const gymFactor=days*0.035*(minutes/60),factor=Math.min(1.9,dailyFactor+gymFactor);
 const maintenance=ree*factor,change=x.goal==='loss'?-Number(x.deficit)/100:x.goal==='gain'?0.05:0;
 const average=maintenance*(1+change),gap=days>0?+x.gap:0;
 const gym=round25(average+gap*(7-days)/7),rest=round25(average-gap*days/7);
 const protein=Math.round(w*(+x.proteinPerKg)),fat=Math.round(w*(+x.fatPerKg));
 const gymCarbs=Math.round((gym-4*protein-9*fat)/4),restCarbs=Math.round((rest-4*protein-9*fat)/4);
 const bmi=w/((h/100)**2),warnings=[];
 if(a>78)warnings.push('Tu edad queda fuera del rango de 19\u201378 a\u00f1os de la muestra original. Mayor incertidumbre.');
 if(bmi<18.5&&x.goal==='loss')warnings.push('No se propone un d\u00e9ficit con este peso y altura. Revisa tu situaci\u00f3n con un profesional.');
 if(gym<1600||rest<1600||gym>4500||rest>4500)warnings.push('Resultado fuera del intervalo operativo de la app (1.600\u20134.500 kcal). No es un umbral cl\u00ednico de seguridad: requiere individualizaci\u00f3n.');
 if(protein<100||protein>240)warnings.push('Prote\u00edna fuera del intervalo de ajustes de esta versi\u00f3n (100\u2013240 g). Revisa la pauta de forma individual.');
 if(Math.min(gymCarbs,restCarbs)<50)warnings.push('Reparto de macros poco apropiado para esta herramienta. Revisa la energ\u00eda y las cantidades.');
 const allowed=!(bmi<18.5&&x.goal==='loss')&&gym>=1600&&rest>=1600&&gym<=4500&&rest<=4500&&protein>=100&&protein<=240&&Math.min(gymCarbs,restCarbs)>=50;
 return{ok:true,ree,maintenance,factor,stepFactor,workFloor,dailyFactor,gymFactor,change,gym,rest,protein,fat,gymCarbs,restCarbs,average:(gym*days+rest*(7-days))/7,days,bmi,warnings,allowed};
}
function trend(logs,end){
 const day=86400000,to=(d)=>Date.parse(d+'T12:00:00Z'),endN=to(end),blocks=[[],[],[]];
 const rows=logs.filter(l=>finite(l.weight,40,220)&&Number.isFinite(to(l.date))&&to(l.date)<=endN);
 for(const r of rows){const age=Math.round((endN-to(r.date))/day);if(age>=0&&age<21)blocks[Math.floor(age/7)].push(+r.weight);}
 const means=blocks.map(b=>b.length>=3?b.reduce((a,c)=>a+c,0)/b.length:null),enough=means.every(v=>v!==null);
 const waists=logs.filter(l=>finite(l.waist,40,200)&&to(l.date)<=endN&&to(l.date)>=endN-20*day).sort((a,b)=>a.date.localeCompare(b.date));
 const waistDiff=waists.length>=2&&to(waists.at(-1).date)-to(waists[0].date)>=14*day?waists.at(-1).waist-waists[0].waist:null;
 return{counts:blocks.map(b=>b.length),means,enough,weekly:enough?(means[0]-means[2])/2:null,waistDiff};
}
function review(t,goal,flags){
 if(!t.enough)return{delta:0,title:'Faltan datos comparables',text:'Registra al menos 3 pesos en cada uno de los \u00faltimos 3 bloques de 7 d\u00edas. No recortamos por un peso aislado.'};
 if(flags.confounded)return{delta:0,title:'Espera antes de ajustar',text:'Creatina reciente, enfermedad, cambios de hidrataci\u00f3n o de rutina pueden alterar la b\u00e1scula. Mant\u00e9n el plan y revisa la tendencia m\u00e1s adelante.'};
 if(!flags.consistent)return{delta:0,title:'Primero, regularidad',text:'El men\u00fa planificado no demuestra lo que has comido. Revisa cantidades reales, fines de semana y actividad antes de modificar calor\u00edas.'};
 const pct=t.weekly/t.means[0]*100;
 if(flags.performance||pct<-.75)return{delta:125,title:'Valora un peque\u00f1o aumento',text:'La p\u00e9rdida es r\u00e1pida o notas peor rendimiento. Revisa sue\u00f1o, entrenamiento e ingesta; proponemos +125 kcal como prueba, no como diagn\u00f3stico.'};
 if(goal==='loss'&&pct>-.1){if(t.waistDiff!==null&&t.waistDiff<=-.5)return{delta:0,title:'La cintura est\u00e1 bajando',text:'Aunque el peso apenas cambie, no hace falta recortar. Mant\u00e9n las cantidades y observa fuerza y medidas.'};return{delta:-125,title:'Valora un ajuste peque\u00f1o',text:'No hay una bajada clara en tres semanas comparables. Antes de reducir 125 kcal, comprueba etiquetas, cantidades y que la cintura no est\u00e9 bajando.'};}
 if(goal==='gain'&&pct<.05)return{delta:125,title:'Valora subir un poco la ingesta',text:'Tras tres semanas comparables apenas sube el peso. Considera +125 kcal y revisa otras dos semanas.'};
 return{delta:0,title:'Mant\u00e9n y observa',text:'No hay motivo claro para cambiar las calor\u00edas con estos datos. Contin\u00faa registrando cintura y rendimiento sin perseguir cambios diarios.'};
}
return{calculate,validate,trend,review,round25};
})();
