# NeginCast

Monorepo for the NeginCast web app (`web/app/`) and Android Capacitor wrapper (`android/`).

Production URL:

- Web app: `http://198.144.180.146:5600/`
- Android remote URL: `http://198.144.180.146:5600/`

## Project layout

```text
negin-sample-app/
├── web/app/          # React + Vite web app
├── android/          # Capacitor Android project
├── scripts/          # Deployment scripts
├── ecosystem.config.cjs
├── .env              # Android remote URL config
└── package.json
```

## Prerequisites

- Node.js 18+
- PM2 for server deployment:

```bash
npm install -g pm2
```

For Android APK builds:

- Android Studio / Android SDK
- JDK

## Configure environment

### Root `.env`

```bash
cp .env.example .env
```

Default value:

```env
CAPACITOR_SERVER_URL=http://198.144.180.146:5600/
```

### Web app `.env`

```bash
cp web/app/.env.example web/app/.env
```

Default value:

```env
ALLOWED_HOSTS=198.144.180.146,localhost
```

## Run on server (PM2)

This project uses the same deployment style as `test_01`: build the web app, then serve it with PM2 on port `5600`.

From the repo root on the server:

```bash
npm run deploy
```

What `npm run deploy` does:

1. Installs dependencies
2. Copies the latest APK into `web/app/public/app-debug.apk` if it exists
3. Builds the web app
4. Starts `negincast-web` with PM2 on `http://0.0.0.0:5600`

Public URL after deploy:

```text
http://198.144.180.146:5600/
```

### Manage server process

```bash
npm run stop
npm run restart
npm run logs
pm2 status
```

### Update after `git pull`

```bash
git pull
npm run deploy
```

## Local development

Run the web app locally on port `5600`:

```bash
npm install
npm install --prefix web/app
npm run dev:web
```

Open:

```text
http://localhost:5600/
```

## Build Android APK

1. Make sure `.env` contains:

```env
CAPACITOR_SERVER_URL=http://198.144.180.146:5600/
```

2. Build APK:

```bash
npm run android:apk
```

3. Install on phone:

```bash
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

APK output:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

The same APK is also copied to:

```text
web/app/public/app-debug.apk
```

So the landing page download button serves `NeginCast.apk`.

## Android behavior

- Online: Android app loads `http://198.144.180.146:5600/`
- Offline: Android app falls back to the bundled web build inside the APK
- Settings button in the Android app lets you change the server URL manually

## Useful commands

| Command | Description |
| --- | --- |
| `npm run dev:web` | Run web app locally on port 5600 |
| `npm run build:web` | Build web app to `web/app/dist` |
| `npm run deploy` | Build and start web app with PM2 |
| `npm run android:apk` | Build Android debug APK |
| `npm run cap:open:android` | Open Android project in Android Studio |

## Firewall note

Make sure port `5600` is open on the server:

```bash
# example
sudo ufw allow 5600/tcp
```
