import { ipcMain } from 'electron'
import controllers from '../../services'

export function handleServices(): void {

  for (const [key, controller] of Object.entries(controllers)) {
    console.log('key: ', key);
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    ipcMain.handle(key, async (event, ...args: any[]) => {
      try {
        const result = await controller(...args)
        return result
      } catch (error) {
        console.error('Error in handleServices: ', error)
        return error
      }
    })
  }
}
