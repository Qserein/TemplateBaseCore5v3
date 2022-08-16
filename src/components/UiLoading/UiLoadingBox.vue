<script setup lang="ts">
import IconLoading from '../../Icons/IconLoading.vue'
import { bool } from '../../utils'

const props = defineProps<{
  show?: any
  large?: boolean
}>()
</script>

<template>
  <div class="ui-loading-box grid">
    <div class="loading" :class="{ show: bool(show), large: bool(large) }">
      <IconLoading class="animate-spin" />
    </div>
    <div class="box">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss">
.ui-loading-box {
  > * {
    grid-area: 1 / 1;
  }

  > .loading {
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 50px;
    color: #409eff;
    background-color: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(1px);
    border-radius: 9px;
    transition: opacity 0.25s;

    &:not(.show) {
      opacity: 0;
      pointer-events: none;
    }

    &.large {
      font-size: 100px;
    }
  }
}
</style>
