<script setup lang="ts">
import { ASpace, AInput, AButton, AForm, AFormItem, AInputNumber, ATextarea, ASwitch } from '../../antd'
import { ElIcon, ElMessage, ElTable, ElTableColumn, ElPagination, ElDialog, ElSelect, ElOption, ElMessageBox, ElForm, ElFormItem, ElInput } from 'element-plus'
import { Search, Plus, Edit, Delete, Download } from '@element-plus/icons'
import { nextTick, reactive, ref } from 'vue'
import api from '../../api'
import IconFile from '../../common/FragmentUpload/Icons/IconFile.vue'
import IconFileZip from '../../common/FragmentUpload/Icons/IconFileZip.vue'
import IconFileTxt from '../../common/FragmentUpload/Icons/IconFileTxt.vue'
import IconFileExe from '../../common/FragmentUpload/Icons/IconFileExe.vue'
import { calcByteSize } from '../../utils'
import { FileAssetListEditViewModel, FileAssetListViewModel, FileAssetType } from '../../api/gen/main/types/AdminSystem'

//#region 列表

/** 查询参数 */
const query = ref({
  Name: '', // 名称
  Type: void 0 as FileAssetType | undefined,
  IsEnable: true as boolean | undefined,
})

/** 分页 */
const page = reactive({
  pageIndex: 1, // 第几页
  pageSize: 15, // 页大小
  total: 0, // 总共几条
})

/** 数据 */
const list = ref<FileAssetListViewModel[]>([])

/** 重新查询 */
async function reQuery() {
  page.pageIndex = 1
  await doQuery()
}

doQuery()
/** 进行查询 */
async function doQuery() {
  const res = await api.main['/api/FileAsset'].get({
    Name: query.value.Name,
    Type: query.value.Type,
    IsEnable: query.value.IsEnable,
    PageIndex: page.pageIndex,
    PageSize: page.pageSize,
  })
  if (res.success) {
    page.pageSize = res.size
    page.total = res.count
    list.value = res.data ?? []
  } else {
    ElMessage.error(res.msg || '获取失败')
  }
}

/** 计算当前行是第几条 */
function comIndex(index: number) {
  return (page.pageIndex - 1) * page.pageSize + index + 1
}

/** 表格的 ref */
const tableRef = ref<{ clearSelection(): void }>()

/** 当前选中的项 */
const selected = ref<FileAssetListViewModel[]>([])
function selectionChange(rows: FileAssetListViewModel[]) {
  selected.value = rows
}

//#endregion

//#region 业务

/** 批量删除 */
async function batchDel() {
  if (selected.value.length == 0) return void ElMessage.warning('请先选择数据！')
  try {
    await ElMessageBox.confirm('是否删除选中数据？', '提示', {
      cancelButtonText: '取消',
      confirmButtonText: '确认',
    })
    const res = await api.main['/api/FileAsset'].del(selected.value.map(i => i.ID))
    if (res.success) {
      reQuery()
      ElMessage.success(res.msg || '删除成功！')
      selected.value = []
      tableRef.value?.clearSelection()
    } else {
      ElMessage.error(res.msg || '删除失败')
    }
  } catch {
    ElMessage.info('已取消删除')
  }
}

//#region 新增编辑

