# Reto 100 Nube 1.1 - Actualización

Este paquete ACTUALIZA tu Reto 100 Nube ya publicado. No es una instalación nueva ni un HTML independiente.

## Antes de subir

1. En tu web actual, espera a ver **Sincronizado** y exporta una copia JSON desde Ajustes. Guárdala en privado, fuera del repositorio.
2. Cierra las pestañas de Reto 100 del ordenador y del móvil.
3. Descomprime este ZIP. No lo subas comprimido.

## Qué subir a GitHub

Entra en la **raíz de tu repositorio reto100**, donde ves la carpeta web (no dentro de ella).
Pulsa **Add file > Upload files** y arrastra la carpeta **web** de este paquete.

Comprueba que los cambios quedan en estas rutas:

- web/index.html (sustituir)
- web/app.js (sustituir)
- web/v3-data.js (nuevo)
- web/v3-calc.js (nuevo)
- web/v3.css (nuevo)
- web/assets/meals/ (12 imágenes WebP nuevas)

No debe aparecer web/web/ ni una carpeta Reto100_Nube_1_1_actualizacion dentro del repositorio.
Sube TODOS estos archivos en el mismo commit: el index nuevo necesita los tres archivos v3.
Confirma los cambios en main. Tu integración existente de Cloudflare Pages publicará esa versión.

**No borres los otros archivos de web.** Este paquete no contiene styles.css, data.js, v2-data.js, v2.css, cloud.css ni otras dependencias que ya tienes.

**config.js no está incluido a propósito.** Conserva exactamente el que ya te funciona, con tu URL y tu clave publicable. Tampoco se sustituye cloud.js ni se modifican las políticas de seguridad.

## Supabase

No necesitas ejecutar nuevos SQL ni crear otro proyecto. Se mantiene el formato de estado version: 1 y la misma tabla JSON. Se añade un objeto opcional nutrition y se reconocen los nuevos identificadores de ejercicios.

La copia antigua se migra al leerla: no se sustituyen tus objetivos, perfil, menús o sesiones por los datos de demostración de las capturas. No reimportes un JSON antiguo salvo que realmente quieras recuperar esa versión.

## Después del despliegue

1. Comprueba el despliegue correcto en Cloudflare.
2. Abre tu dirección habitual y recarga. En Windows puedes usar Ctrl+F5.
3. Debe aparecer **Calorías y macros** en el menú y **Nube personal 1.1** en el lateral.
4. Recarga también la web del móvil ANTES de editar datos. Una pestaña antigua no reconoce los nuevos campos ni ejercicios y podría eliminarlos al volver a guardar.
5. Comprueba que aparecen tus registros. Guarda los datos de la calculadora sin aplicar sus objetivos, espera a Sincronizado y comprueba que se ven en el otro dispositivo.

Si necesitas volver al código anterior, exporta antes una copia de los datos nuevos. La sincronización no es un historial de copias recuperables y la versión anterior no conoce los nuevos ejercicios.

## Cómo usar las novedades

### Calorías y macros

Revisa peso, altura, edad, coeficiente de sexo, trabajo, pasos y gimnasio. Puedes cargar la media de pesos de 7 días, la actividad registrada y los días previstos. La propuesta se actualiza al editar.

- **Guardar datos sin cambiar objetivos** solo conserva las entradas.
- **Aplicar estos objetivos** pide confirmación y cambia las referencias de kcal y proteína del menú.
- **Objetivos manuales** permite seguir con 2.600 / 2.400 kcal o con tu propia pauta.
- Los objetivos no cambian solos al pesarte ni por hacer más pasos un día.
- La revisión usa 3 bloques de 7 días, con 3 pesos como mínimo en cada uno, y pregunta por regularidad y cambios recientes. Una propuesta no se aplica sin confirmación.

Mifflin-St Jeor estima el gasto en reposo; el factor de actividad es una heurística propia y aproximada que se explica en la web. No es una medición ni una recomendación clínica. El trabajo y los pasos no se suman por duplicado. El gasto del gimnasio ya se integra en el factor semanal, no se vuelve a sumar al final.

### Menú mensual

**Proponer raciones para mis kcal** muestra cambios de gramos antes de aceptarlos. El ajuste conserva alimentos y limita aproximadamente al 30 % las variaciones en fuentes de hidratos/proteína. No fuerza alcanzar un total exacto, no inventa comida fuera y no cambia fruta, verdura, aceite o suplementos. Al aceptar se recalcula la compra.

Hay 12 fotos generadas utilizadas como ilustración en las 17 recetas. Algunos platos comparten foto: guarnición, cantidades e ingredientes concretos pueden variar. El listado de la receta es la referencia, no la imagen.

### Entrenamiento

- 40 ejercicios en total, 9 de espalda, todos con guía y esquema animado propio.
- Accesos para pecho/hombro/tríceps, espalda/bíceps, pierna/abdomen y brazos.
- Versiones exprés para días de poco tiempo.
- Repartos por grupos de 3, 4 y 5 días, además de cuerpo completo y torso/pierna.
- Botones para cambiar un ejercicio por otro del grupo y subirlo o bajarlo de orden.
- Los cambios se guardan para la fecha seleccionada. Elegir una nueva sesión sustituye esa sesión con confirmación; no añade volumen sin avisar.
- En dominadas asistidas se anotan kg de asistencia, no carga levantada.
- Las animaciones son esquemas didácticos, no una evaluación de tu ejecución. No debes hacer los 40 ejercicios en una semana.

## Comprobaciones realizadas

Se han comprobado la fórmula, validación de entradas, macros, confirmaciones, compra, importación de estado anterior y persistencia de campos nuevos. También se han ejecutado pruebas de acceso, permisos del usuario simulado, cambios sin conexión, conflictos y sincronización entre dos sesiones de navegador.

El navegador de pruebas bloquea la navegación a servidores locales: se ha renderizado el HTML/JS con almacenamiento y servicios Supabase simulados, e imágenes embebidas solo en el armazón de pruebas. Las imágenes del paquete son archivos locales normales. **No se ha probado contra tu Supabase real ni desplegado en tus cuentas.** Es necesario comprobar acceso y sincronización después de tu subida.

## Referencias

- Mifflin et al.: https://pubmed.ncbi.nlm.nih.gov/2305711/
- NIDDK: https://www.niddk.nih.gov/health-information/weight-management/body-weight-planner
- ISSN: https://link.springer.com/article/10.1186/s12970-017-0177-8
- ACSM: https://acsm.org/resistance-training-guidelines-update-2026/
- ACE: https://www.acefitness.org/resources/everyone/exercise-library/
- Publicación Git: https://developers.cloudflare.com/pages/configuration/git-integration/
- Subir archivos: https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository
