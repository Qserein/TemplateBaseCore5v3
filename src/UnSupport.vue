<script setup lang="ts"></script>

<template>
  <div id="un-support">
    <div class="box">
      <h1>您的浏览器过于老旧，已不被支持</h1>
      <div class="links">
        <span>请下载</span>
        <a href="https://www.microsoft.com/zh-cn/edge" target="_blank">新版 Edge</a>
        <span>或</span>
        <a href="https://www.google.cn/chrome/index.html" target="_blank">新版 Chrome</a>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#un-support {
  position: fixed;
  width: 100%;
  height: 100%;

  > .box {
    width: 300px;
    margin: 10% auto;

    > h1 {
      text-align: center;
      font-size: 20px;
      font-weight: lighter;
    }

    >.links {
      margin: 20px;
      text-align: center;

      >a {
        color: rgb(72, 121, 228);
        margin: 0 10px;
      }
    }
  }
}
</style>
