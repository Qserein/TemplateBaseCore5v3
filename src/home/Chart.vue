<script setup lang="ts">
import { nextTick, onMounted, ref, toRef, watch } from 'vue'
import { init as initEcharts, ECharts } from 'echarts'
import 'echarts/theme/macarons'
export type ECBasicOption = Parameters<ECharts['setOption']>[0]

const props = withDefaults(
  defineProps<{
    width?: string
    height?: string
    autoResize?: boolean
    data: ECBasicOption
  }>(),
  {
    width: '100%',
    height: '350px',
    autoResize: true,
  }
)

const el = ref<HTMLDivElement>()
const chart = ref<ECharts>()

function initChart() {
  chart.value = initEcharts(el.value!, 'macarons')
  chart.value.setOption(props.data)
}

watch(
  toRef(props, 'data'),
  data => {
    chart.value?.setOption(data)
  },
  { deep: true }
)

onMounted(() => {
  nextTick(() => initChart())
})

defineExpose({
  chart,
})
</script>

<template>
  <div ref="el" class="chart" :style="{ height, width }"></div>
</template>

<style lang="scss"></style>
