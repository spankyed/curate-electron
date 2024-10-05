import { ipcMain } from 'electron'
import controllers from '../services/src'

export function handleServices(): void {

  for (const [key, controller] of Object.entries(controllers)) {
    console.log('key: ', key);
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    ipcMain.handle(key, controller as any)
  }
}
