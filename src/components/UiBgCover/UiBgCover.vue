<script setup lang="ts">
import { bool } from '../../utils'
import Fade from '../../common/Ani/Fade.vue'

const props = withDefaults(
  defineProps<{
    show?: boolean
    noClick?: boolean
  }>(),
  {
    show: false,
    noClick: false,
  }
)

const emit = defineEmits<{
  (type: 'update:show', v: boolean): void
}>()

const body = document.body

function onClick() {
  if (bool(props.noClick)) return
  emit('update:show', false)
}
</script>

<template>
  <teleport :to="body">
    <Fade :show="bool(show)" class="z-100">
      <div class="ui-bg-cover grid" @click="onClick">
        <div class="box grid" @click.stop>
          <slot></slot>
        </div>
      </div>
    </Fade>
  </teleport>
</template>

<style lang="scss">
.ui-bg-cover {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background: rgba(0, 0, 0, 0.5);

  > .box {
    width: 100%;
    height: 100%;
  }
}
</style>
