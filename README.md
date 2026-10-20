# Reto 100 Nube personal

Adaptación de la versión B. Preparada el 20 de octubre de 2026.
**Todavía no está publicada ni conectada a un proyecto real.**

## Qué hace

Conserva los menús, recetas, compra, ejercicios, pasos y seguimiento de la versión B.
Añade acceso con correo y contraseña, una lista de usuarios autorizados en la base de datos,
sincronización con Supabase y detección de versiones incompatibles entre dispositivos.
No es una aplicación multiusuario abierta: no hay botón de registro público.

Se comprueban los cambios al guardar, al recuperar la conexión, al volver a la pestaña
y aproximadamente cada 30 segundos mientras está visible. No es sincronización instantánea
ni colaboración en tiempo real. Espera a ver **Sincronizado** antes de cambiar de dispositivo.
Los filtros, fechas seleccionadas y navegación permanecen locales.

## 0. Antes de empezar: tu copia privada

Abre Reto100_B.html, entra en Ajustes y ayuda y pulsa Exportar copia.
Guarda el JSON fuera de este proyecto, por ejemplo en una carpeta privada de tu ordenador.
**Nunca subas ese JSON a GitHub ni a Cloudflare.**

Los valores iniciales del perfil de esta versión son ejemplos neutros, no tus medidas.
Al importar tu copia se recuperarán los datos del plan anterior.
No cargues tus registros personales editando data.js o app.js.

## 1. Crea el proyecto de Supabase

Abre https://supabase.com/dashboard y crea una cuenta de administración.
Crea una organización gratuita si se solicita y pulsa New project.
Nombre: reto100. Elige una región europea disponible.
Genera una contraseña fuerte para la base de datos y guárdala en tu gestor.
Esa contraseña NO va en config.js y NO será tu contraseña de acceso a Reto 100.
Espera a que el proyecto esté listo. No hace falta contratar un dominio.

## 2. Crea tu usuario de Reto 100 y cierra los registros

En Supabase, Authentication > Users > Add user > Create new user.
Introduce tu propio correo y una contraseña nueva y fuerte para Reto 100.
Mantén Auto Confirm User activado para este usuario creado por ti.
No uses Send invitation: esta versión usa acceso directo con correo y contraseña.

En Authentication > Sign In / Providers (o General configuration):
- desactiva Allow new users to sign up;
- desactiva Allow anonymous sign-ins;
- mantén Email habilitado.

No desactives las políticas RLS para conseguir que una prueba funcione.
No necesitas configurar envío de correos para este usuario creado manualmente.
Esta versión no incluye recuperación de contraseña por correo: conserva la contraseña
en tu gestor; la administración del usuario se hace desde Supabase.

## 3. Crea la base privada

En Supabase abre SQL Editor > New query.
Abre supabase/01_crear_base.sql con un editor de texto, copia TODO su contenido y pulsa Run.
El archivo crea dos tablas, activa RLS, limita privilegios y añade el guardado con revisiones.
No contiene ninguna contraseña ni necesita una clave secreta.

En otra consulta pega supabase/02_autorizar_usuario.sql.
Sustituye TU_CORREO_AQUI, SOLO en el SQL Editor, por el correo que has creado en el paso 2.
Ejecuta la consulta. El resultado debe mostrar exactamente una fila con tu correo y su ID.
Si no aparece ninguna fila, revisa el correo y que hayas creado el usuario.
No subas a GitHub una versión de ese SQL con tu correo real.

Comprueba en Table Editor que reto100_allowed_users y reto100_state tienen RLS habilitado.
La primera tabla tiene un usuario autorizado; la segunda estará vacía al principio.
Data API debe estar habilitada y el esquema public disponible para la API.
Los permisos del archivo SQL son necesarios incluso aunque Data API esté habilitada.

Incluimos supabase/03_comprobar_seguridad.sql como comprobación adicional:
ejecútala ENTERA después de los dos archivos anteriores. Prueba propietario, visitante,
usuario no autorizado y control de revisiones, y termina con ROLLBACK para no conservar
los cambios de prueba. No se ha ejecutado sobre tu proyecto: no existe todavía en este entorno.
Un error requiere revisión; no cambies RLS por políticas públicas para evitarlo.

## 4. Conecta la web a tu proyecto

En Supabase abre Connect y copia Project URL y Publishable key.
También puedes consultar Settings > API Keys. La clave debe empezar por sb_publishable_.
Abre web/config.js y sustituye solo los dos textos de ejemplo, conservando comillas y comas.

```js
window.RETO100_CLOUD_CONFIG = Object.freeze({
  supabaseUrl: 'https://TU_PROYECTO.supabase.co',
  publishableKey: 'sb_publishable_TU_CLAVE_PUBLICA'
});
```

