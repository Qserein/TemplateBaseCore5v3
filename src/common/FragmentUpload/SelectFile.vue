<script setup lang="ts">
import { ref } from 'vue'
import IconUpload from '../../Icons/IconUpload.vue'

const props = withDefaults(
  defineProps<{
    multiple?: boolean
    accept?: string[]
    count?: number
  }>(),
  {
    multiple: true,
    accept: () => [],
    count: 0,
  }
)

const emit = defineEmits<{
  (type: 'select', files: File[]): void
}>()

const uploadDraging = ref(false)
function onDragEnter(e: DragEvent) {
  uploadDraging.value = true
}
function onDragLeave(e: DragEvent) {
  uploadDraging.value = false
}
function onDrop(e: DragEvent) {
  uploadDraging.value = false
  e.preventDefault()
  const files = e.dataTransfer?.files
  if (files == null) return
  uploadFile(Array.from(files))
}
function onUploadFile(e: Event) {
  const target = e.target as HTMLInputElement
  const files = target.files
  if (files == null) return
  const fileArr = Array.from(files!)
  target.value = null!
  uploadFile(fileArr)
}
function uploadFile(files: File[]) {
  if (props.count > 0) files = files.slice(0, props.count)
  emit('select', files)
}
</script>

<template>
  <div class="select-file grid" :class="{ drag: uploadDraging }" @drop="onDrop" @dragenter="onDragEnter" @dragleave="onDragLeave">
    <div class="box flex flex-col items-center">
      <div class="icon"><IconUpload /></div>
      <div class="label">点击或拖入上传</div>
      <div class="tips"><slot name="tips"></slot></div>
    </div>
    <input class="input" type="file" :multiple="multiple" :accept="accept.join(',')" @change="onUploadFile" />
  </div>
</template>

<style lang="scss" scoped>
.select-file {
  margin: 15px;
  cursor: pointer;
  border: 1px solid #dcdfe6;
  border-radius: 9px;
  transition: color 0.25s, border 0.25s, background 0.25s, filter 0.25s, opacity 0.25s;

  > * {
    grid-area: 1 / 1;
  }

  > .box {
    place-self: center;
    transition: transform 0.25s;

    > .icon {
      font-size: 100px;
      opacity: 0.5;
      transition: opacity 0.25s;
    }

    > .label {
      font-size: 20px;
    }

    > .tips {
      font-size: 14px;
      opacity: 0.75;

      &:not(:empty) {
        margin-top: 9px;
      }
    }
  }

  > .input {
    width: 100%;
    height: 100%;
    z-index: 100;
    opacity: 0;
    cursor: pointer;
  }

  &.drag,
  &:hover {
    color: #409eff;
    border-color: #40a0ff77;
    filter: drop-shadow(0 0 25px #409eff);
    > .box {
      transform: scale(1.05);
      > .icon {
        opacity: 0.75;
      }
    }
  }
}
</style>
