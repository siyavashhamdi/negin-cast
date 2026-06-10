# Android App (Capacitor + PWA)

This repo wraps the web app in [`app/`](app/) as a native Android app using **Capacitor**. The Android shell loads your **hosted HTTPS URL**, and the web app's **PWA service worker** caches assets after the first successful load so the app can work offline on later launches.

## Architecture

```
app/ (React + Vite + PWA)
  → deploy to HTTPS hosting
  → Capacitor android/ shell loads that URL
  → service worker caches JS/CSS/HTML on first visit
  → offline relaunch serves cached shell
```

## Prerequisites

- Node.js 18+
- [Android Studio](https://developer.android.com/studio) with Android SDK
- A deployed HTTPS URL for the web app (required for remote mode)
- USB debugging enabled on your Android phone (for direct install)

## 1. Deploy the web app

Build and deploy the PWA-enabled web app:

```bash
npm run build:web
```

Upload the contents of `app/dist/` to your HTTPS host (Vercel, Netlify, Cloudflare Pages, etc.).

The deployed site must serve:

- `index.html`
- `sw.js` (service worker)
- `manifest.webmanifest`

Verify PWA registration by opening your site in Chrome DevTools → Application → Service Workers.

## 2. Configure the Capacitor server URL

Copy the example env file and set your hosted URL:

```bash
cp .env.example .env
```

Edit `.env`:

```env
CAPACITOR_SERVER_URL=https://your-actual-domain.com
```

Then sync the config into the Android project:

```bash
export $(grep -v '^#' .env | xargs) && npx cap sync android
```

When `CAPACITOR_SERVER_URL` is set, Capacitor loads the remote URL instead of bundled local files. This keeps the APK small and lets you push web updates without rebuilding the Android app.

## 3. Prepare the Android project

From the repo root:

```bash
npm install
npm install --prefix app
npm run android:prepare
```

Or step by step:

```bash
npm run build:web
npx cap sync android
```

## 4. Build and install on your phone

Open the native project in Android Studio:

```bash
npm run cap:open:android
```

Then either:

- **Run on device**: connect your phone via USB, enable USB debugging, click Run in Android Studio
- **Build APK**: Build → Build Bundle(s) / APK(s) → Build APK(s), then transfer the APK to your phone

## Offline behavior

| Launch | Internet required? | What happens |
|--------|-------------------|--------------|
| First open | Yes | WebView loads hosted URL; service worker caches app shell |
| Later opens (offline) | No | Cached PWA shell is served from service worker |
| Later opens (online) | No (but recommended) | App checks for updates; `autoUpdate` refreshes cache on restart |

**Note:** PWA caching covers the app UI (HTML, JS, CSS). Actual video file downloads to device storage would require native Capacitor plugins and are not covered by the service worker cache.

## Useful commands

| Command | Description |
|---------|-------------|
| `npm run build:web` | Build the React/Vite app with PWA |
| `npm run android:prepare` | Build web + sync Android project |
| `npm run cap:sync:android` | Sync web assets and config to Android |
| `npm run cap:open:android` | Open `android/` in Android Studio |

## Project layout

```
negin-sample-app/
├── app/                  # React + Vite web app (with PWA)
├── android/              # Capacitor native Android project
├── capacitor.config.ts   # Capacitor config (reads CAPACITOR_SERVER_URL)
├── .env.example          # Example env for hosted URL
└── package.json          # Root scripts + Capacitor deps
```

## Troubleshooting

**App shows blank screen**

- Confirm `CAPACITOR_SERVER_URL` in `.env` is correct and uses HTTPS
- Re-run `export $(grep -v '^#' .env | xargs) && npx cap sync android`
- Check the URL loads in a mobile browser

**Gradle sync failed in Android Studio**

- Open `android/` in Android Studio and let it download Gradle/SDK dependencies
- Ensure Android SDK is installed via SDK Manager

**Offline mode not working**

- Open the app online at least once so the service worker can install
- Verify `sw.js` is served from your deployed site
- Check Chrome DevTools on the hosted site for service worker errors
