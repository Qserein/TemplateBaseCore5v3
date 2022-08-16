import { ECharts } from 'echarts'
export type ECBasicOption = Parameters<ECharts['setOption']>[0]

export interface ChartExpose {
  chart: ECharts
}
