import type { EChartsOption } from 'echarts/types/dist/echarts'
import { reactiveRef, ReactiveRef } from '../../utils/reactive'
import EchartsVue from './Echarts.vue'

export default EchartsVue

export function useEchartsOption(option: ReactiveRef<EChartsOption>) {
  return reactiveRef(option)
}
