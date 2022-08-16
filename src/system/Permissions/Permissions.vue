<script setup lang="ts">
import { ElMessage, ElTree, ElIcon } from 'element-plus'
import { ref } from 'vue'
import { api } from '../../api'
import { AButton } from '../../antd'
import { Check } from '@element-plus/icons'
import { ELTreeViewModel, IDTitleViewModel } from '../../api/gen2/main/types/AdminSystem'

/** 权限 */
const menuArr = ref<string[]>([])
/** 角色列表 */
const roleList = ref<IDTitleViewModel[]>([])
/** 组内用户列表 */
const userList = ref<IDTitleViewModel[]>([])
/** 树结构数据 */
const data = ref<ELTreeViewModel[]>([])

/** 中间头部人数 */
const people = ref(0)

/** 左侧高亮 */
const curLeft = ref(0)
/** 中间高亮 */
const curMid = ref(0)
/** 所有选中的权限菜单 */
const checked = ref()
/** 角色组选中的id */
const checkedID = ref()

/** 第一栏选中的id */
const roleID = ref<number>()

/** 树引用 */
const treeRef = ref()

getRole()
getMenu()

/** 获取角色数据 */
async function getRole() {
  const res = await api.main['/api/Admin/Permissions/GetRole'].get()
  if (res.success) {
    roleList.value = res.data ?? []
  } else {
    ElMessage.error(res.msg || '获取角色数据失败')
  }
}
/** 获取菜单树 */
async function getMenu() {
  const res = await api.main['/api/Admin/Permissions/GetMenu'].get()
  if (res.success) {
    data.value = res.data ?? []
  } else {
    ElMessage.error(res.msg || '获取菜单树失败')
  }
}
/** 获取用户列表 */
async function getUserList(RoleID: number) {
  const res = await api.main['/api/Admin/Permissions/UserList'].get({ RoleID })
  userList.value = res.data ?? []
  people.value = res.count
  if (res.success) {
    if (res.msg != null) {
      menuArr.value = res.msg.split(',').filter(item => item)
    } else {
      menuArr.value = []
    }
    getMenu()
  } else {
    ElMessage.error(res.msg || '获取用户列表失败')
  }
}

/** 点击角色组 */
function roleClick(index: number, id: number) {
  checkedID.value = id
  curLeft.value = index
  getUserList(id)
}

/** 点击用户组 */
function userClick(index: number) {
  curMid.value = index
}

/** 所有被选中的节点 */
function handleCheckChange() {
  const res: ELTreeViewModel[] = treeRef.value.getCheckedNodes()
  const arr = res.map(i => i.id)
  checked.value = `,${arr.join(',')},`
}

/** 保存 */
async function save() {
  if (!curLeft.value) return
  const res = await api.main['/api/Admin/Permissions'].put({ RoleID: +checkedID.value, Menus: checked.value })
  if (res.success) {
    ElMessage.success(res.msg || '保存成功')
  } else {
    ElMessage.error(res.msg || '保存失败')
  }
}
</script>

<template>
  <div class="box">
    <div class="container">
      <div class="title">
        <a-button size="small" type="primary" :class="{ info: !curLeft, primary: curLeft }" @click="save">
          <el-icon><check /></el-icon>
          <span>权限保存</span>
        </a-button>
      </div>
      <div class="main">
        <div class="left">
          <div class="leftTop">角色组</div>
          <div class="mainbox">
            <div class="leftmainbox">
              <div v-for="(item, index) in roleList" :key="index" class="item" :class="{ active: index == curLeft }" @click="roleClick(index, item.ID)">{{ item.Title }}</div>
            </div>
          </div>
        </div>
        <div class="mid">
          <div class="leftTop">组内用户(显示前50，共有{{ people }}人)</div>
          <div class="mainbox">
            <div class="leftmainbox">
              <div v-for="(item, index1) in userList" :key="index1" class="item" :class="{ active: index1 == curMid }" @click="userClick(index1)">{{ item.Title }}</div>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="leftTop">菜单列表</div>
          <div class="mainbox">
            <div v-if="curLeft === 0 ? true : false" style="padding: 10px">超级管理员不需要设置权限</div>
            <el-tree v-else :data="data" show-checkbox node-key="id" default-expand-all ref="treeRef" :default-checked-keys="menuArr" @check-change="handleCheckChange"></el-tree>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.box {
  padding: 20px 5px;

  .container {
    max-width: unset;

    .title {
      border: 1px solid #dddddd;
      padding: 10px;
      background-color: #f5fafe;
    }
  }

  .main {
    display: flex;
    justify-content: space-around;
    margin-top: 15px;
  }

  .left,
  .mid,
  .right {
    width: 30%;
  }

  .leftTop {
    color: #fff;
    font-weight: bold;
    font-size: 14px;
    padding: 10px;
    background: #515a6e;
  }

  .mainbox {
    height: 430px;
    border: 1px solid #000000;
    border-top: none;
    box-sizing: border-box;
    overflow-y: auto;

    .leftmainbox {
      height: 390px;
      margin: 15px;
      border: 1px solid #dddddd;
      font-size: 14px;
    }
  }

  .item {
    padding: 5px 10px;
    cursor: pointer;
  }

  .active {
    background: #1e90ff;
    color: #fff;
  }
}
</style>
