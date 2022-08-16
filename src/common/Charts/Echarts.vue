<script lang="ts">
const echarts = import('echarts')
</script>
<script setup lang="ts">
import type { EChartsOption, EChartsType } from 'echarts'
import { markRaw, nextTick, onMounted, onUnmounted, reactive, ref, toRef, watch } from 'vue'

const props = defineProps<{
  option: EChartsOption
}>()

const chart = ref<EChartsType>()
const dom = ref<HTMLDivElement>()
const option = toRef(props, 'option')

onMounted(() => {
  calcSize()
})

async function initChart() {
  const { init } = await echarts
  chart.value = markRaw(init(dom.value!, void 0, { width: size.width, height: size.height }))
  chart.value.setOption(props.option)
}

onUnmounted(() => {
  chart.value?.dispose()
})

watch(
  option,
  option => {
    if (chart.value == null) return
    chart.value.setOption(option)
  },
  {
    deep: true,
  }
)

const boxDom = ref<HTMLDivElement>()
const size = reactive({
  width: 0,
  height: 0,
})
const aid = ref(0)
function calcSize() {
  aid.value = requestAnimationFrame(calcSize)
  size.width = boxDom.value!.offsetWidth
  size.height = boxDom.value!.offsetHeight
}
onUnmounted(() => {
  cancelAnimationFrame(aid.value)
})

watch(size, () => {
  nextTick(() => initChart())
})
</script>

<template>
  <div class="chart" ref="boxDom">
    <div class="box">
      <div ref="dom" :key="`${size.width}-${size.height}`" :style="{ width: size.width, height: size.height }"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chart {
  overflow: hidden;

  > .box {
    width: 0;
    height: 0;
  }
}
</style>
