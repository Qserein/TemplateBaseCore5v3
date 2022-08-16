<script setup lang="ts">
import { guard, identity, Yield } from 'libsugar/fn'
import { computed, reactive, toRef } from 'vue'
import { AButton } from '../../antd'
import { UpLoadTask, UploadState, getFileType, UploadTaskOper, getWH } from './UploadTask'
import FileItem from './FileItem.vue'
import Fade from '../Ani/Fade.vue'
import { Seq, seq } from 'libsugar/seq'
import ProgressBar from './ProgressBar.vue'
import { noNaN, unid } from '../../utils'
import { apatch, ApiResult, apost, aput, buildFormData } from '../../api'
import { ElMessage } from 'element-plus'

const nolog = false

const props = withDefaults(
  defineProps<{
    fold: number
    files: File[]
    immediateUpload?: boolean
    immediateClose?: boolean
    state: { state: UploadState }
  }>(),
  {
    immediateUpload: false,
    immediateClose: false,
  }
)

const emit = defineEmits<{
  (type: 'back'): void
  (type: 'finish', tasks: UpLoadTask[]): void
  (type: 'close'): void
}>()

const tasks = reactive(
  props.files.map(file =>
    guard<UpLoadTask>({
      id: unid(),
      file,
      chunk: {
        finish: 0,
        total: 0,
        size: 0,
      },
      state: UploadState.None,
    })
  )
)
const state = toRef(props.state, 'state')

function removeTask(i: number) {
  tasks.splice(i, 1)
  if (tasks.length == 0) emit('back')
}
function cancelUpload() {
  emit('back')
}
function closeUpload() {
  emit('close')
}

const totalFinish = computed(() =>
  seq(tasks)
    .filter(t => t.state == UploadState.Finish)
    .count()
)
const totalChunkFinish = computed(
  () =>
    seq(tasks)
      .map(t => t.chunk.finish)
      .sum() || 0
)
const totalChunks = computed(
  () =>
    seq(tasks)
      .map(t => t.chunk.total)
      .sum() || 0
)
const progress = computed(() => noNaN(totalChunkFinish.value / totalChunks.value))

/** 开始上传 */
async function startUpload() {
  state.value = UploadState.Uploading
  await Promise.all(tasks.map(uploadTask))
  state.value = UploadState.Finish
  emit('finish', tasks)
}
async function uploadTask(o: UpLoadTask) {
  const file = o.file
  const dotSplit = file.name.split('.')
  const type = getFileType(file)
  const { Width, Height } = await getWH(file, type)
  const task = await apost<
    ApiResult<{
      TaskID: string
      ChunkSize: number
      Url: string
      ID: number
    }>
  >(
    '/api/Upload/Fragment',
    buildFormData({
      Oper: UploadTaskOper.Create,
      FoldID: props.fold,
      ExtName: dotSplit.length > 1 ? dotSplit.pop() : void 0,
      FileName: file.name,
      Type: type,
      FileSize: file.size,
      ContentType: file.type,
      Width,
      Height,
    }),
    void 0,
    { reqType: 'raw', nolog }
  )
  if (!task.success) {
    if (task.msg) ElMessage.error(task.msg)
    o.state = UploadState.Failed
    return
  }
  o.state = UploadState.Uploading
  const { TaskID, ChunkSize, Url, ID } = task.data
  o.url = Url
  o.fileID = ID
  o.chunk.size = ChunkSize
  const chunks = (o.chunk.total = Math.ceil(file.size / ChunkSize))
  const chunkResults: boolean[] = []
  for (const i of Seq.range(0, chunks)) {
    const ChunkLength = i != chunks - 1 ? ChunkSize : file.size - (chunks - 1) * ChunkSize
    const chunk = file.slice(i * ChunkSize, i * ChunkSize + ChunkLength)
    let retry = 127
    async function doReq(): Promise<boolean> {
      if (o.state == UploadState.Failed) return false
      if (retry < 0) {
        o.state = UploadState.Failed
        return false
      }
      retry--
      const r = await apost<ApiResult<{ Finish: boolean }>>(
        '/api/Upload/Fragment',
        buildFormData({
          Oper: UploadTaskOper.Upload,
          ID,
          TaskID,
          Number: i,
          Chunk: chunk,
        }),
        void 0,
        { reqType: 'raw', nolog }
      )
      if (!r.success && r.msg != '不能重复上传分片') return doReq()
      o.chunk.finish++
      return r.data.Finish
    }
    chunkResults.push(await doReq())
    await Yield()
  }
  if (seq(chunkResults).any(identity)) {
    o.state = UploadState.Finish
  } else {
    o.state = UploadState.Failed
  }
}

