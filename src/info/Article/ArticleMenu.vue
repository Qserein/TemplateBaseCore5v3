<script setup lang="ts">
import { ASpace, AInput, AButton, AForm, AFormItem, AInputNumber } from '../../antd'
import { ElIcon, ElMessage, ElMessageBox, ElTree, ElDialog } from 'element-plus'
import { Delete, Plus } from '@element-plus/icons'
import { ref } from 'vue'
import { api } from '../../api'
import { ArticleMenuModel, ELTreeViewModel, StringApiResult } from '../../api/gen2/main/types/AdminSystem'

/** 树数据 */
const data = ref<ELTreeViewModel[]>([])

reQuery()
/** 获取树 */
async function reQuery() {
  const res = await api.main['/api/Admin/ArticleMenu'].get({ State: 2 })
  if (res.success) {
    data.value = res.data ?? []
  } else {
    ElMessage.error(res.msg || '获取树失败')
  }
}

/** 当前选中的项的父级 */
const checkedParentID = ref(0)
/** 当前选中的项 */
const checkedID = ref(0)
/** 选中的树节点 */
const checkData = ref()
/** 选中树节点node */
const checkNode = ref()

/** 拖拽 */
async function onNodeDrop(draggingNode: any, dropNode: any, dropType: any) {
  console.log(draggingNode) //draggingNode.key  当前拖动的元素id
  console.log(dropNode) //dropNode.key   拖动结束点的id
  console.log(dropType) // 在目标id的上还是下
  const drop = dropType === 'inner' ? '下级' : '同级'
  const id = draggingNode.key //拖动的栏目id
  const pid = dropNode.key //拖动结束目标点的栏目id  放到下级时使用
  const bid = dropNode.parent.key //拖动结束目标点父级的栏目id  放到同级时使用
  console.log(id, pid)
  try {
    await ElMessageBox.confirm(`您确定把"${draggingNode.label}"放到"${dropNode.label}"${drop}吗`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    let res: StringApiResult
    if (drop === '下级') {
      res = await api.main['/api/Admin/ArticleMenu/ModifyParentID'].put({ ID: id, ParentID: pid })
    } else {
      res = await api.main['/api/Admin/ArticleMenu/ModifyParentID'].put({ ID: id, ParentID: bid })
    }
    if (res.success) {
      reQuery()
      ElMessage.success(res.msg || '移动成功')
    } else {
      ElMessage.error(res.msg || '移动失败，请重试!')
    }
  } catch {
    ElMessage.info('已取消移动')
    reQuery()
  }
}
/** 选中某一行 */
function onNodeClick(data: any, node: any) {
  console.log(node)
  checkedParentID.value = node.parent.key
  checkedID.value = data.id
  console.log('父id', editItem.value.ParentID, '子id', editItem.value.ID)
  checkNode.value = node
  checkData.value = data
}
/** 设置某个节点不可拖拽 */
function allowDrag(draggingNode: any) {
  return draggingNode.data.label.indexOf('根目录') === -1
}

/** 刷新 */
async function refresh() {
  reQuery()
}
/** 删除 */
async function remove() {
  if (!checkNode.value) return void ElMessage.warning('请选择要删除的节点')
  try {
    await ElMessageBox.confirm('此操作将永久删除该文件, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    const res = await api.main['/api/Admin/ArticleMenu/Enable'].put([checkedID.value], { Enable: false })
    if (res.success) {
      const node = checkNode.value
      const data = checkData.value
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex((d: any) => d.id === data.id)
      children.splice(index, 1)
      checkNode.value = null
      checkData.value = null
      checkedID.value = 0
      ElMessage.success('删除成功!')
    } else {
      ElMessage.error('删除失败')
    }
  } catch {
    ElMessage.info('已取消删除')
  }
}

//#region 新增编辑

function defaultModel(): any {
  return {
    ID: 0,
    Names: '',
    ENames: '',
    ParentID: checkedID.value,
    EnterpriseID: 0,
    Sorting: 0,
    State: 0,
    Type: 0,
    AddDate: void 0 as any,
    URL: '',
  }
}
const editRef = ref()
const editRules = {
  Names: [{ required: true, message: '标题不能为空', trigger: 'change' }],
}
const editItem = ref<any>(defaultModel())
const showEdit = ref(false)
const isEdit = ref(true)
function openNew() {
  editItem.value = defaultModel()
  isEdit.value = false
  showEdit.value = true
}
async function openEdit() {
  if (!checkedID.value) return void ElMessage.warning('请选择一个节点再进行操作')
  const res = await api.main['/api/Admin/ArticleMenu/{ID}'].get({ ID: checkedID.value })
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
    const res = await api.main['/api/Admin/ArticleMenu'].put(data)
    if (res.success) {
      closeEdit()
      ElMessage.success(res.msg || '修改成功')
      reQuery()
    } else {
      ElMessage.error(res.msg || '修改失败')
    }
  } else {
    const res = await api.main['/api/Admin/ArticleMenu'].post(data)
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
  <div class="box flex-1 flex flex-col overflow-hidden">
    <div class="container flex-1 flex flex-col overflow-hidden">
      <div class="header">
        <div class="title">文章栏目管理</div>
        <a-space class="button">
          <a-button type="primary" size="small" @click="refresh()">
            <el-icon><plus /></el-icon>
            <span>刷新</span>
          </a-button>
          <a-button type="primary" class="success" size="small" @click="openNew()">
            <el-icon><plus /></el-icon>
            <span>添加</span>
          </a-button>
          <a-button type="primary" size="small" @click="openEdit()">
            <el-icon><plus /></el-icon>
            <span>编辑</span>
          </a-button>
          <a-button type="primary" danger size="small" @click="remove()">
            <el-icon><delete /></el-icon>
            <span>删除</span>
          </a-button>
        </a-space>
      </div>
      <div class="mainMgt flex-1">
        <el-tree :data="data" node-key="id" default-expand-all @node-drop="onNodeDrop" @node-click="onNodeClick" draggable :allow-drag="allowDrag"> </el-tree>
      </div>
    </div>
  </div>

  <el-dialog :title="isEdit ? '编辑' : '添加'" v-model="showEdit" width="600px">
    <a-form ref="editRef" :model="editItem" :label-col="{ span: 5 }" :rules="editRules">
      <a-form-item label="标题" has-feedback name="Names">
        <a-input v-model:value="editItem.Names"></a-input>
      </a-form-item>
      <a-form-item label="副标题" has-feedback name="ENames">
        <a-input v-model:value="editItem.ENames"></a-input>
      </a-form-item>
      <a-form-item label="顺序" has-feedback name="Sorting">
        <a-input-number v-model:value="editItem.Sorting"></a-input-number>
      </a-form-item>
      <a-form-item label="类型，自由定义" has-feedback name="Type">
        <a-input-number v-model:value="editItem.Type"></a-input-number>
      </a-form-item>
      <a-form-item label="外链" has-feedback name="URL">
        <a-input v-model:value="editItem.URL"></a-input>
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

<style lang="scss" scoped>
.box {
  padding: 20px 5px;

  .container {
    max-width: unset;
  }

  .header {
    width: 100%;
    height: 60px;
    background-color: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    box-sizing: border-box;
    border: 1px solid rgb(190, 190, 190, 0.5);
  }

  .mainMgt {
    overflow: auto;
    border: 1px solid rgb(190, 190, 190, 0.5);
    border-top: none;
    padding: 10px 0;
  }
}
</style>
