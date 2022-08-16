<script setup lang="ts">
import { ASpace, AButton, ARadio, ARadioGroup } from '../../antd'
import { ElIcon, ElMessage, ElMessageBox, ElTable, ElTableColumn, ElPagination, ElSelect, ElOption, ElInput, ElDialog, ElForm, ElFormItem } from 'element-plus'
import { Search, Delete, Plus, Edit } from '@element-plus/icons'
import { reactive, ref } from 'vue'
import { api } from '../../api'
import { IDTitleViewModel, SysUserViewModel } from '../../api/gen2/main/types/AdminSystem'

//#region 列表

/** 角色下拉选项 */
const roles = ref<IDTitleViewModel[]>([])

getRoles()
/** 获取角色下拉选项 */
async function getRoles() {
  const res = await api.main['/api/Admin/User/GetRoleViewModel'].get()
  if (res.success) {
    roles.value = res.data ?? []
  } else {
    ElMessage.error(res.msg || '获取角色下拉选项失败')
  }
}

/** 查询参数 */
const query = ref({
  Title: '', // 标题
  RoleID: void 0 as number | undefined, // 角色
  StateID: void 0 as number | undefined, // 状态
  Phone: '', // 手机号
})

/** 分页 */
const page = reactive({
  pageIndex: 1, // 第几页
  pageSize: 15, // 页大小
  total: 0, // 总共几条
})

/** 数据 */
const list = ref<SysUserViewModel[]>([])

/** 重新查询 */
async function reQuery() {
  page.pageIndex = 1
  await doQuery()
}

