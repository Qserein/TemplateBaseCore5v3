<script setup lang="ts">
import { ASpace, ARangePicker, AInput, AButton } from '../../antd'
import { ElIcon, ElMessage, ElMessageBox, ElTable, ElTableColumn, ElPagination } from 'element-plus'
import { Search, Delete } from '@element-plus/icons'
import { reactive, ref } from 'vue'
import { Moment } from 'moment'
import { api } from '../../api'
import { toDateRange } from '../../utils'
import { LoginLogViewModel } from '../../api/gen2/main/types/AdminSystem'

//#region 列表

/** 查询参数 */
const query = ref({
  DateRange: [] as any as [Moment, Moment], // 日期范围
  Title: '', // 标题
})

/** 分页 */
const page = reactive({
  pageIndex: 1, // 第几页
  pageSize: 15, // 页大小
  total: 0, // 总共几条
})

/** 数据 */
const list = ref<LoginLogViewModel[]>([])

/** 重新查询 */
async function reQuery() {
  page.pageIndex = 1
  await doQuery()
}

doQuery()
/** 进行查询 */
async function doQuery() {
  const res = await api.main['/api/Admin/LoginLog'].get({
    Title: query.value.Title,
    ...toDateRange(query.value.DateRange),
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
const selected = ref<LoginLogViewModel[]>([])
function selectionChange(rows: LoginLogViewModel[]) {
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

    const res = await api.main['/api/Admin/LoginLog/Delete'].del(selected.value.map(i => i.ID))
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

//#endregion
</script>

<template>
  <a-space class="app-top flex items-center">
    <a-range-picker style="width: 250px" v-model:value="query.DateRange" separator="-"></a-range-picker>
    <a-input placeholder="用户名" v-model:value="query.Title" allow-clear></a-input>
    <a-button type="primary" @click="reQuery()">
      <el-icon><search /></el-icon>
      <span>查询</span>
    </a-button>
  </a-space>

  <a-space class="app-tools">
    <a-button type="primary" class="red" danger size="small" @click="batchDel()">
      <el-icon><delete /></el-icon>
      <span>批量删除</span>
    </a-button>
  </a-space>

  <el-table class="app-table" ref="tableRef" :data="list" row-key="ID" highlight-current-row tooltip-effect="dark" header-cell-class-name="app-table-header" border height="100%" @selection-change="selectionChange">
    <el-table-column align="center" type="selection" width="40" :reserve-selection="true" fixed></el-table-column>
    <el-table-column label="序号" align="center" type="index" width="60" fixed :index="comIndex"></el-table-column>
    <el-table-column label="用户名" align="center" prop="Title"></el-table-column>
    <el-table-column label="系统" align="center" prop="Os" width="120"></el-table-column>
    <el-table-column label="浏览器" align="center" prop="browser" width="220"></el-table-column>
    <el-table-column label="宽度" align="center" prop="R_W" width="70"></el-table-column>
    <el-table-column label="高度" align="center" prop="R_H" width="70"></el-table-column>
    <el-table-column label="日期" align="center" prop="AddDate" width="140"></el-table-column>
  </el-table>

  <div class="app-foot flex justify-center">
    <el-pagination background layout="total, prev, pager, next, jumper" :page-size="page.pageSize" :total="page.total" v-model:current-page="page.pageIndex" @current-change="doQuery()"></el-pagination>
  </div>
</template>

<style lang="scss"></style>
