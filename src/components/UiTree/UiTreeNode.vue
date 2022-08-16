<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, onUpdated, ref, watch, WatchStopHandle } from 'vue'
import IconFold from '../../Icons/IconFold.vue'
import { useUiTreeCtx } from './UiTree'
import IconLoading from '../../Icons/IconLoading.vue'
import { ConsoleSqlOutlined } from '@ant-design/icons-vue'

const props = withDefaults(
  defineProps<{
    t: any
    /** 缩进层级 */
    tab?: number
  }>(),
  {
    tab: 0,
  }
)

const ctx = useUiTreeCtx()!

const line = computed(() => ctx.line)

const key = computed(() => props.t[ctx.prop.key])
const title = computed(() => props.t[ctx.prop.title])
const child = computed(() => props.t[ctx.prop.child] ?? [])
const hasChild = computed(() => props.t[ctx.prop.hasChild] !== false)
const open = computed(() => ctx.expand.has(key.value))

const loading = computed(() => ctx.loading.has(key.value))

const selected = computed(() => ctx.current == key.value)

function toggleOpen() {
  if (loading.value) return
  if (open.value) ctx.closeNode(props.t)
  else {
    if (!hasChild.value) return
    ctx.openNode(props.t)
  }
}

const boxHeight = computed(() => ctx.boxHeight.get(key.value) ?? 0)
const nodeDom = ref<HTMLDivElement>()
onMounted(() => {
  ctx.nodeDoms.set(key.value, nodeDom.value!)
})
onUnmounted(() => {
  ctx.nodeDoms.delete(key.value)
})

function select() {
  ctx.setCurrent(key.value)
}
</script>

<template>
  <div class="ui-tree-node grid" :class="{ open, 'no-child': !hasChild, selected }" :style="({ '--tab': tab, '--h': `${boxHeight}px` } as any)">
    <div class="bar grid" ref="nodeDom">
      <div class="box flex items-center" @click="select()">
        <div class="icon grid" @click.stop="toggleOpen()">
          <div class="icon fold grid" :class="{ show: !loading }"><IconFold /></div>
          <div class="icon loading grid animate-spin" :class="{ show: loading }"><IconLoading /></div>
        </div>
        <div class="title">{{ title }}</div>
      </div>
    </div>
    <div class="childs grid">
      <div class="box flex flex-col" :data-open="open">
        <ui-tree-node v-for="st in child" :key="st[ctx.prop.key]" :tab="tab + 1" :t="st" />
      </div>
    </div>
    <div class="line" v-if="line"></div>
  </div>
</template>

<style lang="scss">
.ui-tree-node {
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;
  --bar-font-size: 14px;

  > .bar {
    grid-area: 1 / 1;
    cursor: pointer;
    padding: 2px 0px;

    > .box {
      padding: 3px 9px;
      color: #606266;
      transition: background 0.25s, border 0.25s, color 0.25s;
      border-radius: 9px;
      padding-left: calc(9px + var(--tab) * var(--bar-font-size));
      white-space: nowrap;
      border: 1px solid transparent;

      &:hover {
        background: #ecf5ff;
      }

      > .icon {
        transition: transform 0.25s, opacity 0.25s;
        width: 20px;
        height: 20px;
        font-size: 16px;
        grid-template-columns: 1fr;
        grid-template-rows: 1fr;

        > .icon {
          grid-area: 1 / 1;
          place-self: center;
          width: 20px;
          height: 20px;
          transition: transform 0.25s, opacity 0.25s;
          align-items: center;
          justify-content: center;

          &:not(.show) {
            opacity: 0;
          }
        }
      }

      > .title {
        padding: 0 9px;
        font-size: var(--bar-font-size);
      }
    }
  }

  > .childs {
    grid-area: 2 / 1;
    overflow: hidden;
    height: var(--h);
    transition: height 0.25s, opacity 0.25s;
    grid-auto-rows: min-content;
  }

  > .line {
    grid-area: 2 / 1;
    width: 1px;
    background: #ccc;
    transform: translate(calc(9px + calc(var(--tab) + 0.5) * var(--bar-font-size) + 2px), 0);
    height: calc(var(--h));
    transition: height 0.25s, opacity 0.25s;
    pointer-events: none;
    opacity: 0.5;
  }

  &:not(.open) {
    > .bar {
      > .box {
        > .icon {
          > .fold {
            transform: rotate(-90deg);
          }
        }
      }
    }
    > .childs {
      height: 0;
      opacity: 0;
    }
    > .line {
      height: 0;
      opacity: 0;
    }
  }
  &.no-child {
    > .bar {
      > .box {
        > .icon {
          opacity: 0;
        }
      }
    }
  }
  &.selected {
    > .bar {
      > .box {
        background: #ecf5ff;
        border-color: #b3d8ff;
      }
    }
  }
}
</style>