function defaultModel(): FileAssetListEditViewModel {
  return {
    ID: 0,
    IsEnable: true,
    TypeID: FileAssetType.File,
    UserID: 0,
  }
}
const editRef = ref()
const editRules = {
  Name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
}
const editItem = ref<FileAssetListEditViewModel>(defaultModel())
const editItemArticleMenuIDs = ref<number[]>([])
const showEdit = ref(false)
function openNew() {
  editItem.value = defaultModel()
  showEdit.value = true
  editItemArticleMenuIDs.value = []
}
async function openEdit(ID: number) {
  const res = await api.main['/api/FileAsset/{ID}'].get({ ID })
  if (res.success) {
    openNew()
    await nextTick()
    editItem.value = res.data
    showEdit.value = true
  } else {
    ElMessage.error(res.msg || '获取详情失败')
  }
}
function closeEdit() {
  showEdit.value = false
  editRef.value.clearValidate()
}
async function saveEdit() {
  try {
    await editRef.value.validate()
  } catch {
    return
  }
  const data: FileAssetListEditViewModel = {
    ...editItem.value,
  }
  const res = await api.main['/api/FileAsset'].put(data)
  if (res.success) {
    closeEdit()
    ElMessage.success(res.msg || '修改成功')
    reQuery()
  } else {
    ElMessage.error(res.msg || '修改失败')
  }
}

//#endregion

//#endregion
</script>

