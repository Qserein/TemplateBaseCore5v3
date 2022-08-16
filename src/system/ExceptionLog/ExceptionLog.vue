<script setup lang="ts">
import { ASpace, ARangePicker, AInput, AButton, ASelect, ASelectOption } from '../../antd'
import { ElIcon, ElMessage, ElMessageBox, ElTable, ElTableColumn, ElPagination, ElDialog } from 'element-plus'
import { Search, Delete, Check } from '@element-plus/icons'
import { Moment } from 'moment'
import { ref, reactive } from 'vue'
import { api } from '../../api'
import { toDateRange } from '../../utils'
import { ExceptionLogViewModel } from '../../api/gen2/main/types/AdminSystem'
import { GetParams } from '../../api/gen2/main/api'

//#region 列表

type QueryType = Omit<GetParams['/api/Admin/ExceptionLog'], 'Date1' | 'Date2'> & { DateRange: [Moment, Moment] }

/** 查询参数 */
const query = ref<QueryType>({
  DateRange: [null!, null!],
  Title: null!,
  TypeID: null!,
  IsSolve: null!,
})

/** 分页 */
const page = reactive({
  pageIndex: 1,
  pageSize: 15,
  total: 0,
})

/** 数据 */
const list = ref<ExceptionLogViewModel[]>([])

/** 重新查询 */
async function reQuery() {
  page.pageIndex = 1
  await doQuery()
}

doQuery()
/** 进行查询 */
async function doQuery() {
  const res = await api.main['/api/Admin/ExceptionLog'].get({
    Title: query.value.Title,
    TypeID: query.value.TypeID,
    IsSolve: query.value.IsSolve,
    ...toDateRange(query.value.DateRange, { from: 'Date1', to: 'Date2' }),
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
const selected = ref<ExceptionLogViewModel[]>([])
function selectionChange(rows: ExceptionLogViewModel[]) {
  console.log(rows)
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
    const res = await api.main['/api/Admin/ExceptionLog'].del(selected.value.map(i => i.ID))
    if (res.success) {
      reQuery()
      ElMessage.success('删除成功！')
      selected.value = []
      tableRef.value?.clearSelection()
    } else {
      ElMessage.info('删除失败，请重试!')
    }
  } catch {
    ElMessage.info('已取消删除')
  }
}

/** 批量处理 */
async function batchDispose() {
  if (selected.value.length == 0) return void ElMessage.warning('请先选择数据！')
  try {
    await ElMessageBox.confirm('是否把选中数据设为已处理？', '提示', {
      cancelButtonText: '取消',
      confirmButtonText: '确认',
      type: 'warning',
    })
    const res = await api.main['/api/Admin/ExceptionLog'].put(selected.value.map(i => i.ID))
    if (res.success) {
      reQuery()
      ElMessage.success('处理成功')
      selected.value = []
      tableRef.value?.clearSelection()
    } else {
      ElMessage.info('处理失败，请重试！')
    }
  } catch {
    ElMessage.info('已取消处理')
  }
}

//#region 异常详情

const showErrInfo = ref(false)
const errInfo = ref('')
async function openErrInfo(row: ExceptionLogViewModel) {
  const res = await api.main['/api/Admin/ExceptionLog/{id}'].get({ id: row.ID })
  if (res.success) {
    showErrInfo.value = true
    errInfo.value = res.data.Content ?? ''
  } else {
    ElMessage.error(res.msg || '获取详情失败')
  }
}

//#endregion

//#endregion
</script>

<template>
  <a-space class="app-top flex items-center">
    <a-select placeholder="类型" style="width: 100px" v-model:value="query.TypeID">
      <a-select-option value="">全部类型</a-select-option>
      <a-select-option :value="1">异常日志</a-select-option>
      <a-select-option :value="2">文件不存在</a-select-option>
      <a-select-option :value="3">登陆失败</a-select-option>
      <a-select-option :value="4">其他</a-select-option>
    </a-select>
    <a-select placeholder="状态" style="width: 100px" v-model:value="(query.IsSolve as any)">
      <a-select-option value="">全部状态</a-select-option>
      <a-select-option :value="true">已受理</a-select-option>
      <a-select-option :value="false">未受理</a-select-option>
    </a-select>
    <a-range-picker style="width: 250px" v-model:value="query.DateRange" separator="-"></a-range-picker>
    <a-input placeholder="标题" v-model:value="query.Title" allow-clear></a-input>
    <a-button type="primary" @click="reQuery()">
      <el-icon><search /></el-icon>
      <span>查询</span>
    </a-button>
  </a-space>

  <a-space class="app-tools">
    <a-button type="primary" size="small" @click="batchDispose()">
      <el-icon><check /></el-icon>
      <span>批量处理</span>
    </a-button>
    <a-button type="primary" class="red" danger size="small" @click="batchDel()">
      <el-icon><delete /></el-icon>
      <span>批量删除</span>
    </a-button>
  </a-space>

  <el-table class="app-table" ref="tableRef" :data="list" row-key="ID" highlight-current-row tooltip-effect="dark" header-cell-class-name="app-table-header" border height="100%" @selection-change="selectionChange">
    <el-table-column align="center" type="selection" width="40" :reserve-selection="true" fixed></el-table-column>
    <el-table-column label="序号" align="center" type="index" width="60" fixed :index="comIndex"></el-table-column>
    <el-table-column label="分类" align="center" prop="Type" width="100">
      <template v-slot="{ row: { Type } }">
        <span v-if="Type == 1">异常</span>
        <span v-else-if="Type == 2">文件不存在</span>
        <span v-else-if="Type == 3">登录失败</span>
        <span v-else-if="Type == 4">其它</span>
        <span v-else>未知类型 {{ Type }}</span>
      </template>
    </el-table-column>
    <el-table-column label="标题" align="center" prop="Title"></el-table-column>
    <el-table-column label="状态" align="center" prop="IsSolve" width="100">
      <template v-slot="{ row: { IsSolve } }">
        <span v-if="IsSolve" style="color: green">已处理</span>
        <span v-else style="color: red">未处理</span>
      </template>
    </el-table-column>
    <el-table-column label="日期" align="center" prop="AddDate" width="140"></el-table-column>
    <el-table-column label="操作" align="center" width="80">
      <template v-slot="{ row }">
        <el-icon class="cursor-pointer" @click="openErrInfo(row)"><search /></el-icon>
      </template>
    </el-table-column>
  </el-table>

  <div class="app-foot flex justify-center">
    <el-pagination background layout="total, prev, pager, next, jumper" :page-size="page.pageSize" :total="page.total" v-model:current-page="page.pageIndex" @current-change="doQuery()"></el-pagination>
  </div>

  <el-dialog title="异常详情" v-model="showErrInfo">
    <pre class="overflow-auto p-2">{{ errInfo }}</pre>
  </el-dialog>
</template>

<style lang="scss"></style>