La Project URL y la publishable key pueden aparecer en el navegador: no son secretos.
La protección de los datos la realizan Auth, la lista de usuarios autorizados y RLS.
NUNCA pegues sb_secret_, service_role, la contraseña de Supabase, la de Reto 100
ni la de la base de datos en archivos de la web. No compartas esas credenciales por chat.
Guarda config.js sin cambiar la extensión a .txt.

## 5. Sube el proyecto a un repositorio privado de GitHub

En https://github.com crea una cuenta si aún no tienes.
New repository > nombre reto100 > Private > Create repository.
Entra en Add file > Upload files, o uploading an existing file en un repositorio vacío.
Sube EL CONTENIDO de la carpeta Reto100_Nube, no el ZIP y no la carpeta contenedora.
La raíz debe mostrar web, supabase y README.md. index.html debe quedar en web/index.html.
Guarda con Commit changes en la rama main.
No subas copias JSON personales, capturas de medidas, claves secretas ni archivos .env.
Un repositorio privado no convierte por sí solo el sitio desplegado en privado.

## 6. Publica con Cloudflare Pages

Abre https://dash.cloudflare.com y crea tu cuenta si hace falta.
Workers & Pages > Create application > Pages > Import an existing Git repository.
Autoriza la integración de GitHub SOLO para el repositorio reto100, no para todos tus proyectos.
Selecciona el repositorio y Begin setup.

| Campo | Valor |
|---|---|
| Project name | Un nombre disponible, por ejemplo reto100-personal |
| Production branch | main |
| Framework preset | None |
| Build command | exit 0 |
| Build output directory | web |
| Root directory | Sin cambiar; raíz del repositorio |

La carpeta de salida es web, NO un punto y NO Reto100_B.html, porque este paquete
separa el sitio de los archivos SQL y de las instrucciones.
Pulsa Save and Deploy. Copia la dirección real que te asigne, terminada en .pages.dev.
No presupongas que reto100.pages.dev está disponible.
En Supabase > Authentication > URL Configuration, guarda esa dirección como Site URL.
El acceso actual por contraseña no utiliza redirecciones de correo, pero deja ese valor correcto.
No uses Direct Upload si quieres mantener la integración de Git desde el principio.

## 7. Entra e importa tu plan UNA vez

Abre la URL publicada e inicia sesión con la cuenta Reto 100 del paso 2.
En Ajustes y ayuda > Importar copia, elige el JSON privado del paso 0.
La importación sustituye los datos actuales y ese cambio se sincroniza también a la nube.
Espera a Sincronizado. Comprueba perfil, menús, pesos, pasos y sesiones.
Abre la misma URL en el móvil y entra con el MISMO correo y contraseña.
No vuelvas a importar una copia antigua en el segundo dispositivo: puede sustituir la nube.
Si no tenías registros, completa Ajustes y tus cargas antes de usar la plantilla como plan real.

## 8. Prueba antes de depender del sistema

Registra en el ordenador un valor real que puedas comprobar, por ejemplo los pasos de hoy.
Espera a Sincronizado. Abre el móvil y pulsa Nube > Sincronizar ahora o vuelve a la pestaña.
Comprueba el dato y repite un cambio pequeño en sentido inverso.
En una ventana privada SIN iniciar sesión solo debe verse la pantalla de acceso.
Ejecuta la comprobación SQL del paso 3: ocultar la interfaz no prueba por sí mismo la seguridad.
Si necesitas comprobar también un segundo usuario, créalo solo en Authentication,
NO lo autorices en reto100_allowed_users y verifica que la app rechaza su entrada.
No es obligatorio crear ese segundo usuario para utilizar la web.

## Uso habitual y mantenimiento

Los cambios del plan y del historial se guardan al guardar cada formulario o cambiar el
control correspondiente, y se envían automáticamente cuando hay conexión.
No cierres antes de ver Sincronizado si necesitas acceder a esos datos desde otro dispositivo.

Si se corta Internet con la página abierta, los cambios quedan en la copia local pendiente.
Para cargar de nuevo la web e iniciar sesión necesitas Internet. No se incluye PWA ni
un modo sin conexión que pueda arrancar de cero. No borres los datos del navegador con
cambios pendientes. La app avisa si no se puede persistir esa copia local.

Dos dispositivos editando versiones diferentes producen un aviso de conflicto.
Desde Nube puedes exportar ambas copias y elegir cuál conservar. NO se combinan solas.
En navegadores compatibles se permite una pestaña editora a la vez para la misma cuenta.
Los dispositivos distintos sí pueden estar conectados simultáneamente.

Cerrar sesión limpia las copias locales de esta instalación en ese navegador; no borra la nube.
Restablecer cuenta y nube SÍ sustituye el estado compartido. Importar una copia también.
La copia local, la sesión persistida y los JSON requieren proteger el acceso a tu dispositivo.
El almacenamiento cloud no está cifrado de extremo a extremo por esta app.
No hay analítica ni publicidad, pero hay conexiones a Supabase y a jsDelivr para el SDK.
La pantalla de acceso, los archivos de la web y la plantilla están publicados; tus registros
se protegen mediante autenticación y permisos de la base. robots/noindex NO son seguridad.

