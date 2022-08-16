<script setup lang="ts">
import { ASpace, AInput, AButton, AForm, AFormItem, ASelect, ASelectOption, AInputNumber, ATextarea, ASwitch } from '../../antd'
import { ElIcon, ElMessage, ElMessageBox, ElTable, ElTableColumn, ElDialog } from 'element-plus'
import { Search, Edit, Plus, CircleCheck, Remove } from '@element-plus/icons'
import { ref } from 'vue'
import { api } from '../../api'
import MenuIcon from '../../home/MenuIcon.vue'
import { IDTitleViewModel, Menu } from '../../api/gen2/main/types/AdminSystem'

//#region 列表

/** 查询参数 */
const query = ref({
  Title: '', // 标题
  IsEnable: 1 as string | number, // 是否启用
})

/** 数据 */
const list = ref<Menu[]>([])

doQuery()
/** 进行查询 */
async function doQuery() {
  getMenus()
  const res = await api.main['/api/Admin/Menu'].get({
    Title: query.value.Title,
    IsEnable: query.value.IsEnable == '' ? false : query.value.IsEnable > 0,
  })
  if (res.success) {
    list.value = res.data ?? []
  } else {
    ElMessage.error(res.msg || '获取失败')
  }
}

/** 表格的 ref */
const tableRef = ref<{ clearSelection(): void }>()

/** 当前选中的项 */
const selected = ref<Menu[]>([])
function selectionChange(rows: Menu[]) {
  selected.value = rows
}

//#endregion

//#region 业务

/** 启用禁用 */
async function setEnable(IsEnable: boolean) {
  const name = IsEnable ? '启用' : '禁用'
  if (selected.value.length == 0) return void ElMessage.warning('请先选择数据！')
  try {
    await ElMessageBox.confirm(`是否${name}选中数据？`, '提示', {
      cancelButtonText: '取消',
      confirmButtonText: '确认',
      type: 'warning',
    })
    const res = await api.main['/api/Admin/Menu/Enable'].put({
      ID: selected.value.map(i => i.ID),
      IsEnable,
    })
    if (res.success) {
      doQuery()
      ElMessage.success(res.msg || `${name}成功!`)
      selected.value = []
      tableRef.value?.clearSelection()
    } else {
      ElMessage.error(res.msg || `${name}失败`)
    }
  } catch {
    ElMessage.info(`已取消${name}`)
  }
}

//#region 新增编辑

const menus = ref<IDTitleViewModel[]>([])
async function getMenus() {
  const res = await api.main['/api/Admin/Menu/Menu'].get({ IsEnable: query.value.IsEnable as any })
  if (res.success) {
    menus.value = res.data ?? []
  } else {
    ElMessage.error(res.msg || '获取菜单项失败')
  }
}

function defaultConfig(): Menu {
  return {
    ID: 0,
    FID: 0,
    Names: '',
    Icon: null as any,
    Url: '',
    IsEnable: true,
    Sorting: 0,
    Remark: '',
  }
}
const editRef = ref()
const editRules = {
  Names: [{ required: true, message: '请输入名称', trigger: 'change' }],
  Icon: [{ required: true, message: '请选择图标', trigger: 'change' }],
}
const editItem = ref<Menu>(defaultConfig())
const showEdit = ref(false)
const isEdit = ref(true)
function openNew() {
  editItem.value = defaultConfig()
  isEdit.value = false
  showEdit.value = true
}
async function openEdit(row: Menu) {
  const res = await api.main['/api/Admin/Menu/{id}'].get({ id: row.ID })
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
    const res = await api.main['/api/Admin/Menu'].put(data)
    if (res.success) {
      closeEdit()
      ElMessage.success(res.msg || '修改成功')
      doQuery()
    } else {
      ElMessage.error(res.msg || '修改失败')
    }
  } else {
    const res = await api.main['/api/Admin/Menu'].post(data)
    if (res.success) {
      closeEdit()
      ElMessage.success(res.msg || '添加成功')
      doQuery()
    } else {
      ElMessage.error(res.msg || '添加失败')
    }
  }
}
//#endregion

//#endregion
</script>