doQuery()
/** 进行查询 */
async function doQuery() {
  const res = await api.main['/api/Admin/User'].get({
    Title: query.value.Title,
    RoleID: query.value.RoleID,
    StateID: query.value.StateID,
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
const selected = ref<SysUserViewModel[]>([])
function selectionChange(rows: SysUserViewModel[]) {
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
    const res = await api.main['/api/Admin/User/Delete'].del(selected.value.map(i => i.ID))
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

/** 删除单个 */
async function delItem(row: SysUserViewModel) {
  try {
    await ElMessageBox.confirm('是否删除选中数据？', '提示', {
      cancelButtonText: '取消',
      confirmButtonText: '确认',
    })
    const res = await api.main['/api/Admin/User/Delete'].del([row.ID])
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

function defaultModel(): SysUserViewModel {
  return {
    ID: 0,
    UserName: '',
    Password: '',
    HeadPortrait: '',
    NickName: '',
    FullName: '',
    Position: '',
    IdCard: '',
    Gender: 0,
    MobilePhone: '',
    QQ: '',
    Mail: '',
    State: void 0 as any,
    RoleID: void 0 as any,
    RoleName: '',
    AddDate: '',
  }
}
const editRef = ref()
const editRules = {
  UserName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  NickName: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  RoleID: [{ required: true, message: '请选择角色', trigger: 'blur' }],
}
const editItem = ref<SysUserViewModel>(defaultModel())
const showEdit = ref(false)
const isEdit = ref(true)
function openNew() {
  editItem.value = defaultModel()
  isEdit.value = false
  showEdit.value = true
}
async function openEdit(row: SysUserViewModel) {
  const res = await api.main['/api/Admin/User/{id}'].get({ id: row.ID })
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
    const res = await api.main['/api/Admin/User'].put(data)
    if (res.success) {
      closeEdit()
      ElMessage.success(res.msg || '修改成功')
      reQuery()
    } else {
      ElMessage.error(res.msg || '修改失败')
    }
  } else {
    const res = await api.main['/api/Admin/User'].post(data)
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

//#endregion
</script>

<template>
  <a-space class="app-top flex items-center">
    <el-select placeholder="全部角色" style="width: 150px" v-model="query.RoleID" clearable size="medium">
      <el-option v-for="i in roles" :key="i.ID" :value="i.ID" :label="i.Title" />
    </el-select>
    <el-select placeholder="状态" style="width: 100px" v-model="query.StateID" clearable size="medium">
      <el-option label="未审核" :value="1" />
      <el-option label="已审核" :value="2" />
      <el-option label="禁用" :value="3" />
      <el-option label="删除" :value="4" />
    </el-select>
    <el-input placeholder="用户名、姓名" v-model="query.Title" clearable size="medium"></el-input>
    <el-input placeholder="手机号" v-model="query.Phone" clearable size="medium" style="width: 150px"></el-input>
    <a-button type="primary" @click="reQuery()">
      <el-icon><search /></el-icon>
      <span>查询</span>
    </a-button>
  </a-space>

  <a-space class="app-tools">
    <a-button type="primary" class="green" size="small" @click="openNew()">
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
    <el-table-column label="用户名" align="center" prop="UserName"></el-table-column>
    <el-table-column label="昵称" align="center" prop="NickName"></el-table-column>
    <el-table-column label="姓名" align="center" prop="FullName" width="100"></el-table-column>
    <el-table-column label="手机" align="center" prop="MobilePhone" width="120"></el-table-column>
    <el-table-column label="角色" align="center" prop="RoleName" width="100"></el-table-column>
    <el-table-column label="状态" align="center" prop="State" width="90">
      <template v-slot="{ row: { State } }">
        <span v-if="State == 1" style="color: red">未审核</span>
        <span v-else-if="State == 2" style="color: green">已审核</span>
        <span v-else-if="State == 3">禁用</span>
        <span v-else-if="State == 4">删除</span>
        <span v-else>未知状态 {{ State }}</span>
      </template>
    </el-table-column>
    <el-table-column label="日期" align="center" prop="AddDate" width="140"></el-table-column>
    <el-table-column label="操作" align="center" width="80">
      <template v-slot="{ row }">
        <a-space>
          <el-icon class="cursor-pointer" @click="openEdit(row)"><edit /></el-icon>
          <el-icon class="cursor-pointer" @click="delItem(row)"><delete /></el-icon>
        </a-space>
      </template>
    </el-table-column>
  </el-table>

  <div class="app-foot flex justify-center">
    <el-pagination background layout="total, prev, pager, next, jumper" :page-size="page.pageSize" :total="page.total" v-model:current-page="page.pageIndex" @current-change="doQuery()"></el-pagination>
  </div>

  <el-dialog :title="isEdit ? '编辑' : '添加'" v-model="showEdit" width="700px">
    <el-form ref="editRef" :model="editItem" :rules="editRules" inline label-width="100px">
      <el-form-item label="用户名：" prop="UserName">
        <el-input v-model="editItem.UserName" size="medium"></el-input>
      </el-form-item>
      <el-form-item label="昵称：" prop="NickName">
        <el-input v-model="editItem.NickName" size="medium"></el-input>
      </el-form-item>
      <el-form-item label="密码：" prop="Password">
        <el-input placeholder="不填写则为默认密码" v-model="editItem.Password" size="medium" type="password"></el-input>
      </el-form-item>
      <el-form-item label="职务：" prop="Position">
        <el-input v-model="editItem.Position" size="medium"></el-input>
      </el-form-item>
      <el-form-item label="姓名：" prop="FullName">
        <el-input v-model="editItem.FullName" size="medium"></el-input>
      </el-form-item>
      <el-form-item label="手机：" prop="MobilePhone">
        <el-input v-model="editItem.MobilePhone" size="medium"></el-input>
      </el-form-item>
      <el-form-item label="角色：" prop="RoleID">
        <el-select v-model="editItem.RoleID" placeholder="--请选择--" style="width: 202px" size="medium">
          <el-option v-for="item in roles" :key="item.ID" :label="item.Title" :value="item.ID"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="性别：" prop="Gender">
        <a-radio-group v-model:value="editItem.Gender">
          <a-radio :value="1">男</a-radio>
          <a-radio :value="2">女</a-radio>
        </a-radio-group>
      </el-form-item>
      <el-form-item label="QQ：" prop="QQ">
        <el-input v-model="editItem.QQ" size="medium"></el-input>
      </el-form-item>
      <el-form-item label="邮箱：" prop="Mail">
        <el-input v-model="editItem.Mail" size="medium"></el-input>
      </el-form-item>
      <el-form-item label="身份证：" prop="IdCard">
        <el-input v-model="editItem.IdCard" size="medium"></el-input>
      </el-form-item>
      <br />
      <el-form-item label="状态：" prop="State">
        <a-radio-group v-model:value="editItem.State">
          <a-radio :value="1">未审核</a-radio>
          <a-radio :value="2">已审核</a-radio>
          <a-radio :value="3">已禁用</a-radio>
          <a-radio :value="4">已删除</a-radio>
        </a-radio-group>
      </el-form-item>
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