Para actualizar la web, sube al mismo repositorio los archivos modificados y confirma
el commit en main. Cloudflare despliega la nueva versión. Después recarga en cada dispositivo.
No reemplaces config.js por el de ejemplo al subir otra versión.
No vuelvas a ejecutar migraciones SQL nuevas sin revisar lo que hacen.
Tus registros no están en GitHub: están en Supabase y en la copia local.
Los cambios importantes de formato de datos requieren migración; no basta con cambiar el diseño.
Las etiquetas nutricionales, las recetas, el catálogo Mercadona y las rutinas NO se actualizan
solos desde fuentes externas. GitHub despliega código nuevo, no lo escribe por ti.

## Coste y copias de seguridad

Los planes gratuitos pueden servir para este uso personal dentro de sus límites.
Consulta condiciones actuales: no es una promesa de gratuidad perpetua ni de disponibilidad 24/7.
Supabase indica pausa de proyectos Free tras una semana de inactividad; se reanudan
desde el panel. Free no incluye copias automáticas de base de datos según su tabla de precios.
Exporta tu JSON privado semanalmente y antes de importar, restablecer o actualizar.
La sincronización replica cambios y borrados: NO es una copia histórica de seguridad.
Activa doble factor en las cuentas que administran GitHub, Cloudflare y Supabase.
No compres dominio ni planes de pago para empezar salvo que decidas que los necesitas.

## Problemas frecuentes

- 404 al entrar: comprueba que exista web/index.html y que la salida en Pages sea web.
- Solo veo 'falta configurar': revisa web/config.js y que no haya extensión .js.txt.
- Biblioteca de acceso no cargada: verifica acceso a cdn.jsdelivr.net y al SDK referenciado
  en index.html. Se usa Supabase JS 2.111.0, con versión fijada; no se descarga durante build.
- Cuenta no autorizada: revisa SQL 01 y 02, correo exacto y fila autorizada. No abras RLS.
- Datos que no llegan al móvil: misma URL, mismo usuario, estado Sincronizado en origen,
  Supabase activo, y Nube > Sincronizar ahora en destino.
- Cuenta bloqueada en otra pestaña: cierra la pestaña anterior y vuelve a entrar.
- Un valor inicial no es el tuyo: importa tu copia o corrige Ajustes; los valores son plantilla.
- Cambios no guardados: pulsa Guardar en el formulario, comprueba conexión y exporta el JSON.

## Estructura

web/                    Sitio que se publica; no contiene registros ni claves secretas.
web/config.js           Dos valores públicos de tu proyecto.
web/cloud.js            Autenticación y sincronización del estado completo.
web/_headers            Cabeceras para Pages: CSP, noindex, revalidación de caché.
supabase/01_crear_base.sql            Tablas, políticas y guardado con revisiones.
supabase/02_autorizar_usuario.sql    Autorizar tu cuenta, sin correo real en el archivo.
supabase/03_comprobar_seguridad.sql  Pruebas con ROLLBACK; ejecutar en tu proyecto.

## Validación realizada y pendiente

Se ha revisado sintaxis JavaScript y probado en Chromium el acceso, guardado, dos dispositivos,
importación, exportación, cambios pendientes sin red, conflictos, cierre de sesión y pantalla móvil.
El navegador del entorno bloquea navegaciones de red: estas pruebas usaron HTML insertado,
almacenamiento simulado y un SDK/backend simulado. NO prueban conectividad real del CDN,
Supabase, RLS en PostgreSQL, persistencia de un origen HTTPS real ni Cloudflare Pages.
No se ha desplegado en tus cuentas ni se ha realizado una auditoría de seguridad externa.
La prueba real de los pasos 3 y 8 sigue siendo imprescindible antes de usarlo como única copia.
El límite de cada snapshot es de unos 2 MB; no se suben imágenes ni archivos personales.

## Documentación oficial consultada

- Supabase Auth: https://supabase.com/docs/guides/auth/general-configuration
- Contraseñas: https://supabase.com/docs/guides/auth/passwords
- Claves públicas/secretas: https://supabase.com/docs/guides/getting-started/api-keys
- Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security
- Instalación del SDK: https://supabase.com/docs/reference/javascript/installing
- Versión fijada: https://github.com/supabase/supabase-js/releases/tag/v2.111.0
- Planes: https://supabase.com/pricing
- Pausas: https://supabase.com/docs/guides/platform/free-project-pausing
- GitHub, crear repositorio: https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository
- GitHub, subir archivos: https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository
- Pages HTML: https://developers.cloudflare.com/pages/framework-guides/deploy-anything/
- Pages Git: https://developers.cloudflare.com/pages/configuration/git-integration/
