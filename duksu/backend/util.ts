import dns from 'dns';

export function getPlatform() {
  if (/^win/i.test(process.platform)) return 'windows'
  if (/darwin/i.test(process.platform)) return 'macos'
  if (/linux/i.test(process.platform)) return 'linux'
  return null
}

export function checkForUpdates() {
  // if (!this.config.autoUpdate) return false
  // autoUpdater.logger = log
  // autoUpdater.allowPrerelease = this.settings.allowPrerelease || false
  // return autoUpdater.checkForUpdatesAndNotify()
}

export async function checkInternet(): Promise<boolean> {
  return new Promise((resolve) => {
    dns.lookup('google.com', function (err: any) {
      if (err) {
        resolve(false)
      } else {
        resolve(true)
      }
    })
  })
}