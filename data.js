/* Reto 100 - Datos orientativos. Cantidades comestibles, antes de cocinar,
   excepto conservas (escurridas), noquis y lacteos (como se venden).
   No es una base de datos de etiquetas verificadas. */
window.R100_DATA = (() => {
 const foods = {};
 function f(id,name,category,kcal,p,c,fat,pack=500,note='',packName='') {
  foods[id]={id,name,category,kcal,p,c,f:fat,pack,note,packName};
 }
 f('gnocchi','\u00d1oquis frescos de patata','carbs',160,3.5,32,1,500,'Peso tal como vienen en el paquete. Marca pendiente de confirmar.');
 f('rice','Arroz','carbs',358,7,79,0.9,1000,'Peso en seco.');
 f('pasta','Pasta','carbs',350,12,70,1.5,500,'Peso en seco.');
 f('couscous','Cusc\u00fas','carbs',360,12,72,2,500,'Peso en seco.');
 f('oats','Copos de avena','carbs',370,13,59,7,500,'Peso en seco.');
 f('bread','Pan integral','carbs',250,9,44,3.5,500,'Peso del pan listo para comer.');
 f('potato','Patata','produce',77,2,17,0.1,1000,'Peso en crudo, parte comestible.');
 f('chicken','Pechuga de pollo','proteins',110,23,0,1.5,500,'Peso en crudo, sin hueso.');
 f('turkey','Pechuga de pavo','proteins',110,24,0,1,500,'Carne fresca; no fiambre. Peso en crudo.');
 f('beef','Ternera picada magra','proteins',130,22,0,4.5,500,'Peso en crudo. Elige una mezcla magra y revisa la etiqueta.');
 f('salmon','Salm\u00f3n','proteins',208,20,0,13,400,'Peso en crudo, sin espinas.');
 f('hake','Merluza','proteins',80,17,0,1.3,400,'Peso en crudo, sin espinas.');
 f('tuna','At\u00fan al natural','proteins',116,26,0,1,156,'Peso escurrido; revisa los gramos por lata.');
 f('eggs','Huevos','proteins',143,12.6,0.7,9.5,300,'50 g comestibles por huevo, como aproximaci\u00f3n.','6 huevos');
 f('whites','Claras pasteurizadas','proteins',46,10.5,0.7,0.2,500,'Pesar en gramos y cocinar.');
 f('tofu','Tofu firme','proteins',140,14,2,8,400,'Peso escurrido.');
 f('lentils','Lentejas cocidas','pantry',90,6.5,13,0.5,400,'Peso cocido y escurrido; no confundir con legumbre seca.');
 f('chickpeas','Garbanzos cocidos','pantry',120,6.5,17,2.3,400,'Peso cocido y escurrido.');
 f('yogurt','Yogur griego ligero Hacendado','dairy',60,5.8,4.7,2,750,'Referencia provisional: confirma los valores de tu envase.','6 yogures de 125 g');
 f('skyr','Skyr natural / l\u00e1cteo alto en prote\u00edna','dairy',62,11,4,0.2,500,'Referencia gen\u00e9rica, no equivale a cualquier yogur.');
 f('whey','Whey Cookies & Cream','supplements',380,74,8,6,1000,'Valor orientativo de suero con sabor, NO etiqueta verificada de tu bolsa. Pesar 30 g; no asumir que 1 cacito son 30 g.');
 f('peanut','Crema 100 % cacahuete','pantry',620,28,12,50,500,'Revisa la etiqueta. Contiene cacahuete.');
 f('oil','Aceite de oliva','pantry',900,0,0,100,910,'Pesar en gramos; 1 litro pesa aproximadamente 910 g.','botella de 1 l aprox.');
 f('tomato','Tomate triturado natural','pantry',30,1.2,4.5,0.3,400,'Sin contar aceite adicional: ya est\u00e1 en la receta.');
 f('veg','Verduras variadas','produce',35,1.8,5,0.5,1000,'Peso en crudo. Alterna br\u00f3coli, calabac\u00edn, zanahoria, pimiento y hojas verdes.');
 f('berries','Frutos rojos','produce',45,1,7,0.5,500,'Frescos o congelados. Sigue las instrucciones del envase.');
 f('apple','Manzana','produce',52,0.3,12,0.2,1000,'Peso comestible; 150 g es una pieza peque\u00f1a aproximada.');
 f('banana','Pl\u00e1tano','produce',89,1.1,20,0.3,1000,'Peso sin piel; 120 g es una pieza mediana aproximada.');
 f('orange','Naranja','produce',47,0.9,9,0.1,1000,'Peso sin piel.');
 f('creatine','Creatina monohidrato','supplements',0,0,0,0,300,'Ya la tienes: comprueba tus existencias. No cuenta como proteina.');
 const recipes={};
 // Each ingredient is [food, grams on rest days, grams on gym days].
 function r(id,name,time,kind,tag,ingredients,steps,allergens,tip='') {
  recipes[id]={id,name,time,kind,tag,ingredients:ingredients.map(([food,rest,gym])=>({food,rest,gym:gym===undefined?rest:gym})),steps,allergens,tip};
 }
 r('gnocchi_chicken','\u00d1oquis con pollo y tomate',20,'main','Tu favorito',
 [['gnocchi',250,300],['chicken',200],['tomato',150],['veg',200],['oil',10],['apple',150]],
 ['Corta el pollo en dados y coc\u00ednalo con el aceite medido. Reserva.','Cocina las verduras, a\u00f1ade el tomate y sazona con or\u00e9gano y pimienta.','Prepara los \u00f1oquis seg\u00fan su envase y mezcla con el pollo y la salsa. La manzana va de postre.'],
 'Puede contener trigo, huevo o leche: revisa los \u00f1oquis.','Para el t\u00e1per de las 14:00. Si te resulta pesado, deja la fruta para m\u00e1s tarde.');
 r('rice_turkey','Arroz con pavo y verduras',25,'main','T\u00e1per f\u00e1cil',
 [['rice',90,115],['turkey',200],['veg',250],['oil',10],['banana',120]],
 ['Cuece el arroz.','Saltea el pavo con el aceite medido y las verduras hasta que est\u00e9 bien cocinado.','Mezcla, sazona y toma el pl\u00e1tano de postre o despu\u00e9s.'],
 'Sin al\u00e9rgenos de declaraci\u00f3n obligatoria en los ingredientes base.','Enfr\u00eda el arroz r\u00e1pidamente y conserva el t\u00e1per refrigerado.');
 r('pasta_tuna','Pasta con at\u00fan y tomate',20,'main','Despensa',
 [['pasta',90,115],['tuna',150],['tomato',200],['veg',150],['oil',15],['apple',150]],
 ['Cuece la pasta en agua.','Cocina las verduras con el aceite y el tomate. Incorpora el at\u00fan escurrido.','Mezcla con la pasta. Toma la manzana de postre.'],
 'Trigo/gluten y pescado.');
 r('lentil_chicken','Lentejas con pollo y arroz',25,'main','Con legumbre',
 [['lentils',200],['rice',50,75],['chicken',150],['veg',200],['tomato',100],['oil',15],['orange',200]],
 ['Cuece el arroz y escurre las lentejas.','Cocina el pollo con el aceite, las verduras y el tomate.','Incorpora lentejas y arroz. Sirve con la naranja de postre.'],
 'Revisa las conservas y posibles trazas.','Las legumbres van ya cocidas y escurridas. Ajusta su cantidad si te molestan antes de entrenar.');
 r('couscous_chicken','Cusc\u00fas con pollo y verduras',20,'main','20 minutos',
 [['couscous',100,125],['chicken',180],['veg',250],['oil',10],['orange',200]],
 ['Hidrata el cusc\u00fas siguiendo las instrucciones del envase.','Cocina el pollo y las verduras con el aceite medido.','Mezcla y sazona con piment\u00f3n o comino. Toma la naranja de postre.'],
 'Trigo/gluten.');
 r('gnocchi_turkey','\u00d1oquis con pavo al piment\u00f3n',20,'main','Otra salsa',
 [['gnocchi',250,300],['turkey',200],['tomato',150],['veg',200],['oil',5],['apple',150]],
 ['Cocina el pavo troceado con el aceite y las verduras.','A\u00f1ade piment\u00f3n y tomate sin dejar que el piment\u00f3n se queme.','Prepara los \u00f1oquis seg\u00fan el envase y mezcla. Manzana de postre.'],
 'Puede contener trigo, huevo o leche: revisa los \u00f1oquis.');
 r('chickpea_tofu','Garbanzos con tofu y arroz',25,'main','Vegetal',
 [['chickpeas',150],['tofu',200],['rice',40,65],['veg',200],['tomato',100],['oil',5],['orange',200]],
 ['Cuece el arroz y escurre los garbanzos y el tofu.','Dora el tofu con el aceite y cocina las verduras y el tomate.','A\u00f1ade garbanzos y arroz, mezcla y sirve. Naranja de postre.'],
 'Soja.');
 r('salmon_potato','Salm\u00f3n con patata al horno',35,'main','Horno',
 [['salmon',175],['potato',300,350],['veg',200],['oil',5],['skyr',150],['bread',20,40],['banana',100]],
 ['Corta las patatas y horn\u00e1alas con el aceite medido a unos 200 \u00b0C.','A\u00f1ade las verduras y el salm\u00f3n; cocina hasta que todo est\u00e9 bien hecho. El tiempo depende del grosor.','Acompa\u00f1a con el pan. Toma el skyr y el pl\u00e1tano de postre, o rep\u00e1rtelos a lo largo de la tarde.'],
 'Pescado, leche y trigo/gluten.');
 r('hake_rice','Merluza con arroz y verduras',25,'main','Suave',
 [['hake',250],['rice',90,115],['veg',250],['oil',20],['skyr',200],['orange',200]],
 ['Cuece el arroz y cocina las verduras.','Haz la merluza a la plancha con parte del aceite. A\u00f1ade el resto al plato terminado.','Sirve con el arroz. Skyr y naranja de postre.'],
 'Pescado y leche.');
 r('omelette_potato','Tortilla de patata y claras',30,'main','Sin fritura',
 [['eggs',150],['whites',200],['potato',350,450],['veg',200],['oil',15],['bread',20,40],['skyr',150],['apple',150]],
 ['Cocina las patatas en dados al microondas en un recipiente adecuado o al horno; no hace falta fre\u00edrlas.','Bate los 3 huevos con las claras, a\u00f1ade la patata y cuaja con el aceite medido. Cocina bien el interior.','Sirve con verduras y pan. Skyr y manzana de postre.'],
 'Huevo, leche y trigo/gluten.');
 r('salmon_couscous','Salm\u00f3n con cusc\u00fas',25,'main','Cena completa',
 [['salmon',175],['couscous',75,100],['veg',250],['oil',5],['skyr',200],['orange',200]],
 ['Hidrata el cusc\u00fas seg\u00fan el envase.','Cocina el salm\u00f3n y las verduras con el aceite.','Sirve y acompa\u00f1a con skyr y naranja de postre.'],
 'Pescado, trigo/gluten y leche.');
 r('turkey_pasta','Pasta con pavo y verduras',25,'main','Para repetir',
 [['pasta',90,120],['turkey',180],['tomato',150],['veg',200],['oil',15],['skyr',150],['banana',120]],
 ['Cuece la pasta.','Cocina el pavo, las verduras y el tomate con el aceite medido.','Mezcla y sirve. Toma el skyr y el pl\u00e1tano de postre.'],
 'Trigo/gluten y leche.');
 r('burger_rice','Hamburguesa casera con arroz',25,'main','Fin de semana',
 [['beef',200],['rice',85,110],['veg',250],['oil',10],['skyr',150],['orange',200]],
 ['Cuece el arroz y prepara las verduras.','Forma una hamburguesa con la carne picada y coc\u00ednala bien por dentro con el aceite medido.','Sirve con el arroz y las verduras. Skyr y naranja de postre.'],
 'Leche. No a\u00f1adas pan ni salsas sin registrarlos en el men\u00fa.');
 r('egg_chickpea','Garbanzos salteados con huevo',25,'main','Domingo sencillo',
 [['chickpeas',200],['eggs',100],['whites',200],['veg',250],['oil',10],['bread',50,90],['skyr',150],['apple',150]],
 ['Escurre los garbanzos y salt\u00e9alos con las verduras y el aceite.','A\u00f1ade los 2 huevos y las claras y remueve hasta cuajar bien.','Sirve con pan. Skyr y manzana de postre.'],
 'Huevo, leche y trigo/gluten.');
 r('bowl','Bol Cookies & Cream',5,'snack','Tu merienda',
 [['yogurt',250],['whey',30],['oats',50],['berries',100],['peanut',20]],
 ['Mezcla el yogur con los 30 g de whey. A\u00f1ade un poco de agua si queda demasiado espeso.','Incorpora la avena y los frutos rojos preparados seg\u00fan su envase.','Termina con la crema de cacahuete. Sin miel. Puedes dejar ablandar la avena en la nevera.'],
 'Leche, cacahuete; posible gluten y soja seg\u00fan la whey y la avena.','Antes o despu\u00e9s del paseo: elige el momento que te resulte c\u00f3modo. Mant\u00e9n el yogur fr\u00edo.');
 r('bowl_no_whey','Bol sin prote\u00edna en polvo',5,'snack','Sin suplemento',
 [['skyr',350],['oats',50],['berries',100],['peanut',20],['banana',50]],
 ['Pon el skyr en un bol y mezcla con la avena.','A\u00f1ade los frutos rojos y el pl\u00e1tano.','Termina con la crema de cacahuete. No lleva whey ni miel.'],
 'Leche, cacahuete y posible gluten de la avena.','Sustituci\u00f3n real con m\u00e1s l\u00e1cteo alto en prote\u00edna; no cambies whey por fruta esperando la misma prote\u00edna.');
 r('bowl_banana','Bol de pl\u00e1tano y cacahuete',5,'snack','Cambia la fruta',
 [['yogurt',250],['whey',30],['oats',40],['banana',120],['peanut',15]],
 ['Mezcla el yogur y la whey hasta obtener una crema.','A\u00f1ade avena y pl\u00e1tano en rodajas.','Termina con crema de cacahuete y canela opcional. Sin miel.'],
 'Leche, cacahuete; posible gluten y soja.');
 const rotation=[
  ['gnocchi_chicken','salmon_potato'],['rice_turkey','hake_rice'],['pasta_tuna','omelette_potato'],
  ['lentil_chicken','salmon_couscous'],['couscous_chicken','turkey_pasta'],['gnocchi_turkey','burger_rice'],['chickpea_tofu','egg_chickpea']
 ];
 const routines=[
 {id:'A',day:'Lunes',title:'Torso A',subtitle:'Prioridad: press banca',duration:'65\u201375 min',exercises:[
 ['Press banca con barra libre','4 \u00d7 5','62,5 kg','3\u20134 min','Deja 1\u20132 repeticiones en reserva. Carga inicial orientativa.'],
 ['Remo con apoyo de pecho','3 \u00d7 8\u201310','Ajustable','2 min','Sin balancearte; controla la bajada.'],
 ['Press inclinado con mancuernas','2 \u00d7 8\u201310','Ajustable','2 min','No busques el fallo.'],
 ['Jal\u00f3n al pecho','3 \u00d7 8\u201312','Ajustable','2 min','Baja delante del pecho, con control.'],
 ['Tr\u00edceps en polea','2 \u00d7 10\u201312','Ajustable','1\u20132 min','Mant\u00e9n los codos estables.'],
 ['Elevaciones laterales','2 \u00d7 12\u201315','Ajustable','1\u20132 min','Controla el recorrido; sin impulso.']]},
 {id:'B',day:'Martes',title:'Pierna A',subtitle:'Fuerza del cuerpo completo',duration:'60\u201370 min',exercises:[
 ['Sentadilla o prensa','3 \u00d7 6\u201310','Ajustable','2\u20133 min','Escoge la variante que domines sin dolor.'],
 ['Peso muerto rumano','3 \u00d7 8','Ajustable','2\u20133 min','Cadera atr\u00e1s; espalda estable.'],
 ['Curl femoral','3 \u00d7 10\u201312','Ajustable','1\u20132 min','Movimiento controlado.'],
 ['Extensi\u00f3n de cu\u00e1driceps','2 \u00d7 12','Ajustable','1\u20132 min','Sin rebotes.'],
 ['Gemelos','3 \u00d7 12\u201315','Ajustable','1\u20132 min','Recorrido c\u00f3modo completo.'],
 ['Plancha','3 \u00d7 30\u201345 s','Peso corporal','1 min','Respira; sin perder la posici\u00f3n.']]},
 {id:'C',day:'Jueves',title:'Torso B + toque de pierna',subtitle:'Banca de volumen y t\u00e9cnica',duration:'65\u201380 min',exercises:[
 ['Press banca con barra libre','4 \u00d7 8','55 kg','2\u20133 min','Controla la bajada y deja 1\u20132 repeticiones en reserva.'],
 ['Dominadas asistidas o jal\u00f3n','3 \u00d7 8\u201310','Ajustable','2 min','Escoge una variante con buena t\u00e9cnica.'],
 ['Remo sentado','2 \u00d7 10\u201312','Ajustable','2 min','Evita dar tirones con el tronco.'],
 ['Prensa ligera','2 \u00d7 10\u201312','Ajustable','2 min','Segundo est\u00edmulo de pierna si solo entrenas 3 d\u00edas.'],
 ['Curl femoral','2 \u00d7 10\u201312','Ajustable','1\u20132 min','Mismo criterio de 1\u20132 repeticiones en reserva.'],
 ['Tr\u00edceps sobre la cabeza en polea','2 \u00d7 10\u201312','Ajustable','1\u20132 min','Recorrido sin molestias en hombro ni codo.'],
 ['Curl de b\u00edceps','2 \u00d7 10\u201312','Ajustable','1\u20132 min','Sin balanceo.']]},
 {id:'D',day:'S\u00e1bado opcional',title:'Pierna B y accesorios',subtitle:'Solo cuando puedas recuperarte bien',duration:'45\u201360 min',exercises:[
 ['Prensa','3 \u00d7 10','Ajustable','2\u20133 min','Carga moderada.'],
 ['Hip thrust','3 \u00d7 8\u201310','Ajustable','2 min','Pausa breve arriba, sin arquear en exceso.'],
 ['Zancadas','2 \u00d7 10 por pierna','Ajustable','2 min','Paso estable, sin prisa.'],
 ['Curl femoral','2 \u00d7 12','Ajustable','1\u20132 min','Recuperaci\u00f3n primero.'],
 ['Gemelos','3 \u00d7 12\u201315','Ajustable','1\u20132 min','Controla el movimiento.'],
 ['Elevaciones laterales','2 \u00d7 12\u201315','Ajustable','1\u20132 min','Opcional si te notas recuperado.']]}
 ];
 const sources=[
 {id:1,title:'Prote\u00edna y ejercicio \u00b7 ISSN (2017)',url:'https://pubmed.ncbi.nlm.nih.gov/28642676/',text:'Referencia para la prote\u00edna diaria, los alimentos y el uso opcional de suplementos.'},
 {id:2,title:'Entrenamiento de fuerza \u00b7 ACSM (2026)',url:'https://acsm.org/resistance-training-guidelines-update-2026/',text:'Constancia, adaptaci\u00f3n individual y entrenamiento sin necesidad de llegar siempre al fallo.'},
 {id:3,title:'Creatina \u00b7 ISSN (2017)',url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC5469049/',text:'Uso diario, sin fase de carga obligatoria y cambios iniciales del agua corporal.'},
 {id:4,title:'Dietas y composici\u00f3n corporal \u00b7 ISSN (2017)',url:'https://pubmed.ncbi.nlm.nih.gov/28630601/',text:'Balance energ\u00e9tico, adherencia y conservaci\u00f3n de masa muscular. No valida tus calor\u00edas individuales.'},
 {id:5,title:'Seguridad de los t\u00e1peres \u00b7 AESAN',url:'https://www.aesan.gob.es/en/actualidad/campanyas-seguridad-alimentaria/campania_verano',text:'Refrigeraci\u00f3n, transporte en fr\u00edo y recalentamiento seguro.'},
 {id:6,title:'Impact Whey \u00b7 informaci\u00f3n del fabricante',url:'https://www.myprotein.es/p/nutricion-deportiva/impact-whey-protein/11068070/',text:'Los valores dependen del sabor y la formulaci\u00f3n. La tabla de esta web es provisional: copia la etiqueta de tu bolsa.'}
 ];
 return {foods,recipes,rotation,routines,sources};
})();
