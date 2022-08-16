<script setup lang="ts">
import Ease from '../Ani/Ease.vue'
const props = defineProps<{
  progress: number
}>()
</script>

<template>
  <div class="progress flex items-center">
    <Ease :v="progress" v-slot="{ v }">
      <div class="track">
        <div class="bar" :style="{ width: `${v * 100}%` }"></div>
      </div>
      <div class="rat">{{ (v * 100).toFixed(2) }}%</div>
    </Ease>
  </div>
</template>

<style lang="scss" scoped>
.progress {
  width: 100%;

  > .track {
    width: 100%;
    flex: 1;
    height: 15px;
    border-radius: 1000px;
    background: #f3f3f3;
    margin: 0 15px;
    overflow: hidden;

    > .bar {
      height: 100%;
      border-radius: 1000px;
      background: linear-gradient(to right, #22c55e, #a3e635);
    }
  }
  >.rat {
    width: 90px;
    padding: 0 15px;
  }
}
</style>
