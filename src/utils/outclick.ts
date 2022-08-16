import { onMounted, onUnmounted } from 'vue'
import { BasicTarget, getTargetElement } from './dom'

/** 监听点击了目标元素外的点击事件 */
export function onOutClick(target: BasicTarget | BasicTarget[], f: (e: MouseEvent) => void) {
  const targets = Array.isArray(target) ? target : [target]
  function onClick(e: MouseEvent) {
    if (
      targets.some(item => {
        const element = getTargetElement(item) as HTMLElement
        return !element || element?.contains(e.target as HTMLElement)
      })
    )
      return
    f(e)
  }
  onMounted(() => {
    window.addEventListener('click', onClick)
    window.addEventListener('click', onClick, { capture: true })
  })
  onUnmounted(() => {
    window.removeEventListener('click', onClick)
    window.removeEventListener('click', onClick, { capture: true })
  })
}
