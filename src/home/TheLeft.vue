<script setup lang="ts">
import { ref, toRef, watch } from 'vue'
import { ALayoutSider, AMenu, AMenuItem, ASubMenu, ASkeleton } from '../antd'
import { aget, MenuRes } from '../api'
import MenuIcon from './MenuIcon.vue'
import store from '../store'
import { RouterLink, useRoute } from 'vue-router'

defineProps<{
  collapsed: boolean
}>()

defineEmits<{
  (e: 'update:collapsed', v: boolean): void
}>()

const route = useRoute()
const selectedKeys = ref<string[]>([])
const openKeys = ref<string[]>([])

const menusMap = toRef(store, 'menusMap')

watch([route, menusMap], ([route, menusMap]) => {
  const paths = [...(menusMap[route.path] ?? [])]
  selectedKeys.value = [paths[paths.length - 1]?.name]
  openKeys.value = [...new Set<string>([...openKeys.value, ...paths.map(i => i.name)])]
})

const menus = toRef(store, 'menus')
const loading = ref(true)

getMenu()
async function getMenu() {
  const res = await aget<MenuRes>('/api/Admin/Index', void 0, { nolog: true })
  loading.value = false
  if (res.success) {
    menus.value = res.data
  }
}
</script>
<template>
  <a-layout-sider id="leftnav" :collapsed="collapsed" @update:collapsed="$emit('update:collapsed', $event)" collapsible>
    <transition name="fade">
      <div class="skeleton px-2" v-if="loading && menus.length == 0">
        <a-skeleton v-for="i in 3" :key="i" active :title="false" :paragraph="{ rows: 2 }" />
      </div>

      <a-menu class="menus" theme="dark" v-model:selectedKeys="selectedKeys" v-model:openKeys="openKeys" mode="inline" v-else>
        <a-sub-menu v-for="i in menus" :key="i.name">
          <template #title>
            <MenuIcon :icon="i.icon" />
            <span>{{ i.name }}</span>
          </template>

          <a-menu-item v-for="s in i.childMenus" :key="s.name">
            <router-link :to="s.url">{{ s.name }}</router-link>
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </transition>
  </a-layout-sider>
</template>

<style lang="scss">
#leftnav {
  overflow: auto;
  position: sticky;
  left: 0;
  top: 0;
  height: 100%;

  &.ant-layout-sider-collapsed {
    padding: 4px 0;
  }

  .fade-enter-active {
    transition: opacity 0.25s;
  }

  .fade-leave-active {
    transition: opacity 0.25s;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .skeleton {
    height: 0;
    max-height: 0;
    z-index: 100;
  }

  .menus {
    background: #363e4f;
  }
}

body {
  .ant-menu-dark .ant-menu-sub,
  .ant-menu.ant-menu-dark .ant-menu-sub {
    background: #363e4f;
  }
}

#app {
  .ant-layout-sider {
    background: #515a6e !important;

    .ant-layout-sider-trigger {
      background: #515a6e !important;
    }
  }

  .ant-menu {
    background: #515a6e !important;
  }

  .ant-menu-inline.ant-menu-sub {
    background: #363e4f !important;
  }

  .ant-menu-submenu-active,
  .ant-menu-submenu-open,
  .ant-menu-submenu-selected,
  .ant-menu-submenu-title:hover {
    color: rgba(255, 255, 255, 0.65);
  }

  .ant-menu-submenu:hover {
    background: rgb(65, 72, 88);
  }

  .ant-menu-submenu-title {
    margin-top: 0;
    margin-bottom: 0;
    height: 48px;
  }

  .ant-menu-submenu-title {
    display: flex;
  }

  .ant-menu-title-content {
    height: 100%;
    display: flex;
    align-items: center;
  }

  .ant-menu.ant-menu-inline-collapsed > .ant-menu-submenu > .ant-menu-submenu-title .anticon {
    line-height: 16px;
  }
}

.ant-menu-dark.ant-menu-dark:not(.ant-menu-horizontal) .ant-menu-item-selected {
  background: #363e4f !important;
  color: rgb(255, 208, 75) !important;

  a {
    color: rgb(255, 208, 75) !important;
  }
}
</style>
