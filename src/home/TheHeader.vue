<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { ALayoutHeader, ABreadcrumb, ABreadcrumbItem, ADropdown, ASkeleton, AMenu, AMenuItem } from '../antd'
import { UserOutlined, DownOutlined, EditOutlined, LogoutOutlined } from '@ant-design/icons-vue'
import { ApiResult } from '../api/def'
import { aget } from '../api'
import { EditPassRef } from './EditPass'
import EditPass from './EditPass.vue'
import { router } from '../router'
import store from '../store'

// #region route

const route = useRoute()
const paths = computed(() => [...(store.menusMap[route.path] ?? [])])

// #endregion

// #region 编辑密码

const edit_password_ref = ref<EditPassRef>()

// #endregion

// #region 用户

const userName = ref('')
getUserName()
async function getUserName() {
  const res = await aget<ApiResult<string>>('/api/Admin/Index/Index2', void 0, { nolog: true })
  userName.value = res.data
}

// 处理用户下拉菜单
function onUserMenuClick({ key }: { key: string }) {
  switch (key) {
    case 'edit-password':
      edit_password_ref.value!.open()
      break
    case 'logout':
      logOut()
      break
  }
}

/** 退出登录 */
function logOut() {
  router.push('/login')
  localStorage.removeItem('token')
}

// #endregion
</script>
<template>
  <a-layout-header id="home-headr">
    <router-link class="logo-title" to="/">通用后台管理系统</router-link>
    <a-breadcrumb class="breadcrumb" style="margin: 16px 0">
      <a-breadcrumb-item class="index"><router-link to="/">首页</router-link></a-breadcrumb-item>
      <a-breadcrumb-item v-for="(p, i) in paths">
        <span class="cursor-default" v-if="!p.url || i == paths.length - 1">{{ p.name }}</span>
        <router-link v-else :to="p.url">{{ p.name }}</router-link>
      </a-breadcrumb-item>
    </a-breadcrumb>

    <div class="flex-1"></div>

    <a-dropdown class="user">
      <div class="flex items-center">
        <UserOutlined />
        <div class="m-2">
          <a-skeleton :loading="!!!userName" active :paragraph="false" :title="{ width: 70 }">
            <span>{{ userName || '加载中' }}</span>
          </a-skeleton>
        </div>
        <DownOutlined />
      </div>
      <template #overlay>
        <a-menu @click="onUserMenuClick">
          <a-menu-item key="edit-password">
            <EditOutlined />
            <span>修改密码</span>
          </a-menu-item>
          <a-menu-item key="logout">
            <LogoutOutlined />
            <span>退出登录</span>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </a-layout-header>

  <EditPass ref="edit_password_ref"></EditPass>
</template>

<style lang="scss">
#home-headr {
  background-color: #515a6e;
  padding: 0;
  height: 60px;
  padding: 0 20px;
  display: flex;

  .logo-title {
    line-height: 60px;
    color: #fcfcfc;
    font-size: 22px;
    text-align: center;
  }

  .breadcrumb {
    padding: 0 30px;
    color: rgba(220, 220, 220, 0.65);

    .index {
      font-weight: bold;
    }

    .ant-breadcrumb-separator {
      color: rgba(220, 220, 220, 0.45);
    }

    .index,
    :last-child .ant-breadcrumb-link {
      color: #fcfcfc;
    }

    a {
      color: rgba(220, 220, 220, 0.45);

      &:hover {
        color: #fcfcfc;
      }
    }
  }

  .user {
    margin-right: 30px;
    cursor: pointer;
    color: rgba(252, 252, 252, 0.85);
    transition: color 0.25s;

    .ant-skeleton-title {
      margin-top: 10px;
    }

    &:hover {
      color: #fcfcfc;
    }
  }
}
</style>
