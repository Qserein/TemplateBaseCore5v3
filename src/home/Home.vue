<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ASpace } from '../antd'
import PanelGroup from './PanelGroup.vue'
import Chart from './Chart.vue'
import { ECBasicOption } from './Chart'
import { aget } from '../api'
import { ApiResultList } from '../api/def'

const expectedData = ref<any[]>([])
const actualData = ref<any[]>([])

getData()

async function getData() {
  await Promise.all([
    (async () => {
      const res = await aget<ApiResultList<any>>('/api/Admin/Welcome/ExLoginCount')
      if (res.success) {
        expectedData.value = Object.entries(res.data).map(([, v]) => v)
      }
    })(),
    (async () => {
      const res = await aget<ApiResultList<any>>('/api/Admin/Welcome/UsersLoginCount')
      if (res.success) {
        actualData.value = Object.entries(res.data).map(([, v]) => v)
      }
    })(),
  ])
}

const chartOption = reactive<ECBasicOption>({
  xAxis: {
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    boundaryGap: false,
    axisTick: {
      show: false,
    },
  },
  grid: {
    left: 10,
    right: 10,
    bottom: 20,
    top: 30,
    containLabel: true,
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
    },
    padding: [5, 10],
  },
  yAxis: {
    axisTick: {
      show: false,
    },
  },
  legend: {
    data: ['expected', 'actual'],
  },
  series: [
    {
      name: 'expected',
      itemStyle: {
        normal: {
          color: '#FF005A',
          lineStyle: {
            color: '#FF005A',
            width: 2,
          },
        },
      },
      smooth: true,
      type: 'line',
      data: expectedData,
      animationDuration: 2800,
      animationEasing: 'cubicInOut',
    },
    {
      name: 'actual',
      smooth: true,
      type: 'line',
      itemStyle: {
        normal: {
          color: '#3888fa',
          lineStyle: {
            color: '#3888fa',
            width: 2,
          },
          areaStyle: {
            color: '#f3f8ff',
          },
        },
      },
      data: actualData,
      animationDuration: 2800,
      animationEasing: 'quadraticOut',
    },
  ],
})
</script>

<template>
  <div class="box flex flex-col">
    <a-space direction="vertical" size="large">
      <PanelGroup />
      <div></div>
      <div style="p-5">
        <Chart :data="chartOption"></Chart>
      </div>
    </a-space>
  </div>
</template>

<style lang="scss" scoped>
.box {
  padding: 20px 5px;
}
</style>
