<script setup lang="ts">
import { ASpace, AInput, AButton, AForm, AFormItem } from '../../antd'
import { ElIcon, ElMessage, ElTable, ElTableColumn, ElPagination, ElDialog } from 'element-plus'
import { Search, Plus, Edit } from '@element-plus/icons'
import { reactive, ref } from 'vue'
import { Config } from '../../api/gen2/main/types/AdminSystem'
import { api } from '../../api'

//#region 列表

/** 查询参数 */
const query = ref({
  Title: '', // 标题
})

/** 分页 */
const page = reactive({
  pageIndex: 1, // 第几页
  pageSize: 15, // 页大小
  total: 0, // 总共几条
})

/** 数据 */
const list = ref<Config[]>([])

/** 重新查询 */
async function reQuery() {
  page.pageIndex = 1
  await doQuery()
}

doQuery()
/** 进行查询 */
async function doQuery() {
  const res = await api.main['/api/Admin/Config/List'].get({
    Title: query.value.Title,
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
const selected = ref<Config[]>([])
function selectionChange(rows: Config[]) {
  selected.value = rows
}

//#endregion

//#region 业务

function defaultModel(): Config {
  return {
    ID: 0,
    Title: '',
    Number: '',
    Value: '',
  }
}
const editRef = ref()
const editRules = {
  Title: [{ required: true, message: '请输入标题', trigger: 'change' }],
  Number: [{ required: true, message: '请输入编号', trigger: 'change' }],
  Value: [{ required: true, message: '请输入值', trigger: 'change' }],
}
const editItem = ref<Config>(defaultModel())
const showEdit = ref(false)
const isEdit = ref(true)
function openNew() {
  editItem.value = defaultModel()
  isEdit.value = false
  showEdit.value = true
}
async function openEdit(row: Config) {
  const res = await api.main['/api/Admin/Config/ID'].get({ id: row.ID })
  if (res.success) {
    editItem.value = res.data
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
  const data = {
    ...editItem.value,
  }
  if (isEdit.value) {
    const res = await api.main['/api/Admin/Config'].put(data)
    if (res.success) {
      closeEdit()
      ElMessage.success(res.msg || '修改成功')
      reQuery()
    } else {
      ElMessage.error(res.msg || '修改失败')
    }
  } else {
    const res = await api.main['/api/Admin/Config'].post(data)
    if (res.success) {
      closeEdit()
      ElMessage.success(res.msg || '添加成功')
      reQuery()
    } else {
      ElMessage.error(res.msg || '添加失败')
    }
  }
}

//#endregion
</script>

<template>
  <a-space class="app-top flex items-center">
    <a-input placeholder="标题" v-model:value="query.Title" allow-clear></a-input>
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
  </a-space>

  <el-table class="app-table" ref="tableRef" :data="list" row-key="ID" highlight-current-row tooltip-effect="dark" header-cell-class-name="app-table-header" border height="100%" @selection-change="selectionChange">
    <!-- <el-table-column align="center" type="selection" width="40" :reserve-selection="true" fixed></el-table-column> -->
    <el-table-column label="序号" align="center" type="index" width="60" fixed :index="comIndex"></el-table-column>
    <el-table-column label="名称" align="center" prop="Title" width="300"></el-table-column>
    <el-table-column label="编号" align="center" prop="Number" width="300"></el-table-column>
    <el-table-column label="值" align="center" prop="Value"></el-table-column>
    <el-table-column label="操作" align="center" width="80">
      <template v-slot="{ row }">
        <el-icon class="cursor-pointer" @click="openEdit(row)"><edit /></el-icon>
      </template>
    </el-table-column>
  </el-table>

  <div class="app-foot flex justify-center">
    <el-pagination background layout="total, prev, pager, next, jumper" :page-size="page.pageSize" :total="page.total" v-model:current-page="page.pageIndex" @current-change="doQuery()"></el-pagination>
  </div>

  <el-dialog :custom-class="$style['el-dialog']" :title="isEdit ? '编辑' : '添加'" v-model="showEdit" width="600px">
    <a-form ref="editRef" :model="editItem" :label-col="{ span: 3 }" :rules="editRules">
      <a-form-item label="名称" has-feedback name="Title">
        <a-input v-model:value="editItem.Title"></a-input>
      </a-form-item>
      <a-form-item label="编号" has-feedback name="Number">
        <a-input v-model:value="editItem.Number"></a-input>
      </a-form-item>
      <a-form-item label="值" has-feedback name="Value">
        <a-input v-model:value="editItem.Value"></a-input>
      </a-form-item>
    </a-form>

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

<style lang="scss" module>
.el-dialog {
  min-width: 600px;
}
</style>
