<script setup lang="ts">
import { ref, toRef, watch } from 'vue'
import { Task } from 'libsugar/task'

const props = withDefaults(
  defineProps<{
    show: boolean
    time?: number
  }>(),
  {
    time: 250,
  }
)

const show = toRef(props, 'show')
const ashow = ref(props.show)
const display = ref(props.show)

watch(show, (show, old) => {
  if (show == old) return
  if (show) {
    display.value = true
    setTimeout(() => (ashow.value = show), 0)
  } else {
    ashow.value = show
  }
})

let lastTask = ref<Task<void>>()
watch(ashow, (show, old) => {
  if (show == old) return
  if (show) return void transEnd()
  lastTask.value?.cancel()
  lastTask.value = Task.run(async self => {
    await Task.delay(self, props.time)
    transEnd()
  })
})

function transEnd() {
  lastTask.value?.cancel()
  display.value = show.value
}

const dom = ref<HTMLDivElement>()
defineExpose({
  dom
})
</script>

<template>
  <div ref="dom" class="fade" v-if="display" :class="{ show: ashow }" :style="({ '--t': `${time}ms` } as any)" @transitionend="transEnd">
    <div class="box grid" @transitionend.stop>
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.fade {
  transition: opacity 0.25s;

  &:not(.show) {
    opacity: 0;
    pointer-events: none;
  }

  > .box {
    width: 100%;
    height: 100%;
  }
}
</style>