<template>
  <div class="m-15px bg-white p-15px flex flex-col flex-1">
    <a-space class="app-top flex items-center">
      <a-select placeholder="状态" style="width: 100px" v-model:value="query.IsEnable">
        <a-select-option value="">全部状态</a-select-option>
        <a-select-option :value="1">启用</a-select-option>
        <a-select-option :value="0">禁用</a-select-option>
      </a-select>
      <a-input placeholder="标题" v-model:value="query.Title" allow-clear></a-input>
      <a-button type="primary" @click="doQuery()">
        <el-icon><search /></el-icon>
        <span>查询</span>
      </a-button>
    </a-space>

    <a-space class="app-tools">
      <a-button type="primary" class="success" size="small" @click="openNew()">
        <el-icon><plus /></el-icon>
        <span>添加</span>
      </a-button>
      <a-button type="primary" size="small" @click="setEnable(true)">
        <el-icon><circle-check /></el-icon>
        <span>启用</span>
      </a-button>
      <a-button type="primary" class="yellow" size="small" @click="setEnable(false)">
        <el-icon><remove /></el-icon>
        <span>禁用</span>
      </a-button>
    </a-space>

    <el-table class="app-table" ref="tableRef" :data="list" row-key="ID" highlight-current-row tooltip-effect="dark" header-cell-class-name="app-table-header" border height="100%" @selection-change="selectionChange">
      <el-table-column align="center" type="selection" width="40" :reserve-selection="true" fixed></el-table-column>
      <el-table-column label="序号" align="center" type="index" width="60" fixed></el-table-column>
      <el-table-column label="名称" align="left" prop="Names"></el-table-column>
      <el-table-column label="地址" align="center" prop="Url"></el-table-column>
      <el-table-column label="图标" align="center" prop="Icon" width="80">
        <template v-slot="{ row: { Icon } }">
          <menu-icon v-if="Icon" :icon="Icon"></menu-icon>
        </template>
      </el-table-column>
      <el-table-column label="主顺序 / 状态" align="center" prop="Sorting" width="110">
        <template v-slot="{ row: { Sorting, FID, IsEnable } }">
          <div v-if="!FID" class="flex justify-between">
            <span class="flex-1 text-center">{{ Sorting }}</span>
            <div>
              <span> / </span>
              <span v-if="IsEnable" style="color: green">启用</span>
              <span v-else style="color: red">禁用</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="子顺序 / 状态" align="right" prop="Sorting" width="110">
        <template v-slot="{ row: { Sorting, FID, IsEnable } }">
          <div v-if="FID" class="flex justify-between">
            <span class="flex-1 text-center">{{ Sorting }}</span>
            <div>
              <span> / </span>
              <span v-if="IsEnable" style="color: green">启用</span>
              <span v-else style="color: red">禁用</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="80">
        <template v-slot="{ row }">
          <el-icon class="cursor-pointer" @click="openEdit(row)"><edit /></el-icon>
        </template>
      </el-table-column>
    </el-table>

    <div class="app-foot flex justify-center"></div>

    <el-dialog :custom-class="$style['el-dialog']" :title="isEdit ? '编辑' : '添加'" v-model="showEdit" width="600px">
      <a-form ref="editRef" :model="editItem" :label-col="{ span: 3 }" :rules="editRules">
        <a-form-item label="名称" has-feedback name="Names">
          <a-input v-model:value="editItem.Names" placeholder="菜单的名称"></a-input>
        </a-form-item>
        <a-form-item label="父菜单" has-feedback name="FID">
          <a-select placeholder="父级菜单" v-model:value="editItem.FID">
            <a-select-option :value="0">无父级</a-select-option>
            <a-select-option v-for="i in menus" :key="i.ID" :value="i.ID">{{ i.Title }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="地址" has-feedback name="Url">
          <a-input v-model:value="editItem.Url" placeholder="Url， 例如 /path/to"></a-input>
        </a-form-item>
        <a-form-item label="顺序" has-feedback name="Sorting">
          <a-input-number v-model:value="editItem.Sorting" placeholder="显示的顺序"></a-input-number>
        </a-form-item>
        <a-form-item label="图标" has-feedback name="Icon" v-if="!editItem.FID">
          <a-select placeholder="图标" v-model:value="editItem.Icon">
            <a-select-option value="pie-chart-outlined">
              <menu-icon icon="pie-chart-outlined"></menu-icon>
            </a-select-option>
            <a-select-option value="appstore-outlined">
              <menu-icon icon="appstore-outlined"></menu-icon>
            </a-select-option>
            <a-select-option value="file-text-outlined">
              <menu-icon icon="file-text-outlined"></menu-icon>
            </a-select-option>
            <a-select-option value="fire-outlined">
              <menu-icon icon="fire-outlined"></menu-icon>
            </a-select-option>
            <a-select-option value="setting-outlined">
              <menu-icon icon="setting-outlined"></menu-icon>
            </a-select-option>
            <a-select-option value="control-outlined">
              <menu-icon icon="control-outlined"></menu-icon>
            </a-select-option>
            <a-select-option value="desktop-outlined">
              <menu-icon icon="desktop-outlined"></menu-icon>
            </a-select-option>
            <a-select-option value="database-outlined">
              <menu-icon icon="database-outlined"></menu-icon>
            </a-select-option>
            <a-select-option value="deployment-unit-outlined">
              <menu-icon icon="deployment-unit-outlined"></menu-icon>
            </a-select-option>
            <a-select-option value="partition-outlined">
              <menu-icon icon="partition-outlined"></menu-icon>
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="备注" has-feedback name="Remark">
          <a-textarea v-model:value="editItem.Remark" placeholder="备注" :autosize="{ minRows: 3, maxRows: 6 }"></a-textarea>
        </a-form-item>
        <a-form-item label="状态" has-feedback name="IsEnable">
          <a-switch class="app-state" v-model:checked="editItem.IsEnable" checked-children="启用" un-checked-children="禁用" />
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
  </div>
</template>

<style lang="scss" module>
.el-dialog {
  min-width: 600px;
}
</style>
