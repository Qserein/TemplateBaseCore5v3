<script setup lang="ts">
import { ASpace, AInput, AButton, AForm, AFormItem, AInputNumber, ATextarea } from '../../antd'
import { ElIcon, ElMessage, ElTable, ElTableColumn, ElPagination, ElDialog } from 'element-plus'
import { Search, Plus, Edit } from '@element-plus/icons'
import { reactive, ref } from 'vue'
import { api } from '../../api'
import { AdvertType } from '../../api/gen2/main/types/AdminSystem'

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
const list = ref<AdvertType[]>([])

/** 重新查询 */
async function reQuery() {
  page.pageIndex = 1
  await doQuery()
}

doQuery()
/** 进行查询 */
async function doQuery() {
  const res = await api.main['/api/Admin/AdvertType'].get({
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
const selected = ref<AdvertType[]>([])
function selectionChange(rows: AdvertType[]) {
  selected.value = rows
}

//#endregion

//#region 业务

function defaultModel(): AdvertType {
  return {
    ID: 0,
    Names: '',
    Sorting: 0,
    Remark: '',
  }
}
const editRef = ref()
const editRules = {
  Names: [{ required: true, message: '名称不能为空', trigger: 'change' }],
}
const editItem = ref<AdvertType>(defaultModel())
const showEdit = ref(false)
const isEdit = ref(true)
function openNew() {
  editItem.value = defaultModel()
  isEdit.value = false
  showEdit.value = true
}
async function openEdit(row: AdvertType) {
  const res = await api.main['/api/Admin/AdvertType/{ID}'].get({ ID: row.ID })
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
    const res = await api.main['/api/Admin/AdvertType'].put(data)
    if (res.success) {
      closeEdit()
      ElMessage.success(res.msg || '修改成功')
      reQuery()
    } else {
      ElMessage.error(res.msg || '修改失败')
    }
  } else {
    const res = await api.main['/api/Admin/AdvertType'].post(data)
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
  </a-space>

  <el-table class="app-table" ref="tableRef" :data="list" row-key="ID" highlight-current-row tooltip-effect="dark" header-cell-class-name="app-table-header" border height="100%" @selection-change="selectionChange">
    <el-table-column align="center" type="selection" width="40" :reserve-selection="true" fixed></el-table-column>
    <el-table-column label="序号" align="center" type="index" width="60" fixed :index="comIndex"></el-table-column>
    <el-table-column label="名称" align="center" prop="Names"></el-table-column>
    <el-table-column label="备注" align="center" prop="Remark"></el-table-column>
    <el-table-column label="顺序" align="center" prop="Sorting" width="80"></el-table-column>
    <el-table-column label="操作" align="center" width="80">
      <template v-slot="{ row }">
        <el-icon class="cursor-pointer" @click="openEdit(row)"><edit /></el-icon>
      </template>
    </el-table-column>
  </el-table>

  <div class="app-foot flex justify-center">
    <el-pagination background layout="total, prev, pager, next, jumper" :page-size="page.pageSize" :total="page.total" v-model:current-page="page.pageIndex" @current-change="doQuery()"></el-pagination>
  </div>

  <el-dialog :title="isEdit ? '编辑' : '添加'" v-model="showEdit" width="800px">
    <a-form ref="editRef" :model="editItem" :label-col="{ span: 2 }" :rules="editRules">
      <a-form-item label="名称" has-feedback name="Names">
        <a-input v-model:value="editItem.Names"></a-input>
      </a-form-item>
      <a-form-item label="编号" has-feedback name="Sorting">
        <a-input-number v-model:value="editItem.Sorting"></a-input-number>
      </a-form-item>
      <a-form-item label="值" has-feedback name="Value">
        <a-textarea v-model:value="editItem.Remark" :auto-size="{ minRows: 4, maxRows: 8 }"></a-textarea>
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

<style lang="scss"></style>
