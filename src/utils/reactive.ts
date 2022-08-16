import { reactive, Ref } from 'vue'

export type ReactiveRef<T> = { [K in keyof T]: T[K] | ReactiveRef<T[K]> | Ref<ReactiveRef<T[K]>> }

export function reactiveRef<T>(obj: ReactiveRef<T>): T {
  return reactive(obj as any)
}
