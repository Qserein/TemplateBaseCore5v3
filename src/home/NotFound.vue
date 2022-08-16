<script setup lang="ts">
import { AResult, AButton } from '../antd'
import router from '../router'

function backToIndex() {
  router.push('/')
}
</script>

<template>
  <a-result status="404" title="404" sub-title="抱歉，您访问的页面不存在">
    <template #extra>
      <div class="flex justify-center">
        <a-button type="primary" @click="backToIndex()">返回首页</a-button>
      </div>
    </template>
  </a-result>
</template>

<style lang="scss"></style>
