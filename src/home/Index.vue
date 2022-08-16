<script setup lang="ts">
import { ALayout, ALayoutContent } from '../antd'
import { ref } from 'vue'
import TheHeader from './TheHeader.vue'
import TheLeft from './TheLeft.vue'
import { RouterView, useRoute } from 'vue-router'

const collapsed = ref(false)

const route = useRoute()
</script>

<template>
  <a-layout id="home">
    <TheHeader></TheHeader>
    <a-layout>
      <TheLeft v-model:collapsed="collapsed"></TheLeft>
      <a-layout-content id="content" class="grid">
        <router-view v-slot="{ Component }">
          <transition name="fade">
            <div class="box col-1 row-1 flex flex-col overflow-x-hidden" :key="route.fullPath">
              <component :is="Component" />
            </div>
          </transition>
        </router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style lang="scss">
#home {
  min-height: 100vh;
}

#content {
  padding: 15px 20px;

  > .box {
    padding: 0 15px;
    background-color: #fff;

    &.fade-enter-active {
      transition: opacity 0.25s ease-out;
    }

    &.fade-leave-active {
      transition: opacity 0.25s ease-in;
    }

    &.fade-enter-from,
    &.fade-leave-to {
      opacity: 0;
    }
  }
}
</style>
