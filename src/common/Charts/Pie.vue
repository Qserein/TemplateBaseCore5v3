<script setup lang="ts">
import { MathEx } from 'libsugar/math/index'
import { computed } from 'vue'
import { bool } from '../../utils'

const props = withDefaults(
  defineProps<{
    /** 饼大小 */
    size?: number
    /** 环宽度，不填是饼 */
    ring?: number
    /** 是否圆角 */
    round?: boolean
    /** 百分比， 0~1 范围 */
    rat: number
    /** 颜色 */
    color: string
    /** 浮中颜色 */
    hover?: string
    /** 是否浮中 */
    hovered?: boolean
  }>(),
  {
    size: 100,
    round: false,
  }
)
const min = Math.min
const max = Math.max
const rat = computed(() => MathEx.clamp(props.rat, 0, 1))
</script>

<template>
  <div
    class="pie grid grid-cols-2"
    :class="{ 'ring-mode': typeof ring == 'number', round: bool(round), hover: bool(hovered) }"
    :style="({ 
      '--size': `${size}px`,
      '--ring': typeof ring == 'number' ? `${ring}px` : void 0,
      '--color': color,
      '--hover': hover || color,
      '--deg': `${rat * 360}deg`, 
      '--ldeg': `${min(rat * 360, 180) - 180}deg`, 
      '--rdeg': `${max(rat * 360, 180)}deg`
    } as any)"
  >
    <div class="part left grid">
      <div class="box grid justify-start"></div>
    </div>
    <div class="part right grid">
      <div class="box grid justify-end"></div>
    </div>
    <template v-if="bool(round) && rat > 0">
      <div class="start col-span-full row-span-full"></div>
      <div class="end col-span-full row-span-full"></div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.pie {
  width: var(--size);
  height: var(--size);
  border-radius: var(--size);
  pointer-events: none;

  > .start,
  > .end {
    display: grid;
    border-radius: var(--size);

    &::before {
      content: '';
      display: block;
      place-self: flex-end center;
      width: var(--ring);
      height: var(--ring);
      border-radius: var(--ring);
      background: var(--color);
      transition: background-color 0.25s;
    }
  }
  > .end {
    transform: rotateZ(var(--deg));
  }

  > .part {
    overflow: hidden;

    > .box {
      width: 100%;
      height: 100%;
      overflow: hidden;

      &::before {
        content: '';
        display: block;
        pointer-events: all;
        width: var(--size);
        height: var(--size);
        background: var(--color);
        border-radius: var(--size);
        transition: background-color 0.25s, border-color 0.25s;
      }
    }
  }

  &:hover, &.hover {
    > .part {
      > .box {
        &::before {
          background: var(--hover);
        }
      }
    }
    > .start,
    > .end {
      &::before {
        background: var(--hover);
      }
    }
  }

  &.ring-mode {
    > .part {
      > .box {
        &::before {
          background: unset;
          border: var(--ring) solid var(--color);
        }
      }
    }

    &:hover, &.hover {
      > .part {
        > .box {
          &::before {
            border-color: var(--hover);
          }
        }
      }
    }
  }

  > .left {
    grid-column: 1;
    grid-row: 1;
    border-radius: var(--size) 0 0 var(--size);

    > .box {
      transform-origin: right center;
      transform: rotateZ(var(--ldeg));
    }
  }

  > .right {
    grid-column: 2;
    grid-row: 1;
    border-radius: 0 var(--size) var(--size) 0;

    > .box {
      transform-origin: left center;
      transform: rotateZ(var(--rdeg));
    }
  }
}
</style>
