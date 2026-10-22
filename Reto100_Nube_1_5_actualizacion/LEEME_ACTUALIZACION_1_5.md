# Reto 100 Nube 1.5 — peso, kcal y raciones del mes

Actualización **incremental sobre Reto 100 Nube 1.4**. Conserva Supabase, el acceso privado, las recetas, el registro de series, los entrenamientos flexibles y las fotos del proyecto publicado.

## Novedades

1. **Revisión tras registrar el peso:** si existen al menos **3 pesajes de días diferentes en los últimos 7 días** y la media difiere **0,5 kg o más** del peso usado en la última calculadora aceptada, aparecen avisos en Inicio y Progreso. No se modifica nada sin permiso. Las variaciones por líquidos o creatina pueden alterar esa media.
2. **Recalcular objetivos:** en Calorías y macros, introduce manualmente tus datos o usa la media reciente. La estimación parte de la misma fórmula Mifflin-St Jeor y del nivel de actividad previamente elegido. No se añaden pasos dos veces.
3. **Vista previa para el menú pendiente:** en `Menú mensual`, el botón `Previsualizar actualización mensual` compara las kcal actuales y propuestas, las raciones que cambiarían y el efecto agregado en la compra.
4. **Protección por defecto:** no se modifican las cantidades editadas manualmente ni las recetas personales. Puedes incluirlas expresamente en la vista previa marcando sus casillas. Nunca se cambia la receta original: los nuevos gramos solo se guardan como raciones de **esas fechas del menú**.
5. **No reescribe fechas anteriores:** las raciones se ajustan desde la fecha actual hasta el último día del plan activo. Los días con comidas fuera se omiten porque falta información nutricional. Si el mes ya terminó, debes revisar las fechas en Ajustes antes de usarlo.
6. **Lista de la compra:** al aceptar, la lista recalcula los gramos totales y envases de los días que correspondan. Los números que habías marcado como comprados no se inventan ni se borran.
7. **Confirmación y sincronización:** primero se ve una vista previa, luego se confirma expresamente. Una sola operación guarda objetivos y raciones en la estructura JSON sincronizada que ya utiliza Supabase. No hay nuevos SQL ni cambios en la base de datos.

## Instalación en GitHub + Cloudflare

1. En la web actual, espera a **Sincronizado**, entra en Ajustes y **exporta un JSON**. Guarda una copia privada y cierra otras pestañas de Reto 100 mientras haces la actualización.
2. Descomprime el ZIP. En tu repositorio `reto100`, desde la **raíz** donde ya existe `web`, elige `Add file > Upload files` y arrastra la carpeta `web` de este paquete. **Sustituye los archivos coincidentes**, manteniendo todos los demás.
3. Las rutas deben quedar:

   ```
   web/index.html       (actualizar)
   web/app.js           (actualizar)
   web/v7-plan.js       (nuevo)
   web/v7.css           (nuevo)
   ```

4. **Nunca renombres ni sobreescribas `web/config.js`.** No se incluye en el ZIP. Conserva `cloud.js`, las imágenes y los demás archivos de v1.4. No debe aparecer la carpeta `web/web/`.
5. Confirma los cambios juntos en `main` y espera a que Cloudflare publique la nueva versión. Actualiza el navegador con **Ctrl+F5**. En el lateral debe aparecer `Nube personal 1.5`.
6. Comprueba desde un dispositivo que la nueva opción aparece en Calorías y macros / Menú mensual; realiza un cambio de prueba y espera a **Sincronizado**. Comprueba desde otro dispositivo que coincidan objetivos y cantidades. **No importes una copia vieja encima de registros nuevos.**

## Ejemplo de uso

- Registra el peso en **Progreso** al menos tres mañanas dentro de los últimos 7 días.
- Aparecerá un aviso si hay una diferencia de 0,5 kg o más respecto a tu peso de referencia guardado en la calculadora.
- Pulsa **Revisar mi plan** para ver una propuesta basada en tu nuevo peso medio y en la actividad registrada en la calculadora.
- Revisa el objetivo de kcal y gramos por alimento, los días omitidos y tus comidas protegidas. Si tienes pocos pesajes, usa en su lugar el formulario de **Calorías y macros**.
- Solo al pulsar **Aceptar kcal y raciones propuestas** y confirmar, se cambian los datos. Se actualiza el menú planificado y, por consecuencia, su lista de la compra.

## Límites importantes

- El cálculo de kcal **sigue siendo orientativo**: tus necesidades reales no se conocen a partir del peso y altura solamente. Variaciones de peso pueden ser agua, glucógeno u otros cambios, no exclusivamente grasa. No es necesario recortar la energía cada vez que bajas de peso.
- El ajuste por ingrediente es moderado y **no garantiza clavar las kcal ni la proteína**. Si un menú se queda muy corto o muy largo, se indica en la vista previa en lugar de forzar cantidades desproporcionadas.
- Los platos y macros son **planificados**, no cantidades realmente ingeridas. Revisa las etiquetas de los alimentos y tu evolución de 2–3 semanas.
- No se ejecutó la sincronización contra tu **Supabase real**. Se comprobó la serialización y la conservación de la estructura utilizada por el cliente. Valida la sincronización entre ordenador y móvil después del despliegue.
- El navegador de pruebas del entorno ha bloqueado la navegación por políticas administrativas; las comprobaciones cubren sintaxis, cálculos puros y simulación de guardado/renders y estado, no una prueba visual real del despliegue.

## Archivos de este parche

- `web/app.js`: avisos, vistas previas, recálculo del mes, protecciones, aceptación y persistencia.
- `web/v7-plan.js`: funciones puras para medias semanales y ajustes de raciones.
- `web/v7.css`: estilos adaptables para las tarjetas y las vistas previas.
- `web/index.html`: carga del nuevo CSS/JS y actualización de la versión.

Si detectas algún problema tras actualizar, vuelve al último commit estable de GitHub y conserva siempre tu copia de datos JSON.
