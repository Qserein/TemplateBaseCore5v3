<script setup lang="ts">
import { ASpace, AInput, AButton, ATreeSelect, ARadio, ARadioGroup, AInputNumber, ATextarea, ACheckbox } from '../../antd'
import { ElIcon, ElMessage, ElMessageBox, ElTable, ElTableColumn, ElPagination, ElSelect, ElOption, ElDialog, ElForm, ElFormItem, ElInput, ElDatePicker, ElUpload } from 'element-plus'
import { Search, Delete, Plus, Edit } from '@element-plus/icons'
import { nextTick, reactive, ref } from 'vue'
import { api, apost } from '../../api'
import type { UploadFile } from 'element-plus/lib/components/upload/src/upload.type'
import Quill from '../../common/Editor/Quill.vue'
import { ArticleItemViewModel, ArticlePostViewModel, ArticleViewModel, ELTreeViewModel } from '../../api/gen2/main/types/AdminSystem'

//#region 列表

/** 栏目 */
const menus = ref<ELTreeViewModel[]>([])

getMenuLevel()
/** 获取栏目下拉框 */
async function getMenuLevel() {
  const res = await api.main['/api/Admin/Article/GetMenuLevel'].get()
  if (res.success) {
    menus.value = res.data ?? []
  }
}

/** 查询参数 */
const query = ref({
  Title: '', // 标题
  State: '' as any as number, // 状态
  ArticleMenuID: [] as number[],
})

/** 分页 */
const page = reactive({
  pageIndex: 1, // 第几页
  pageSize: 15, // 页大小
  total: 0, // 总共几条
})

/** 数据 */
const list = ref<ArticleViewModel[]>([])

/** 重新查询 */
async function reQuery() {
  page.pageIndex = 1
  await doQuery()
}

