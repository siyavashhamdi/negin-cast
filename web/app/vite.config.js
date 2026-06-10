import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

function parseAllowedHosts(value) {
  const trimmed = value?.trim()

  if (!trimmed || trimmed === '*') {
    return true
  }

  return trimmed
    .split(',')
    .map((host) => host.trim())
    .filter(Boolean)
}

function apkDownloadHeaders() {
  return {
    name: 'apk-download-headers',
    configureServer(server) {
      server.middlewares.use('/app-debug.apk', (req, res, next) => {
        res.setHeader('Content-Type', 'application/vnd.android.package-archive')
        res.setHeader('Content-Disposition', 'attachment; filename="NeginCast.apk"')
        next()
      })
    },
    configurePreviewServer(server) {
      server.middlewares.use('/app-debug.apk', (req, res, next) => {
        res.setHeader('Content-Type', 'application/vnd.android.package-archive')
        res.setHeader('Content-Disposition', 'attachment; filename="NeginCast.apk"')
        next()
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const allowedHosts = parseAllowedHosts(env.ALLOWED_HOSTS)

  return {
    plugins: [
      react(),
      apkDownloadHeaders(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg'],
        manifest: {
          name: 'NeginCast | تماشا و دانلود ویدیو',
          short_name: 'NeginCast',
          description: 'صفحه فرود زیبا و حرفه‌ای برای تماشا و دانلود ویدیو — مخصوص دختران',
          theme_color: '#fdf2f8',
          background_color: '#fffafa',
          display: 'standalone',
          start_url: '/',
          lang: 'fa',
          dir: 'rtl',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,ttf}'],
          globIgnores: ['**/app-debug.apk'],
          navigateFallback: '/index.html',
          clientsClaim: true,
          skipWaiting: true,
          cleanupOutdatedCaches: true,
          runtimeCaching: [
            {
              urlPattern: ({ request }) => request.mode === 'navigate',
              handler: 'NetworkFirst',
              options: {
                cacheName: 'pages-cache',
                networkTimeoutSeconds: 3,
                expiration: {
                  maxEntries: 10,
                },
              },
            },
            {
              urlPattern: ({ request }) =>
                ['script', 'style', 'image', 'font'].includes(request.destination),
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'assets-cache',
                expiration: {
                  maxEntries: 80,
                  maxAgeSeconds: 60 * 60 * 24 * 30,
                },
              },
            },
          ],
        },
      }),
    ],
    server: {
      allowedHosts,
      host: '0.0.0.0',
      port: 6000,
    },
    preview: {
      allowedHosts,
      host: '0.0.0.0',
      port: 6000,
    },
  }
})