<template>
  <a-space class="app-top flex items-center">
    <el-select placeholder="类型" style="width: 100px" v-model="query.Type" clearable size="medium">
      <el-option label="图片" :value="FileAssetType.Image" />
      <el-option label="视频" :value="FileAssetType.Video" />
      <el-option label="音频" :value="FileAssetType.Audio" />
      <el-option label="文本" :value="FileAssetType.Text" />
      <el-option label="压缩包" :value="FileAssetType.Zip" />
      <el-option label="可执行" :value="FileAssetType.Exe" />
      <el-option label="其他" :value="FileAssetType.File" />
    </el-select>
    <a-input placeholder="名称" v-model:value="query.Name" allow-clear></a-input>
    <el-select placeholder="状态" style="width: 100px" v-model="query.IsEnable" clearable size="medium">
      <el-option label="启用" :value="true" />
      <el-option label="禁用" :value="false" />
    </el-select>
    <a-button type="primary" @click="reQuery()">
      <el-icon><search /></el-icon>
      <span>查询</span>
    </a-button>
  </a-space>

  <a-space class="app-tools">
    <a-button type="primary" class="red" danger size="small" @click="batchDel()">
      <el-icon><delete /></el-icon>
      <span>删除</span>
    </a-button>
  </a-space>

  <el-table class="app-table" ref="tableRef" :data="list" row-key="ID" highlight-current-row tooltip-effect="dark" header-cell-class-name="app-table-header" border height="100%" @selection-change="selectionChange">
    <el-table-column align="center" type="selection" width="40" :reserve-selection="true" fixed></el-table-column>
    <el-table-column label="序号" align="center" type="index" width="60" fixed :index="comIndex"></el-table-column>
    <el-table-column label="名称" align="center" prop="Name" min-width="300px"></el-table-column>
    <el-table-column label="内容" align="center" prop="Url" width="80" v-slot="{ row: { TypeID, Url } }">
      <div class="list-cover">
        <div class="bg" v-if="TypeID == FileAssetType.Image || TypeID == FileAssetType.Video"></div>
        <div class="icon" v-if="TypeID == FileAssetType.Exe"><IconFileExe /></div>
        <div class="icon" v-else-if="TypeID == FileAssetType.Zip"><IconFileZip /></div>
        <div class="icon" v-else-if="TypeID == FileAssetType.Text"><IconFileTxt /></div>
        <video v-else-if="TypeID == FileAssetType.Video" :src="Url" muted autoplay loop />
        <img v-else-if="TypeID == FileAssetType.Image" :src="Url" />
        <div v-else class="icon"><IconFile /></div>
      </div>
    </el-table-column>
    <el-table-column label="类型" align="center" prop="TypeID" width="80" v-slot="{ row: { TypeID } }">
      <span v-if="TypeID == FileAssetType.Image">图片</span>
      <span v-else-if="TypeID == FileAssetType.Video">视频</span>
      <span v-else-if="TypeID == FileAssetType.Audio">音频</span>
      <span v-else-if="TypeID == FileAssetType.Text">文本</span>
      <span v-else-if="TypeID == FileAssetType.Zip">压缩包</span>
      <span v-else-if="TypeID == FileAssetType.Exe">可执行</span>
      <span v-else>其他</span>
    </el-table-column>
    <el-table-column label="大小 (字节)" align="center" max-width="300px" prop="Size" v-slot="{ row: { Size } }">
      <span :title="`${Size} 字节`">{{ calcByteSize(Size) }}</span>
    </el-table-column>
    <el-table-column label="宽高 (像素)" align="center" max-width="300px" v-slot="{ row: { TypeID, Width, Height } }">
      <span v-if="TypeID == FileAssetType.Image || TypeID == FileAssetType.Video">{{ Width }} : {{ Height }}</span>
      <span v-else>-</span>
    </el-table-column>
    <el-table-column label="上传人" align="center" width="120" prop="User"></el-table-column>
    <el-table-column label="创建日期 / 上传日期" align="center" width="150" prop="AddDate" v-slot="{ row: { AddDate, UploadedDate } }">
      <div>
        <div>{{ AddDate }}</div>
        <div>{{ UploadedDate }}</div>
      </div>
    </el-table-column>
    <el-table-column label="状态" align="center" width="80" prop="IsEnable" v-slot="{ row: { IsEnable } }">
      <span v-if="IsEnable" style="color: green">启用</span>
      <span v-else style="color: red">禁用</span>
    </el-table-column>
    <el-table-column label="操作" align="center" width="80" v-slot="{ row: { ID, Url, Name } }">
      <div class="flex gap-10px justify-center items-center">
        <a :href="Url" target="_blank" :download="Name" class="flex items-center">
          <el-icon class="cursor-pointer"><download /></el-icon>
        </a>
        <el-icon @click="openEdit(ID)" class="cursor-pointer"><edit /></el-icon>
      </div>
    </el-table-column>
  </el-table>

  <div class="app-foot flex justify-center">
    <el-pagination background layout="total, prev, pager, next, jumper" :page-size="page.pageSize" :total="page.total" v-model:current-page="page.pageIndex" @current-change="doQuery()"></el-pagination>
  </div>

  <el-dialog title="编辑" v-model="showEdit" width="600px">
    <div class="pr-50px">
      <el-form ref="editRef" :model="editItem" :rules="editRules" label-width="100px">
        <el-form-item label="名称：" prop="Name">
          <el-input v-model="editItem.Name" size="medium"></el-input>
        </el-form-item>
        <el-form-item label="类型：" prop="TypeID">
          <el-select class="w-full" placeholder="类型" v-model="editItem.TypeID" clearable size="medium">
            <el-option label="图片" :value="FileAssetType.Image" />
            <el-option label="视频" :value="FileAssetType.Video" />
            <el-option label="音频" :value="FileAssetType.Audio" />
            <el-option label="文本" :value="FileAssetType.Text" />
            <el-option label="压缩包" :value="FileAssetType.Zip" />
            <el-option label="可执行" :value="FileAssetType.Exe" />
            <el-option label="其他" :value="FileAssetType.File" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态：" prop="IsEnable">
          <a-switch class="app-state" v-model:checked="editItem.IsEnable" checked-children="启用" un-checked-children="禁用" />
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <div class="flex justify-center items-center">
        <a-space>
          <a-button type="primary" @click="saveEdit()">修改</a-button>
          <a-button @click="closeEdit()">取消</a-button>
        </a-space>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.list-cover {
  grid-area: 1 / 1 / -1 / 1;
  width: 60px;
  height: 60px;
  font-size: 50px;
  border: 1px solid #ccc;
  border-radius: 6px;
  display: grid;
  overflow: hidden;
  background: #fff;

  > * {
    grid-area: 1 / 1;
    place-self: center;
    z-index: 100;
  }
  > video,
  > img {
    width: 60px;
    height: 60px;
    max-width: 60px;
    max-height: 60px;
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
</style>