doQuery()
/** 进行查询 */
async function doQuery() {
  const res = await api.main['/api/Admin/Article/List'].get({
    Title: query.value.Title,
    State: query.value.State,
    ArticleMenuID: JSON.stringify([...query.value.ArticleMenuID]),
    pageIndex: page.pageIndex,
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
const selected = ref<ArticleViewModel[]>([])
function selectionChange(rows: ArticleViewModel[]) {
  selected.value = rows
}

/** 将图片地址转成 css */
function picCss(v: string) {
  return `url(${JSON.stringify(v)})`
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

    const res = await api.main['/api/Admin/Article/SetState'].del(selected.value.map(i => i.ID))
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

function defaultModel(): ArticleItemViewModel {
  return {
    ID: 0,
    Title: '',
    Contents: '',
    ImgUrl: '',
    AddDate: '',
    FileUrl: '',
    Type: 1,
    Keyword: '',
    PageView: 0,
    IsTop: false,
    Sorting: 0,
    State: 2,
    Synopsis: '',
    Source: '',
    Author: '',
    FileSize: '',
    FileFormat: '',
    Articlemenumodel: [],
  }
}
const editRef = ref()
const editRules = {
  Title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  AddDate: [{ required: true, message: '请选择发布时间', trigger: 'blur' }],
}
const editItem = ref<ArticleItemViewModel>(defaultModel())
const editItemArticleMenuIDs = ref<number[]>([])
const showEdit = ref(false)
const isEdit = ref(true)
function openNew() {
  editItem.value = defaultModel()
  isEdit.value = false
  showEdit.value = true
  editItemArticleMenuIDs.value = []
}
async function openEdit(row: ArticleViewModel) {
  const res = await api.main['/api/Admin/Article/{ID}'].get({ ID: row.ID })
  if (res.success) {
    openNew()
    await nextTick()
    editItem.value = res.data
    editItemArticleMenuIDs.value = res.data.Articlemenumodel?.map(i => i.id) ?? []
    isEdit.value = true
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
  const data: ArticlePostViewModel = {
    ...editItem.value,
    ArticleMenuIDs: `,${editItemArticleMenuIDs.value.join(',')},`,
  }
  if (isEdit.value) {
    const res = await api.main['/api/Admin/Article/Update'].put(data)
    if (res.success) {
      closeEdit()
      ElMessage.success(res.msg || '修改成功')
      reQuery()
    } else {
      ElMessage.error(res.msg || '修改失败')
    }
  } else {
    const res = await api.main['/api/Admin/Article/Add'].post(data)
    if (res.success) {
      closeEdit()
      ElMessage.success(res.msg || '添加成功')
      reQuery()
    } else {
      ElMessage.error(res.msg || '添加失败')
    }
  }
}

/** 上传图片 */
async function uploadImg(file: UploadFile) {
  const type = file.name.substring(file.name.length - 3)
  if (type != 'png' && type != 'jpg' && type != 'jpeg' && type != 'bmp' && type != 'ico') return void ElMessage.error('请选择jpg png jpeg bmp ico格式的图片！')
  const formdata = new FormData()
  formdata.append('file', file as any, file.name)
  const res = await apost<any[]>('/api/Admin/Article/PostImage', formdata, void 0, { reqType: 'raw', nores: true })
  if (res[0].Status == 200) {
    editItem.value.ImgUrl = res[0].Data
    ElMessage.success('上传成功！')
  }
}

/** 文件上传   文件流 */
async function uploadFile(file: UploadFile) {
  const formdata = new FormData()
  formdata.append('file', file as any, file.name)
  const res = await apost<any[]>('/api/Admin/Article/Postfile', formdata, void 0, { reqType: 'raw', nores: true })
  if (res[0].Status == 200) {
    editItem.value.FileUrl = res[0].Data
    ElMessage.success('上传成功！')
  }
}

//#endregion

//#endregion
</script>

<template>
  <a-space class="app-top flex items-center">
    <a-tree-select
      style="width: 250px"
      v-model:value="query.ArticleMenuID"
      placeholder="栏目"
      :maxTagCount="1"
      :tree-data="menus"
      :replaceFields="{ key: 'id', value: 'id', title: 'label', children: 'children' }"
      tree-checkable
      allow-clear
      multiple
      tree-default-expand-all
      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
    ></a-tree-select>
    <el-select v-model="query.State" size="medium" placeholder="状态" clearable style="width: 100px">
      <el-option label="未审核" :value="1"></el-option>
      <el-option label="已审核" :value="2"></el-option>
      <el-option label="删除" :value="3"></el-option>
    </el-select>
    <a-input placeholder="名称" v-model:value="query.Title" allow-clear></a-input>
    <a-button type="primary" @click="reQuery()">
      <el-icon><search /></el-icon>
      <span>查询</span>
    </a-button>
  </a-space>

  <a-space class="app-tools">
    <a-button type="primary" class="success" size="small" @click="openNew()">
      <el-icon><plus /></el-icon>
      <span>添加</span>
    </a-button>
    <a-button type="primary" class="red" danger size="small" @click="batchDel()">
      <el-icon><delete /></el-icon>
      <span>删除</span>
    </a-button>
  </a-space>

  <el-table class="app-table" ref="tableRef" :data="list" row-key="ID" highlight-current-row tooltip-effect="dark" header-cell-class-name="app-table-header" border height="100%" @selection-change="selectionChange">
    <el-table-column align="center" type="selection" width="40" :reserve-selection="true" fixed></el-table-column>
    <el-table-column label="序号" align="center" type="index" width="60" fixed :index="comIndex"></el-table-column>
    <el-table-column label="标题" align="center" prop="Title"></el-table-column>
    <el-table-column label="栏目" align="center" prop="ArticleMenu">
      <template v-slot="{ row: { ArticleMenu } }">
        <span>{{ArticleMenu.map((i: any) => i.Names).join(', ')}}</span>
      </template>
    </el-table-column>
    <el-table-column label="图片" align="center" prop="ImgUrl" width="80">
      <template v-slot="{ row: { ImgUrl } }">
        <div v-if="ImgUrl" class="grid" style="width: 56px; height: 56px; border: 1px solid #ccc; border-radius: 4px; padding: 2px">
          <div style="border-radius: 3px; background-size: cover; background-position: center" :style="{ backgroundImage: picCss(ImgUrl) }"></div>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="文件" align="center" prop="FileUrl" width="80">
      <template v-slot="{ row: { FileUrl } }">
        <a v-if="FileUrl" :href="FileUrl" target="_blank">下载</a>
      </template>
    </el-table-column>
    <el-table-column label="访问量" align="center" prop="PageView" width="70"></el-table-column>
    <el-table-column label="状态" align="center" prop="State" width="70">
      <template v-slot="{ row: { State } }">
        <span v-if="State == 1" style="color: darkorange">未审核</span>
        <span v-else-if="State == 2" style="color: green">已审核</span>
        <span v-else-if="State == 3" style="color: red">已删除</span>
        <span v-else>未知 {{ State }}</span>
      </template>
    </el-table-column>
    <el-table-column label="日期" align="center" prop="AddDate" width="150"></el-table-column>
    <el-table-column label="操作" align="center" width="50">
      <template v-slot="{ row }">
        <el-icon class="cursor-pointer" @click="openEdit(row)"><edit /></el-icon>
      </template>
    </el-table-column>
  </el-table>

  <div class="app-foot flex justify-center">
    <el-pagination background layout="total, prev, pager, next, jumper" :page-size="page.pageSize" :total="page.total" v-model:current-page="page.pageIndex" @current-change="doQuery()"></el-pagination>
  </div>

  <el-dialog :title="isEdit ? '编辑' : '添加'" v-model="showEdit" width="1200px" top="5vh">
    <el-form ref="editRef" :model="editItem" :rules="editRules" label-width="100px">
      <div class="px-5 grid grid-cols-3 gap-x-10">
        <el-form-item label="标题：" prop="Title" class="col-span-full">
          <el-input v-model="editItem.Title" size="medium"></el-input>
        </el-form-item>
        <div class="col-span-full grid grid-cols-2 gap-x-10">
          <el-form-item label="关键词：" prop="Keyword">
            <el-input v-model="editItem.Keyword" size="medium"></el-input>
          </el-form-item>
          <el-form-item label="图片上传：" prop="ImgUrl">
            <div class="upload flex gap-2 items-center">
              <el-input v-model="editItem.ImgUrl" autocomplete="off" style="width: 100%" placeholder="点击上传图片" size="medium"></el-input>
              <el-upload action="" class="upload-demo" :before-upload="uploadImg" :limit="1" :show-file-list="false">
                <a-button type="primary" style="margin: 0">点击上传</a-button>
              </el-upload>
            </div>
          </el-form-item>
        </div>
        <div class="col-span-full grid grid-cols-2 gap-x-10">
          <el-form-item label="栏目：">
            <a-tree-select
              style="width: 100%"
              v-model:value="editItemArticleMenuIDs"
              placeholder="请选择"
              :maxTagCount="3"
              :tree-data="menus"
              :replaceFields="{ key: 'id', value: 'id', title: 'label', children: 'children' }"
              tree-checkable
              allow-clear
              multiple
              tree-default-expand-all
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            ></a-tree-select>
          </el-form-item>
          <el-form-item label="文件上传：" prop="FileUrl">
            <div class="upload flex gap-2 items-center">
              <el-input v-model="editItem.FileUrl" autocomplete="off" style="width: 100%" placeholder="点击上传文件" size="medium"></el-input>
              <el-upload action="" class="upload-demo" :before-upload="uploadFile" :limit="1" :show-file-list="false">
                <a-button type="primary" style="margin: 0">点击上传</a-button>
              </el-upload>
            </div>
          </el-form-item>
        </div>
        <div class="col-span-full grid grid-cols-2 gap-x-10">
          <div class="flex">
            <el-form-item label="置顶：" prop="IsTop">
              <a-checkbox v-model:checked="editItem.IsTop">启用</a-checkbox>
            </el-form-item>
            <el-form-item label="顺序：" prop="Sorting" class="flex-1">
              <a-input-number v-model:value="editItem.Sorting"></a-input-number>
            </el-form-item>
          </div>
          <el-form-item label="资源类型：" prop="Type">
            <a-radio-group v-model:value="editItem.Type">
              <a-radio :value="1">文字</a-radio>
              <a-radio :value="2">图片</a-radio>
              <a-radio :value="3">视频</a-radio>
              <a-radio :value="4">音频</a-radio>
              <a-radio :value="5">软件</a-radio>
            </a-radio-group>
          </el-form-item>
        </div>
        <div class="col-span-full grid grid-cols-2 gap-x-10">
          <el-form-item label="发布时间：" prop="AddDate">
            <el-date-picker v-model="editItem.AddDate" type="date" placeholder="发布日期" style="width: 100%" value-format="YYYY-MM-DD" size="medium"></el-date-picker>
          </el-form-item>
          <el-form-item label="状态：" prop="State">
            <a-radio-group v-model:value="editItem.State">
              <a-radio :value="1">未审核</a-radio>
              <a-radio :value="2">已审核</a-radio>
              <a-radio :value="3">已删除</a-radio>
            </a-radio-group>
          </el-form-item>
        </div>
        <el-form-item label="简介：" class="col-span-full">
          <a-textarea v-model:value="editItem.Synopsis" :auto-size="{ minRows: 3, maxRows: 6 }"></a-textarea>
        </el-form-item>
        <el-form-item label="文章内容：" class="col-span-full">
          <Quill placeholder="在此输入文章内容" v-model:value="editItem.Contents"></Quill>
        </el-form-item>
        <el-form-item label="文章来源：">
          <el-input v-model="editItem.Source" size="medium"></el-input>
        </el-form-item>
        <el-form-item label="访问量：">
          <el-input v-model="editItem.PageView" size="medium"></el-input>
        </el-form-item>
        <el-form-item label="作者：">
          <el-input v-model="editItem.Author" size="medium"></el-input>
        </el-form-item>
      </div>
    </el-form>

    <template #footer>
      <div class="flex justify-center items-center">
        <a-space>
          <a-button type="primary" :class="{ success: !isEdit }" @click="saveEdit()">{{ isEdit ? '修改' : '添加' }}</a-button>
          <a-button @click="closeEdit()">取消</a-button>
        </a-space>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss"></style>
