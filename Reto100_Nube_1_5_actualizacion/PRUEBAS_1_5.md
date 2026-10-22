# Pruebas de Reto 100 Nube 1.5

Se ha comprobado la lógica de cálculo, integración con el estado existente, recuperación de datos y planificación. **No son pruebas conectadas con el Supabase real del usuario**.

## Resultado automatizado

- 11 aserciones sobre el módulo de medias y ajuste de raciones.
- 41 aserciones de integración con `app.js` ejecutadas en un entorno DOM simulado.
- `node --check` de los archivos JavaScript modificados.

## Casos incluidos

- Media ponderada correctamente por **3 días distintos**, sin usar medidas antiguas.
- Propuesta no modifica estado mientras el usuario la examina.
- Reparto de kcal cambia con un peso medio nuevo y datos antropométricos/actividad guardados.
- Protección por defecto de ingredientes editados a mano y recetas creadas por el usuario.
- Casillas opcionales permiten revisar la inclusión de esos ingredientes.
- Los aceites y otros alimentos que no pertenecen a los grupos ajustables no se modifican.
- Límites moderados en el ajuste por ingredientes.
- Revisión de solo los días pendientes del mes, sin modificar recetas originales ni fechas pasadas.
- Guardado atómico en el estado cliente de kcal, objetivos de proteína, raciones y referencia mensual.
- La compra se recalcula a partir de las raciones aceptadas.
- Los campos nuevos se conservan tras la sanitización del estado entre dispositivos.
- Si los registros de peso no son suficientes, el modo automático se rechaza y permanece disponible la calculadora manual.
- La vista previa obsoleta queda rechazada si otro dispositivo cambia los datos entretanto.
- Si el período del plan ha terminado, la vista previa no modifica el calendario anterior.

## Limitación

El Chromium de este entorno devolvió `ERR_BLOCKED_BY_ADMINISTRATOR` para la navegación de prueba (incluso `data:`). No se ha fingido una validación visual en un navegador real. Conviene probar en la web publicada el modal y la vista móvil antes de importar grandes volúmenes de datos.
