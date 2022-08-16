<script setup lang="ts">
import gsap from 'gsap'
import { reactive, toRef, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    v: number
    duration?: number
  }>(),
  {
    duration: 0.25,
  }
)

const obj = reactive({ number: props.v })

const v = toRef(props, 'v')
const duration = toRef(props, 'duration')

watch([v, duration], ([v, duration]) => {
  gsap.to(obj, { duration, number: v })
})
</script>

<template>
  <slot :v="obj.number">{{ obj.number }}</slot>
</template>

<style lang="scss" scoped></style>
