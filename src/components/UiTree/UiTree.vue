<script setup lang="ts">
import { seq } from 'libsugar/seq'
import { computed, provide, reactive, ref, toRef, watch } from 'vue'
import { reactiveRef } from '../../utils/reactive'
import { UiTreeCtx, UiTreeData, UiTreeExpose } from './UiTree'
import UiTreeNode from './UiTreeNode.vue'

const props = defineProps<{
  data?: UiTreeData
  /** 当前选中的项 */
  current?: any
}>()

const emit = defineEmits<{
  (type: 'update:current', v: any): void
}>()

const data = computed(() => props.data ?? {})

const root = computed(() => props.data?.root ?? [])

const local_expand = reactive(new Set<any>())
const expand = computed(() => props.data?.expand ?? local_expand)

const line = computed(() => props.data?.line)

const loading = reactive(new Set<any>())

const prop_key = computed(() => props.data?.prop?.key ?? 'ID')
const prop_title = computed(() => props.data?.prop?.title ?? 'Title')
const prop_child = computed(() => props.data?.prop?.child ?? 'Child')
const prop_hasChild = computed(() => props.data?.prop?.hasChild ?? 'HasChild')

const nodeDoms = reactive(new Map<any, HTMLDivElement>())

const current = computed(() => props.current)
function setCurrent(v: any) {
  emit('update:current', v)
}

const boxHeight = computed(() => {
  const map = new Map<any, number>()

  calc(root.value)
  function calc(items: any[]) {
    let h = 0
    for (const item of items) {
      const key = item[prop_key.value]
      const dom = nodeDoms.get(key)
      if (!dom) continue
      h += dom.offsetHeight
      if (!expand.value.has(key)) continue
      const child = item[prop_child.value]
      if (!child || !child?.length) continue
      const ch = calc(child)
      map.set(key, ch)
      h += ch
    }
    return h
  }
  return map
})

provide(
  UiTreeCtx,
  reactiveRef<UiTreeCtx>({
    root,
    expand,
    prop: {
      key: prop_key,
      title: prop_title,
      child: prop_child,
      hasChild: prop_hasChild,
    },
    line,
    loading,
    nodeDoms,
    boxHeight,
    current,
    setCurrent,
    openNode,
    closeNode,
  })
)

initData()
async function initData() {
  if (props.data?.map) {
    props.data.map.clear()
  }
  if (!props.data?.getData) return
  await doGetChild(root.value)
}

async function doGetData(obj: any) {
  await props.data?.getData?.(obj)
  await doGetChild(obj[prop_child.value])
}

async function doGetChild(child: any[]) {
  await Promise.all(
    seq(child)
      .also(obj => {
        if (props.data?.map) {
          props.data.map.set(obj[prop_key.value], obj)
        }
      })
      .filter(obj => expand.value.has(obj[prop_key.value]))
      .map(obj => doGetData(obj))
      .collect()
  )
}

function closeNode(obj: any) {
  expand.value.delete(obj[prop_key.value])
}

async function openNode(obj: any) {
  const key = obj[prop_key.value]
  if (obj[prop_child.value]) {
    expand.value.add(key)
  } else {
    loading.add(key)
    try {
      await doGetData(obj)
      expand.value.add(key)
    } finally {
      loading.delete(key)
    }
  }
}

defineExpose(
  reactiveRef<UiTreeExpose>({
    initData,
  })
)
</script>

<template>
  <div class="ui-tree flex flex-col">
    <ui-tree-node v-for="t in data?.root ?? []" :tab="0" :t="t" :key="t[prop_key]"></ui-tree-node>
  </div>
</template>

<style lang="scss" scoped>
.ui-tree {
  user-select: none;
}
</style>
