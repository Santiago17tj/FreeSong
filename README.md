# FreeSong

Reproductor de música para uso personal. Funciona como app web en iPhone (PWA) y como app Android (APK con Capacitor).

## Qué tiene

- **Canciones completas de YouTube** (casi todo el catálogo comercial) con el reproductor oficial de YouTube. Reglas de YouTube: el video se ve en un recuadro (mínimo 200×200 px; en el celular se puede arrastrar), puede haber anuncios salvo con YouTube Premium, y se pausa con la pantalla bloqueada. Hay crossfade entre canciones de YouTube; el ecualizador no aplica.
- **Canciones completas** de Audius (artistas independientes que suben su música ahí).
- **Vistas previas de 30 s** de artistas comerciales (Apple), con enlace para escucharlas completas en Apple Music.
- **Radio en directo** de Radio Browser: emisoras de tu país y por género (reggaetón, salsa, vallenato, electrónica…).
- **Tus propios archivos** (MP3, M4A, FLAC, WAV): se guardan en el dispositivo y suenan sin internet.
- **Descargas** de canciones de Audius para escuchar sin internet.
- **Estudio**: música generada en el dispositivo con un sintetizador (no necesita internet).
- Funciones de reproductor: cola editable (reproducir a continuación, añadir, reordenar), aleatorio, repetir (todo / una), crossfade de 0 a 12 s, letras sincronizadas (LRCLIB), ecualizador de 3 bandas con preajustes, nivelador de volumen, velocidad (Slowed / Nightcore), temporizador de apagado, locutor por voz, me gusta, playlists, historial, páginas de artista y género, mix por género.
- Controles en la pantalla bloqueada, la notificación y los audífonos Bluetooth.
- Sin anuncios y sin límite de saltos.

> FreeSong no extrae el audio de YouTube ni bloquea sus anuncios (eso va contra las condiciones de YouTube): usa siempre su reproductor oficial.

### Llave de YouTube (opcional, recomendada)

Sin llave, la búsqueda de YouTube usa una instancia pública de Piped que a veces se cae. Con tu propia llave gratuita la búsqueda es oficial y estable (unas 100 búsquedas al día):

1. Entra a [Google Cloud Console](https://console.cloud.google.com/), crea un proyecto.
2. En **APIs y servicios → Biblioteca**, activa **YouTube Data API v3**.
3. En **Credenciales → Crear credenciales → Clave de API**, copia la llave.
4. En FreeSong: **Sonido → YouTube**, pégala y toca **Guardar**. Se guarda solo en tu dispositivo.

## Estructura

```
www/                  La app (esto es lo que se publica)
  index.html          Estructura de la interfaz
  app.js              Toda la lógica: audio, cola, fuentes, vistas
  app.css             Estilos generados (no editar: sale de src/input.css)
  sw.js               Service worker: la app abre sin internet
  manifest.webmanifest
  icons/, fonts/
src/input.css         Estilos fuente (Tailwind)
assets/icon.svg       Ícono original de la app
scripts/              Utilidades: íconos, servidor local, assets de Android
android/              Proyecto Android generado por Capacitor
original/             El HTML de la versión anterior (respaldo)
```

## Comandos

Instala las dependencias una sola vez:

```bash
npm install
```

Genera íconos y estilos:

```bash
npm run build
```

Prueba la app en el navegador en http://localhost:5173:

```bash
npm run serve
```

## Publicarla para iPhone

1. Ejecuta `npm run build`.
2. Sube **la carpeta `www/`** a un hosting con HTTPS: Vercel, Netlify o GitHub Pages (todos gratis).
3. En el iPhone abre la dirección en **Safari** → **Compartir** → **Agregar a pantalla de inicio**.

En iPhone el "Modo compatible" viene activado para que la música siga con la pantalla bloqueada. Si lo apagas (en Sonido) tendrás ecualizador y crossfade, pero iOS puede pausar la música al bloquear.

## Compilar la APK de Android

Requisitos: Android Studio instalado (trae el JDK 21 y el SDK).

```bash
npm run sync
```

Luego compila con el JDK de Android Studio (en PowerShell):

```powershell
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"; cd android; .\gradlew.bat assembleDebug
```

La APK queda en `android/app/build/outputs/apk/debug/app-debug.apk`. Cópiala al celular, ábrela y permite "instalar apps desconocidas".

También puedes abrir el proyecto en Android Studio con `npm run open:android` y usar **Build → Build APK(s)**.

Si borras la carpeta `android/` y la vuelves a crear con `npx cap add android`, ejecuta después `npm run android-assets` (íconos) y vuelve a añadir los permisos de `FOREGROUND_SERVICE_MEDIA_PLAYBACK` y `WAKE_LOCK` en `android/app/src/main/AndroidManifest.xml`.

## Fuentes y créditos

- YouTube: [IFrame Player API](https://developers.google.com/youtube/iframe_api_reference) oficial; búsqueda con YouTube Data API v3 o [Piped](https://github.com/TeamPiped/Piped)
- Música completa: [Audius API](https://docs.audius.org/)
- Vistas previas: iTunes Search API de Apple
- Radio: [Radio Browser](https://www.radio-browser.info/)
- Letras: [LRCLIB](https://lrclib.net/)