const uploadingTasks = computed(() => tasks.filter(t => t.state == UploadState.Uploading))
const failedTasks = computed(() => tasks.filter(t => t.state == UploadState.Failed))
const otherTasks = computed(() => tasks.filter(t => t.state != UploadState.Uploading && t.state != UploadState.Failed))
const sortedTasks = computed(() => [...uploadingTasks.value, ...failedTasks.value, ...otherTasks.value])

if (props.immediateUpload) {
  startUpload()
}
</script>

<template>
  <div class="file-list grid">
    <div class="top grid">
      <Fade class="info" :show="state == UploadState.None">
        <span>已选 {{ tasks.length }} 个文件</span>
      </Fade>
      <Fade class="oper" :show="state == UploadState.None">
        <div class="box">
          <a-button @click="cancelUpload()">取消</a-button>
          <a-button type="primary" @click="startUpload()">开始上传</a-button>
        </div>
      </Fade>
      <Fade class="info" :show="state == UploadState.Uploading">
        <span>上传中 {{ totalFinish }} / {{ tasks.length }}</span>
      </Fade>
      <Fade class="bar" :show="state == UploadState.Uploading">
        <ProgressBar :progress="progress" />
      </Fade>
      <Fade class="info" :show="state == UploadState.Finish">
        <span>已完成</span>
      </Fade>
      <Fade class="oper" :show="state == UploadState.Finish">
        <div class="box">
          <a-button @click="cancelUpload()" v-if="!immediateClose">继续上传</a-button>
          <a-button type="primary" @click="closeUpload()">关闭</a-button>
        </div>
      </Fade>
    </div>
    <div class="the-list flex flex-col">
      <transition-group name="file-list-item" v-if="tasks.length < 50">
        <div class="file-list-item" v-for="(task, i) in sortedTasks" :key="task.id">
          <FileItem :task="task" :state="state" @remove="removeTask(i)" />
        </div>
      </transition-group>
      <template v-else>
        <div class="file-list-item" v-for="(task, i) in sortedTasks" :key="task.id">
          <FileItem :task="task" :state="state" @remove="removeTask(i)" />
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.file-list {
  height: 400px;
  grid-template-columns: 1fr;
  grid-template-rows: 70px 1fr;
  overflow: hidden;

  > .top {
    gap: 15px;
    grid-template-columns: minmax(100px, auto) 1fr;
    grid-template-rows: 1fr;
    padding: 15px;
    align-items: center;

    > .info {
      grid-area: 1 / 1;
      display: flex;
      align-items: center;
    }
    > .bar,
    > .oper {
      grid-area: 1 / 2;
    }
    > .oper {
      > .box {
        > .box {
          display: flex;
          gap: 15px;
          justify-content: flex-end;
        }
      }
    }
  }
  > .the-list {
    padding: 0 15px;
    padding-bottom: 15px;
    gap: 15px;
    height: 100%;
    overflow: auto;

    .file-list-item {
      min-height: 70px;
      transition: all 0.25s;
      overflow: hidden;
    }

    .file-list-item-enter-from,
    .file-list-item-leave-to {
      opacity: 0;
      min-height: 0;
    }
  }
}
</style>
