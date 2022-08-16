import { reactive, toRef, watch } from 'vue'
import { MenuViewModel } from './api'
import { Browser, getBrowser } from './utils/browser'

export interface Store {
  menus: MenuViewModel[]
  menusMap: Record<string, MenuViewModel[]>
  browser: Browser
}

export const store = reactive<Store>({
  menus: [],
  menusMap: {},
  browser: getBrowser(),
})
export default store

export function initStore() {
  const menus = toRef(store, 'menus')

  watch(menus, menus => {
    buildMenusMap(menus)
  })

  function buildMenusMap(menus: MenuViewModel[]) {
    store.menusMap = Object.fromEntries(menus.flatMap(l1 => [[l1.url, [l1]], ...(l1.childMenus?.map(l2 => [l2.url, [l1, l2]]) ?? [])]))
  }
}
