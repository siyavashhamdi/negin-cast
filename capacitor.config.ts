import type { CapacitorConfig } from '@capacitor/cli'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

function loadServerUrlFromEnvFile(): string | undefined {
  try {
    const envPath = resolve(__dirname, '.env')
    const line = readFileSync(envPath, 'utf8')
      .split('\n')
      .find((entry) => entry.trim().startsWith('CAPACITOR_SERVER_URL='))

    if (!line) {
      return undefined
    }

    return line.substring(line.indexOf('=') + 1).trim()
  } catch {
    return undefined
  }
}

const serverUrl = process.env.CAPACITOR_SERVER_URL ?? loadServerUrlFromEnvFile()

const config: CapacitorConfig = {
  appId: 'com.glowplay.app',
  appName: 'NeginCast',
  webDir: 'web/app/dist',
  server: serverUrl
    ? {
        url: serverUrl,
        cleartext: serverUrl.startsWith('http://'),
      }
    : undefined,
}

export default config
