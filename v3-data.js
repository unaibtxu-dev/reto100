/* Reto 100 Nube 1.1: own guides, optional session variants. No stored plan is overwritten. */
window.R100_V3 = (() => {
'use strict';
const X=window.R100_EXTRA;
const ace='https://www.acefitness.org/resources/everyone/exercise-library/';
const E=(id,name,group,secondary,equipment,reps,rest,steps,error)=>X.exercises[id]={id,name,group,secondary,equipment,reps,rest,steps,error,source:ace};
E('row_one','Remo con mancuerna a una mano','Espalda','Dorsal, espalda media y b\u00edceps','Mancuerna y banco','8\u201312 / lado',120,
 ['Apoya una mano y una rodilla en un banco estable. Mant\u00e9n la espalda en una posici\u00f3n c\u00f3moda y firme.','Lleva el codo de trabajo hacia la cadera sin girar el tronco ni subir el hombro.','Baja la mancuerna con control y completa ambos lados. Anota los kg de una mancuerna.'], 'Girar el tronco o tirar con un impulso de todo el cuerpo.');
E('row_chest','Remo con pecho apoyado','Espalda','Dorsal, romboides y b\u00edceps','Mancuernas y banco inclinado','8\u201312',120,
 ['Ajusta un banco a unos 30\u201345 grados y apoya el pecho. Deja colgar las mancuernas y estabiliza los pies.','Lleva los codos hacia atr\u00e1s con el pecho apoyado y los hombros lejos de las orejas.','Baja despacio hasta un estiramiento c\u00f3modo. No rebotes sobre el banco.'], 'Despegar el pecho para mover m\u00e1s peso o extender mucho el cuello.');
E('row_bar','Remo inclinado con barra','Espalda','Dorsal, espalda media y estabilizadores del tronco','Barra','6\u201310',150,
 ['Flexiona ligeramente las rodillas y lleva la cadera hacia atr\u00e1s para inclinar el torso. Usa una carga que te permita sostener esa posici\u00f3n.','Acerca la barra a la parte baja del abdomen llevando los codos atr\u00e1s.','Extiende los brazos con control sin levantarte en cada repetici\u00f3n.'], 'Convertir el remo en un tir\u00f3n con piernas y zona lumbar. El remo con pecho apoyado es una alternativa.');
E('lat_neutral','Jal\u00f3n con agarre neutro','Espalda','Dorsal y b\u00edceps','Polea alta y agarre neutro','8\u201312',120,
 ['Ajusta el apoyo de los muslos y coge un agarre con las palmas enfrentadas.','Lleva los codos hacia abajo, acercando el agarre a la parte alta del pecho sin balancearte.','Deja subir los brazos de forma controlada sin perder el apoyo.'], 'Tirar detr\u00e1s de la nuca o reclinarte demasiado.');
E('pullup','Dominada con asistencia','Espalda','Dorsal, b\u00edceps y espalda alta','Barra y m\u00e1quina asistida o banda','6\u201310',150,
 ['Elige asistencia suficiente y sigue las instrucciones de tu m\u00e1quina. Agarre c\u00f3modo con pulgar cerrado.','Lleva los codos hacia el cuerpo, elev\u00e1ndote sin balancear las piernas ni estirar el cuello.','Desciende despacio en un recorrido c\u00f3modo. La animaci\u00f3n muestra el movimiento, no el mecanismo de asistencia.'], 'Anota kg de asistencia: m\u00e1s asistencia suele significar menos dificultad. No los sumes al peso levantado.');
E('pullover','Pullover en polea alta','Espalda','Dorsal; hombro y tronco estabilizan','Polea alta y cuerda o barra','10\u201315',90,
 ['Da un paso atr\u00e1s y flexiona ligeramente cadera y rodillas. Sujeta el agarre con los codos algo flexionados.','Lleva los brazos hacia los muslos manteniendo pr\u00e1cticamente el mismo \u00e1ngulo del codo.','Vuelve arriba hasta un recorrido c\u00f3modo, sin arquear la zona lumbar.'], 'Transformarlo en una extensi\u00f3n de tr\u00edceps o empujar con todo el tronco.');
E('highrow','Remo alto en polea','Espalda','Espalda alta, dorsal y deltoides posterior','Polea ajustable y banco','10\u201312',120,
 ['Si\u00e9ntate frente a una polea situada algo por encima del pecho; pies firmes y torso estable.','Lleva el agarre hacia la zona baja del pecho, acompa\u00f1ando con los codos sin elevar los hombros.','Devuelve los brazos despacio. Ajusta el asiento y la polea al recorrido que toleres.'], 'Echarte hacia atr\u00e1s para completar la repetici\u00f3n.');
E('incline_curl','Curl inclinado con mancuernas','Brazos','B\u00edceps','Mancuernas y banco inclinado','10\u201312',90,
 ['Si\u00e9ntate con la espalda apoyada en un banco inclinado y deja caer los brazos.','Flexiona los codos sin adelantar el hombro ni separar la espalda del respaldo.','Baja con control y evita forzar el estiramiento del hombro.'], 'Balancear el torso o usar una inclinaci\u00f3n que moleste en el hombro.');
E('preacher','Curl predicador con mancuerna','Brazos','B\u00edceps y braquial','Mancuerna y banco predicador','10\u201315 / lado',90,
 ['Apoya el brazo sobre el banco y ajusta la altura para no encoger el hombro.','Flexiona el codo manteniendo el brazo apoyado. Usa menos carga que en un curl libre.','Desciende despacio sin golpear el final del recorrido ni forzar el codo.'], 'Rebotar con el codo extendido o levantar el brazo del apoyo.');
E('cablecurl','Curl de b\u00edceps en polea baja','Brazos','B\u00edceps','Polea baja y barra','10\u201315',90,
 ['Col\u00f3cate frente a la polea baja, con pies firmes y codos cerca del tronco.','Flexiona los codos llevando la barra hacia arriba sin doblar las mu\u00f1ecas.','Baja con control manteniendo el torso quieto.'], 'Ayudarte con un balanceo de cadera o despegar mucho los codos.');
E('overhead','Tr\u00edceps por encima de la cabeza','Brazos','Tr\u00edceps','Mancuerna y banco','10\u201315',90,
 ['Sujeta una mancuerna con ambas manos y col\u00f3cala sobre la cabeza, sentado con apoyo estable.','Flexiona los codos para bajar la mancuerna detr\u00e1s de la cabeza, sin forzar hombros ni cuello.','Extiende los codos con control manteniendo las costillas y la pelvis estables.'], 'Arquear mucho la espalda o insistir en un recorrido doloroso. Anota el peso de la \u00fanica mancuerna.');
E('kickback','Extensi\u00f3n de tr\u00edceps con mancuerna','Brazos','Tr\u00edceps','Mancuerna y apoyo','12\u201315 / lado',75,
 ['Ap\u00f3yate con una mano e inclina el tronco. Mant\u00e9n el brazo de trabajo cerca del costado.','Extiende el codo llevando la mancuerna hacia atr\u00e1s sin mover el hombro.','Regresa con control y usa una carga ligera. Completa ambos brazos.'], 'Balancear toda la mancuerna desde el hombro.');
E('dbbench','Press plano con mancuernas','Pecho','Tr\u00edceps y hombro anterior','Mancuernas y banco','8\u201312',150,
 ['Apoya pies y espalda alta. Coloca las mancuernas a los lados del pecho, con las mu\u00f1ecas firmes.','Empuja arriba en un arco c\u00f3modo sin chocar las mancuernas.','Baja despacio sin forzar la profundidad. Aprende a colocarlas y retirarlas con seguridad.'], 'Dejar caer las mancuernas sin control o perder el apoyo de los pies.');
E('pushup','Flexiones de brazos','Pecho','Tr\u00edceps, hombro anterior y abdomen','Suelo o banco estable','6\u201315',90,
 ['Apoya las manos algo m\u00e1s abiertas que los hombros y alinea cabeza, tronco y pelvis.','Flexiona los codos para acercar el pecho al suelo sin hundir la cadera.','Empuja manteniendo el cuerpo como un bloque. Apoya las manos en un banco para reducir dificultad.'], 'Dejar caer la zona lumbar o avanzar solo con la cabeza.');
E('reversefly','Aperturas inversas en m\u00e1quina','Hombros','Deltoides posterior y espalda alta','M\u00e1quina peck-deck inversa','12\u201315',90,
 ['Si\u00e9ntate de cara al respaldo y apoya el pecho. Ajusta los agarres aproximadamente a la altura de los hombros.','Abre los brazos con una ligera flexi\u00f3n de codos, sin sacar el pecho del apoyo.','Vuelve despacio sin golpear las placas.'], 'Encoger los hombros o llevar los brazos m\u00e1s atr\u00e1s de lo que permiten c\u00f3modamente.');
E('cablelateral','Elevaci\u00f3n lateral en polea','Hombros','Deltoides lateral','Polea baja','12\u201320 / lado',75,
 ['Coloca la polea abajo y sujeta el agarre con la mano m\u00e1s alejada. Mant\u00e9n el cuerpo estable.','Eleva el brazo a un lado, algo por delante del cuerpo, hasta una altura c\u00f3moda.','Baja despacio. Trabaja ambos lados con una carga que no obligue a balancearte.'], 'Subir el hombro hacia la oreja o tomar impulso con el tronco.');
E('split_squat','Sentadilla b\u00falgara','Piernas','Cu\u00e1driceps y gl\u00fateos','Banco bajo y mancuernas opcionales','8\u201310 / lado',120,
 ['Apoya el empeine trasero en un banco bajo y deja el pie delantero suficientemente lejos para bajar con equilibrio.','Flexiona ambas piernas, dejando que la rodilla delantera siga la direcci\u00f3n del pie.','Empuja con el pie delantero. Empieza sin mancuernas y usa un apoyo si hace falta.'], 'Usar un banco demasiado alto o perder el equilibrio antes de trabajar la pierna.');
E('lunges','Zancada est\u00e1tica','Piernas','Cu\u00e1driceps y gl\u00fateos','Mancuernas opcionales','8\u201312 / lado',120,
 ['Separa los pies en una zancada, con anchura suficiente para mantener el equilibrio.','Baja flexionando ambas rodillas sin golpear la rodilla trasera contra el suelo.','Sube apoy\u00e1ndote en toda la planta del pie delantero. Termina el lado antes de cambiar.'], 'Colocar los pies sobre una sola l\u00ednea muy estrecha o rebotar abajo.');
E('deadbug','Bicho muerto (dead bug)','Abdomen','Control del tronco','Colchoneta','6\u201310 / lado',60,
 ['T\u00fambate boca arriba con brazos elevados y caderas y rodillas flexionadas. Respira con normalidad.','Aleja lentamente un brazo y la pierna contraria sin que la zona lumbar se arquee.','Vuelve al centro y alterna. Acorta el recorrido si pierdes el control.'], 'Buscar mucho recorrido a costa de separar la zona lumbar del suelo.');
E('sideplank','Plancha lateral','Abdomen','Oblicuos y estabilizadores de cadera','Colchoneta','20\u201335 s / lado',60,
 ['Apoya el antebrazo con el codo debajo del hombro y eleva la cadera.','Mant\u00e9n el cuerpo alineado, sin girar el tronco, respirando durante el tiempo previsto.','Completa ambos lados. Empieza con las rodillas apoyadas para reducir dificultad.'], 'Hundir el hombro o continuar cuando la cadera pierde la posici\u00f3n. Es isom\u00e9trica.');
const row=(id,sets,reps,kg=null)=>({id,sets,reps:reps||X.exercises[id].reps,kg,done:false});
function routine(id,title,sub,items,minutes){X.routines[id]={id,title,sub,minutes,items:items.map(v=>row(...v))};}
routine('push_short','Empuje expr\u00e9s','Pecho, hombro y tr\u00edceps \u00b7 30\u201340 min',[['bench',3,'5',62.5],['incline',2],['lateral',2],['triceps',2]],35);
routine('pull_short','Tir\u00f3n expr\u00e9s','Espalda y b\u00edceps \u00b7 30\u201340 min',[['lat',3],['row_chest',3],['curl',2]],35);
routine('legs_short','Pierna expr\u00e9s','Pierna y abdomen \u00b7 35\u201345 min',[['legpress',3],['rdl',2],['hamcurl',2],['plank',2]],40);
routine('push_var','Empuje con mancuernas','Pecho, hombro y tr\u00edceps \u00b7 alternativa sin banca libre',[['dbbench',3],['incline',2],['cablelateral',3],['overhead',2]],50);
routine('pull_var','Espalda y b\u00edceps B','Variantes de remo y jal\u00f3n',[['lat_neutral',3],['row_one',3],['pullover',2],['incline_curl',2],['hammer',2]],55);
routine('back_focus','Espalda completa','Tir\u00f3n vertical + horizontal + accesorio',[['lat',3],['row_chest',3],['pullover',2],['facepull',2]],45);
routine('arms','Brazos y hombro lateral','B\u00edceps y tr\u00edceps sin repetir otro d\u00eda entero de torso',[['curl',3],['overhead',3],['hammer',2],['triceps',2],['lateral',2]],45);
routine('arms_short','Brazos expr\u00e9s','Cuatro ejercicios \u00b7 25\u201335 min',[['cablecurl',2],['triceps',2],['hammer',2],['overhead',2]],30);
routine('chest_focus','Pecho y banca','Sesi\u00f3n corta centrada en pecho',[['bench',3,'5',62.5],['incline',2],['fly',2]],40);
routine('shoulder_core','Hombros y abdomen','Accesorios sin otra sesi\u00f3n pesada de banca',[['shoulder',2],['cablelateral',3],['reversefly',2],['deadbug',2],['sideplank',2]],40);
routine('legs_var','Pierna y abdomen B','Trabajo unilateral y gl\u00fateo',[['legpress',3],['split_squat',2],['hipthrust',3],['hamcurl',2],['calf',2],['deadbug',2]],60);
Object.assign(X.plans,{
 'ppl3':{name:'3 d\u00edas \u00b7 empuje / tir\u00f3n / pierna',short:'Pecho / espalda / pierna',description:'Tu reparto por grupos. Cada zona recibe una sesi\u00f3n principal; frente a cuerpo completo, practica menos veces la banca.',days:['push',null,'pull_var',null,'legs',null,null]},
 'ppla4':{name:'4 d\u00edas \u00b7 empuje / tir\u00f3n / pierna / brazos',short:'Pecho / espalda / pierna / brazos',description:'La opci\u00f3n que pediste. Brazos cuentan tambi\u00e9n de forma indirecta en el resto: vigila la recuperaci\u00f3n.',days:['push','pull_var',null,'legs',null,'arms',null]},
 'pplu4':{name:'4 d\u00edas \u00b7 empuje / tir\u00f3n / pierna / torso',short:'Por grupos + segunda banca',description:'A\u00f1ade una segunda pr\u00e1ctica de banca y espalda. Solo tiene una sesi\u00f3n principal de pierna; alt\u00e9rnalo con torso/pierna si deseas repartir m\u00e1s.',days:['push','pull_var',null,'legs',null,'upper5',null]},
 'pplua5':{name:'5 d\u00edas \u00b7 por grupos + torso y brazos',short:'Por grupos + torso + brazos',description:'Semana ocasional con m\u00e1s disponibilidad. No se suma a la semana anterior: sustituye su reparto.',days:['push','pull_var','legs',null,'upper5','arms_short',null]}
});
const photos={gnocchi_chicken:'gnocchi',gnocchi_turkey:'gnocchi',rice_turkey:'rice',pasta_tuna:'pasta',turkey_pasta:'pasta',lentil_chicken:'lentils',couscous_chicken:'couscous',chickpea_tofu:'tofu',salmon_potato:'salmon',salmon_couscous:'salmon',hake_rice:'hake',omelette_potato:'omelette',burger_rice:'burger',egg_chickpea:'chickpeas',bowl:'bowl',bowl_no_whey:'bowl',bowl_banana:'bowl'};
const sources=[
 {title:'Mifflin y colaboradores (1990)',url:'https://pubmed.ncbi.nlm.nih.gov/2305711/',text:'Ecuaci\u00f3n para estimar el gasto en reposo. No mide el gasto total ni prescribe una dieta.'},
 {title:'NIDDK \u00b7 Body Weight Planner',url:'https://www.niddk.nih.gov/health-information/weight-management/body-weight-planner',text:'Las necesidades dependen de la actividad y de la evoluci\u00f3n. Nuestra calculadora es m\u00e1s sencilla: no reproduce el modelo din\u00e1mico del NIDDK.'},
 {title:'ISSN \u00b7 prote\u00edna y ejercicio',url:'https://link.springer.com/article/10.1186/s12970-017-0177-8',text:'Referencia general de prote\u00edna para adultos que entrenan. Las cantidades de esta app son propuestas iniciales, no una pauta cl\u00ednica.'},
 {title:'ACSM \u00b7 fuerza e hipertrofia 2026',url:'https://acsm.org/resistance-training-guidelines-update-2026/',text:'Regularidad, progresi\u00f3n y entrenamiento de todo el cuerpo. Las plantillas concretas y los avisos de esta app son dise\u00f1o propio.'},
 {title:'ACE \u00b7 biblioteca de ejercicios',url:ace,text:'Referencia general para la ejecuci\u00f3n. Las gu\u00edas y dibujos de esta app son propios; no son grabaciones ni material de ACE.'}
];
return {photos,sources,version:'1.1.0'};
})();
