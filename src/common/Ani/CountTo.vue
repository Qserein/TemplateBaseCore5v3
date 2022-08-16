<script setup lang="ts">
// 参考 https://github.com/PanJiaChen/vue-countTo/blob/master/src/vue-countTo.vue
import { computed, nextTick, ref, toRef, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    /** 最后要显示的值 */
    value: number
    /** 从哪开始动效，默认 0 */
    from?: number
    /** 动效时长， 默认 3000 */
    duration?: number
    /** 分隔符，默认 `,` */
    separator?: string
    /** 分隔数字数，默认 3 */
    split?: number
    /** 前缀， 可选 */
    prefix?: string
    /** 后缀，可选 */
    suffix?: string
    /** 小数数量， 默认 0 */
    decimals?: number
    /** 小数点形式，默认 `.` */
    decimal?: string
    /** 缓动函数 */
    easing?: (timestamp: number, from: number, to: number, duration: number) => number
  }>(),
  {
    from: 0,
    duration: 3000,
    separator: ',',
    split: 3,
    decimals: 0,
    decimal: '.',
    easing: (timestamp: number, from: number, to: number, duration: number) => (to * (-Math.pow(2, (-10 * timestamp) / duration) + 1) * 1024) / 1023 + from,
  }
)

const currentValue = ref(props.from)

const display = computed(() => {
  const prefix = props.prefix ? `${props.prefix} ` : ''
  const suffix = props.suffix ? ` ${props.suffix}` : ''
  return `${prefix}${format(currentValue.value)}${suffix}`
})

function format(n: number) {
  let s = n.toFixed(props.decimals)
  let [int, decimal] = s.split('.')
  if (decimal != null) decimal = `${props.decimal}${decimal}`
  let ints: string[] = []
  const split = props.split
  const len = int.length
  for (let i = 0; i <= len; i += split) {
    ints.unshift(int.slice(-i - split, len - i))
  }
  int = ints.join(props.separator)
  return `${int}${decimal ?? ''}`
}

const aid = ref(0)

const fromRef = toRef(props, 'from')
const valueRef = toRef(props, 'value')

watch([valueRef, fromRef], () => {
  start()
})

if (props.value != props.from) {
  nextTick(() => start())
}

const startTime = ref<number | null>(null)
const paused = ref(false)
const from = ref(props.from)
const duration = ref(props.duration)

function start() {
  startTime.value = null
  paused.value = false
  from.value = props.from
  duration.value = props.duration
  aid.value = requestAnimationFrame(count)
}

function pause() {
  cancelAnimationFrame(aid.value)
}

function resume() {
  startTime.value = null
  duration.value = remaining.value ?? 0
  from.value = currentValue.value
  aid.value = requestAnimationFrame(count)
}

function reset() {
  startTime.value = null
  cancelAnimationFrame(aid.value)
  currentValue.value = props.from
}

const countDown = computed(() => props.from > props.value)

const timestamp = ref(0)
const remaining = ref(0)

function count(t: number) {
  if (!startTime.value) startTime.value = t
  timestamp.value = t
  const progress = t - startTime.value
  remaining.value = duration.value - progress

  if (countDown.value) {
    currentValue.value = from.value - props.easing(progress, 0, from.value - props.value, duration.value)
  } else {
    currentValue.value = props.easing(progress, from.value, props.value - from.value, duration.value)
  }

  if (countDown.value) {
    currentValue.value = Math.max(currentValue.value, props.value)
  } else {
    currentValue.value = Math.min(currentValue.value, props.value)
  }

  if (progress < duration.value) {
    aid.value = requestAnimationFrame(count)
  }
}

defineExpose({
  pause,
  resume,
  reset,
})
</script>

<template>{{ display }}</template>

<style lang="scss"></style>
