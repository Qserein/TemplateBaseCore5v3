import { isRef, Ref } from 'vue'

export type BasicTarget<T = HTMLElement> = (() => T | null) | T | null | Ref<T | null | undefined>

type TargetElement = HTMLElement | Element | Document | Window

export function getTargetElement(target?: BasicTarget<TargetElement>, defaultElement?: TargetElement): TargetElement | undefined | null {
  
  if (!target) {
    return defaultElement
  }

  let targetElement: TargetElement | undefined | null

  if (isRef(target)) {
    targetElement = target.value
  } else if (typeof target === 'function') {
    targetElement = target()
  } else {
    targetElement = target
  }

  return targetElement
}
