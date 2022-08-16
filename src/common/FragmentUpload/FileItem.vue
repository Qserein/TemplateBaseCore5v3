<script setup lang="ts">
import { computed, onUnmounted, ref, toRef, watch } from 'vue'
import { AButton } from '../../antd'
import IconFile from './Icons/IconFile.vue'
import IconFileTxt from './Icons/IconFileTxt.vue'
import IconFileZip from './Icons/IconFileZip.vue'
import IconLoading from '../../Icons/IconLoading.vue'
import { UpLoadTask, UploadState, getFileType, FileAssetType } from './UploadTask'
import { noNaN } from '../../utils'
import IconFileExe from './Icons/IconFileExe.vue'
import ProgressBar from './ProgressBar.vue'

const props = defineProps<{
  task: UpLoadTask
  state: UploadState
}>()

const emit = defineEmits<{
  (type: 'remove'): void
}>()

const file = toRef(props.task, 'file')
const state = toRef(props.task, 'state')
const pstate = toRef(props, 'state')

const progress = computed(() => noNaN(props.task.chunk.finish / props.task.chunk.total))

const type = computed(() => getFileType(file.value))

const url = ref('')
watch(
  file,
  file => {
    if (url.value) {
      URL.revokeObjectURL(url.value)
    }
    url.value = URL.createObjectURL(file)
  },
  { immediate: true }
)
onUnmounted(() => {
  if (url.value) {
    URL.revokeObjectURL(url.value)
  }
})
</script>

<template>
  <div class="file-item grid">
    <div class="cover">
      <div class="bg" v-if="type == FileAssetType.Image || type == FileAssetType.Video"></div>
      <div class="icon" v-if="type == FileAssetType.Exe"><IconFileExe /></div>
      <div class="icon" v-else-if="type == FileAssetType.Zip"><IconFileZip /></div>
      <div class="icon" v-else-if="type == FileAssetType.Text"><IconFileTxt /></div>
      <video v-else-if="type == FileAssetType.Video" :src="url" muted autoplay loop />
      <img v-else-if="type == FileAssetType.Image" :src="url" />
      <div v-else class="icon"><IconFile /></div>
    </div>
    <div class="title">{{ file.name || '文件' }}</div>
    <div class="state" :class="{ show: state == UploadState.Failed }">
      <div class="state" style="color: red">上传失败</div>
    </div>
    <div class="state" :class="{ show: state == UploadState.None }">
      <div class="state">未开始上传</div>
    </div>
    <div class="state" :class="{ show: state == UploadState.Uploading }">
      <div class="state">上传中</div>
      <ProgressBar :progress="progress" />
      <div class="loading animate-spin">
        <IconLoading />
      </div>
    </div>
    <div class="state" :class="{ show: state == UploadState.Finish }">
      <div class="state" style="color: #67c23a">已完成</div>
    </div>
    <div class="oper" :class="{ show: pstate == UploadState.None }">
      <a-button @click="emit('remove')">移除</a-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.file-item {
  color: #333;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto;
  gap: 10px;

  > .cover {
    grid-area: 1 / 1 / -1 / 1;
    width: 70px;
    height: 70px;
    font-size: 60px;
    border: 1px solid #ccc;
    border-radius: 6px;
    display: grid;
    overflow: hidden;

    > * {
      grid-area: 1 / 1;
      place-self: center;
      z-index: 100;
    }
    > video,
    > img {
      width: 70px;
      height: 70px;
      max-width: 70px;
      max-height: 70px;
      object-fit: contain;
      object-position: center;
      border-radius: 6px;
    }

    > .bg {
      z-index: 0;
      width: 100%;
      height: 100%;
      background: url(../../assets/transparent_bg.png);
      background-position: center;
      background-size: 10px;
      image-rendering: pixelated;
      opacity: 0.5;
    }
  }

  > .title {
    grid-area: 1 / 2;
    font-size: 18px;
    white-space: nowrap;
    max-width: 500px;
    overflow: hidden;
    text-overflow: ellipsis;
    align-self: center;
  }
  > .state {
    grid-area: 2 / 2;
    font-size: 14px;
    display: grid;
    grid-template-columns: 100px 1fr auto;
    align-items: center;
    transition: opacity 0.25s;

    &:not(.show) {
      opacity: 0;
      pointer-events: none;
    }

    > .loading {
      font-size: 20px;
      color: #67c23a;
    }
  }

  > .oper {
    grid-area: 1 / 2 / -1 / 2;
    align-self: center;
    justify-self: flex-end;
    transition: opacity 0.25s;

    &:not(.show) {
      opacity: 0;
      pointer-events: none;
    }
  }
}
</style>
