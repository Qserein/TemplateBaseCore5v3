export interface PieItem {
  /** 唯一 ID */
  id: PropertyKey
  /** 值 */
  val: number
  /** 颜色 */
  color: string
  /** 浮中颜色 */
  hover: string
  /** 是否浮中 */
  hovered?: boolean
}
