import { inject, InjectionKey } from 'vue'
import { ReactiveRef, reactiveRef } from '../../utils/reactive'

export type UiTreeData = {
  /** 根节点 */
  root?: any[]
  /** 对象键 */
  prop?: {
    /** 默认 ID */
    key?: string
    /** 默认 Title */
    title?: string
    /** 默认 Child */
    child?: string
    /** 默认 HasChild */
    hasChild?: string
  }
  /** 当前展开的项 */
  expand?: Set<any>
  /** 根据 ID 取数据 */
  map?: Map<any, any>
  /** 是否显示竖线 */
  line?: boolean
  /** 获取每层数据的函数 */
  getData?(obj: any): Promise<void>
}
export function useUiTreeData<T extends UiTreeData>(d: ReactiveRef<T>): T {
  return reactiveRef<T>(d)
}

export type UiTreeCtx = {
  root: any[]
  /** 当前展开的项 */
  expand: Set<any>
  /** 对象键 */
  prop: {
    /** 默认 ID */
    key: string
    /** 默认 Title */
    title: string
    /** 默认 Child */
    child: string
    /** 默认 HasChild */
    hasChild: string
  }
  /** 是否显示竖线 */
  line?: boolean
  /** 加载中的项 */
  loading: Set<any>
  /** 每层的节点元素 */
  nodeDoms: Map<any, HTMLDivElement>
  /** 每层的盒子高度 */
  boxHeight: Map<any, number>
  /** 当前选中的 key */
  current: any
  /** 设置当前选中的 key */
  setCurrent(v: any): void
  openNode(obj: any): Promise<void>
  closeNode(obj: any): void
}

export const UiTreeCtx: InjectionKey<UiTreeCtx> = Symbol('UiTreeCtx')
export function useUiTreeCtx() {
  return inject(UiTreeCtx)
}

export type UiTreeExpose = {
  initData(): Promise<void>
}
