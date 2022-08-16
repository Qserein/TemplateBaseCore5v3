import type { Maybe, Voidable } from 'libsugar'
import { Moment } from 'moment'
import { Ref, ref } from 'vue'

export function bool(v: any): v is true {
  if (import.meta.env.DEV) return !!v
  if (typeof v === 'boolean') return v
  return v != null
}

//节流
export function throttle<F extends (...args: unknown[]) => unknown>(fn: F, delay: number, immediate?: boolean): (...args: Parameters<F>) => void
export function throttle<T, F extends (this: T, ...args: unknown[]) => unknown>(fn: F, delay: number, immediate?: boolean): (this: T, ...args: Parameters<F>) => void
export function throttle<T, F extends (this: T, ...args: unknown[]) => unknown>(fn: F, delay: number, immediate?: boolean): (this: T, ...args: Parameters<F>) => void {
  let timer: number | undefined
  if (immediate) {
    return function (this: T, ...args: Parameters<F>) {
      if (!timer) {
        fn.apply(this, args)
        timer = setTimeout(() => {
          timer = void 0
        }, delay) as any
      }
    }
  } else {
    return function (this: T, ...args: Parameters<F>) {
      if (!timer) {
        timer = setTimeout(() => {
          fn.apply(this, args)
          timer = void 0
        }, delay) as any
      }
    }
  }
}

/** 从日期中取出日期范围 */
export function takeDate(d?: Maybe<Moment>): Voidable<string> {
  if (d == null) return void 0
  return `${d?.format('YYYY-MM-DD')}T00:00:00`
}

/** 日期范围转参数 */
export function toDateRange<From extends string, To extends string>(r: Maybe<Maybe<Moment>[]>, key?: { from?: From; to?: To }): { [K in From | To]?: string } {
  return {
    [key?.from ?? 'Date1']: takeDate(r?.[0]),
    [key?.to ?? 'Date2']: takeDate(r?.[1]),
  } as any
}

/** 消除 NaN */
export function noNaN(v: number) {
  if (isNaN(v)) return 0
  return v
}

export function unid() {
  return `${(+new Date()).toString(36)}-${Math.random().toString(36).substr(2)}`
}
export function kv(ID: number, Title: string) {
  return { ID, Title }
}

/** 检查标志位是否被设置 */
export function hasFlag(v: number, flag: number) {
  return (v & flag) == flag
}

/** 设置或清除标志位 */
export function setFlag(v: number, flag: number, has: boolean) {
  if (has) return v | flag
  else return v & ~flag
}

/** 防抖 */
export function debounce<F extends (this: any, ...args: any[]) => any>(time: number, fn: F): F
export function debounce<F extends (...args: any[]) => any>(time: number, fn: F): F
export function debounce<F extends (...args: any[]) => any>(time: number, fn: F): F {
  let timeout: any = null
  return function (this: any, ...args: Parameters<F>) {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => {
      fn.call(this, ...args)
    }, time)
  } as F
}

export function useDialog(defv: boolean, opt?: { open?(): void; close?(): void }): [show: Ref<boolean>, open: () => void, close: () => void] {
  const show = ref(defv)
  return [
    show,
    () => {
      opt?.open?.()
      show.value = true
    },
    () => {
      opt?.close?.()
      show.value = false
    },
  ]
}

/** 获取队列，队列只保留最新的请求 */
export function useQueue(): [loading: Ref<Promise<void> | null>, queue: <T>(task: (success: () => {}) => Promise<T>, success?: () => {}) => Promise<T>] {
  const loading = ref<Promise<void> | null>(null)
  const last = ref<null | [task: (success: () => {}) => Promise<any>, then: (v: any) => void, success?: () => void]>()

  async function execTask(task: (success: () => {}) => Promise<any>, then: (v: any) => void, success?: () => {}) {
    let res: (v: any) => void
    loading.value = new Promise<any>(r => (res = r))
    let call_success = false
    let r: any
    try {
      r = await task(() => (call_success = true))
    } finally {
      loading.value = null
      if (call_success) success?.()
      res!(r)
      then(r)
      if (last.value != null) {
        const [task, then] = last.value
        last.value = null
        execTask(task, then)
      }
    }
  }

  return [
    loading,
    async <T>(task: (success: () => {}) => Promise<T>, success?: () => {}) => {
      let res: (v: T) => void
      const p = new Promise<T>(r => (res = r))
      if (loading.value) {
        last.value = [task, res!, success]
      } else {
        execTask(task, res!, success)
      }
      return p
    },
  ]
}

export namespace ByteSize {
  export const KB = 1024
  export const MB = KB * 1024
  export const GB = MB * 1024
  export const TB = GB * 1024
  export const PB = TB * 1024
}

/** 计算字节大小 */
export function calcByteSize(size: number) {
  if (size < ByteSize.KB) return `${size} B`
  else if (size < ByteSize.MB) return `${(size / ByteSize.KB).toFixed(2)} KB`
  else if (size < ByteSize.GB) return `${(size / ByteSize.MB).toFixed(2)} MB`
  else if (size < ByteSize.TB) return `${(size / ByteSize.GB).toFixed(2)} GB`
  else if (size < ByteSize.PB) return `${(size / ByteSize.TB).toFixed(2)} TB`
  else return `${(size / ByteSize.PB).toFixed(2)} PB`
}
