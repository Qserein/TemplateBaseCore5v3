<script setup lang="ts">
import { computed, reactive, ref, toRef, watch } from 'vue'
import Fade from '../Ani/Fade.vue'
import SelectFile from './SelectFile.vue'
import FileList from './FileList.vue'
import { UploadState, UpLoadTask } from './UploadTask'

const props = withDefaults(
  defineProps<{
    inMessageBox?: { canClose: boolean; tasks?: UpLoadTask[]; files?: File[] }
    fold?: number
    files?: File[]
    multiple?: boolean
    accept?: string[]
    count?: number
    immediateUpload?: boolean
    immediateClose?: boolean
    selectOnly?: boolean
  }>(),
  {
    fold: 0,
    multiple: true,
    accept: () => [],
    count: 0,
    immediateUpload: false,
    immediateClose: false,
  }
)

const emit = defineEmits<{
  (type: 'finish', tasks: UpLoadTask[]): void
  (type: 'select', files: File[]): void
}>()

const canClose = props.inMessageBox ? toRef(props.inMessageBox, 'canClose') : ref(true)

const state = reactive({
  state: UploadState.None,
})

watch(toRef(state, 'state'), state => {
  canClose.value = state != UploadState.Uploading
})

const hideClose = computed(() => props.inMessageBox && !canClose.value && state.state != UploadState.Uploading)

const tab = ref(1)
const files = ref<File[]>([])

function onSelectFile(fs: File[]) {
  emit('select', fs)
  if (props.inMessageBox) props.inMessageBox.files = fs
  if (props.selectOnly) {
    close()
    return
  }
  files.value = fs
  tab.value = 2
  state.state = UploadState.None
}
if (props.files) onSelectFile(props.files)

function backSelect() {
  files.value = []
  tab.value = 1
  state.state = UploadState.None
}

const rootDom = ref<HTMLDivElement>()
function close() {
  const but = rootDom.value!.parentNode!.parentNode!.parentNode!.parentNode!.querySelector<HTMLButtonElement>('.el-message-box__header>.el-message-box__headerbtn')!
  but.click()
  setTimeout(() => {
    but.click()
  }, 0)
}
function onFinish(tasks: UpLoadTask[]) {
  if (props.immediateClose) close()
  if (props.inMessageBox) {
    props.inMessageBox.tasks = tasks
  }
  emit('finish', tasks)
}
</script>

<template>
  <div class="ui-fragment-upload grid" ref="rootDom">
    <Fade class="close" :show="hideClose!">
      <div class="box"><div class="box"></div></div>
    </Fade>
    <Fade :show="tab == 1">
      <SelectFile :multiple="multiple" :accept="accept" :count="count" @select="onSelectFile" />
    </Fade>
    <Fade :show="tab == 2">
      <FileList :fold="fold" :files="files" :state="state" :immediate-upload="immediateUpload" :immediate-close="immediateClose" @back="backSelect()" @finish="onFinish" @close="close()" />
    </Fade>
  </div>
</template>

<style lang="scss">
.ui-fragment-upload-dialog {
  width: 800px;
  overflow: hidden;
  padding: 0;
  border-radius: 6px;

  > .el-message-box__content {
    padding: 0;
  }
  > .el-message-box__btns {
    display: none;
  }
}
</style>
<style lang="scss" scoped>
.ui-fragment-upload {
  height: 400px;
  color: #606266;

  > * {
    grid-area: 1 / 1;
  }

  > .close {
    place-self: flex-start flex-end;

    > .box {
      > .box {
        display: grid;
        width: 0;
        height: 0;
        place-content: flex-end;

        > .box {
          width: 30px;
          height: 30px;
          position: relative;
          right: 10px;
          bottom: 5px;
          background: #fff;
        }
      }
    }
  }
}
</style>
