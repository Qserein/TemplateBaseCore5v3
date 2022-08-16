<script setup lang="ts">
import { seq } from 'libsugar/seq'
import { computed, Ref } from 'vue'
import { PieItem } from './MultiPie'
import Pie from './Pie.vue'

const props = withDefaults(
  defineProps<{
    /** 饼大小 */
    size?: number
    /** 环宽度，不填是饼 */
    ring?: number
    /** 饼数据 */
    data: PieItem[]
    refs?: Record<PropertyKey, Ref<HTMLDivElement | undefined>>
  }>(),
  {
    size: 100,
  }
)

const total = computed(
  () =>
    seq(props.data)
      .map(i => Math.max(0, i.val))
      .sum() ?? 0
)
const parts = computed(() => {
  let r = 0
  return seq(props.data)
    .map(({ val, ...o }) => {
      const rat = total.value <= 0 ? 1 / props.data.length : val / total.value
      return { rat, r: [r, (r += rat)][0], ...o }
    })
    .collect()
})
</script>

<template>
  <div class="multi-pie grid" :class="{ 'ring-mode': typeof ring == 'number' }" :style="({ '--size': `${size}px`, '--ring': typeof ring == 'number' ? `${ring}px` : void 0 } as any)">
    <div class="part" :class="{ hover: p.hovered }" :ref="refs?.[p.id]" v-for="p in parts" :key="p.id" :style="({ '--r': `${p.r * 360}deg` } as any)">
      <Pie class="pie" :size="size" :ring="ring" :rat="p.rat" :color="p.color" :hover="p.hover" :hovered="p.hovered" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.multi-pie {
  width: var(--size);
  height: var(--size);

  > * {
    grid-column: 1;
    grid-row: 1;
  }
  > .part {
    width: var(--size);
    height: var(--size);
    --x: 0;
    --y: 0;
    --z: 1;
    transform: rotate3d(var(--x), var(--y), var(--z), var(--r));
    pointer-events: none;
    cursor: pointer;

    > .pie {
      transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    &:hover,
    &.hover {
      > .pie {
        transform: scale(1.15);
      }
    }
  }
}
</style>
