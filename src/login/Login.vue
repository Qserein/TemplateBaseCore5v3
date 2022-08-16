<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue'
import { aget, apost, LoginRes } from '../api'
import { Md5 } from 'ts-md5'
import router from '../router'
import { Modal } from 'ant-design-vue'
import { ElMessage } from 'element-plus'
import { throttle } from '../utils'

const username = ref('')
const password = ref('')
const vcode = ref('')

if (localStorage.getItem('isDated')) {
  ElMessage.error('登陆过期，请重新登录')
  localStorage.removeItem('isDated')
}

const img = ref<Blob>(null!)
const imgCode = ref('')

getCode()

async function getCode() {
  const res = await aget('/api/Admin/Login/VerificationCode', void 0, { nolog: true, nores: true, resType: 'blob' })
  img.value = res
}

watch(img, img => {
  URL.revokeObjectURL(imgCode.value)
  imgCode.value = URL.createObjectURL(img)
})
onUnmounted(() => {
  URL.revokeObjectURL(imgCode.value)
})

async function doLogin() {
  if (!username.value)
    return void Modal.warning({
      title: '提示',
      content: '请填写用户名',
      centered: true,
    })
  if (!password.value)
    return void Modal.warning({
      title: '提示',
      content: '请填写密码',
      centered: true,
    })
  if (!vcode.value)
    return void Modal.warning({
      title: '提示',
      content: '请填写验证码',
      centered: true,
    })
  login()
}

const login = throttle(
  async () => {
    const passwordMd5 = Md5.hashStr(password.value).toUpperCase()
    const res = await apost<LoginRes>('/api/Admin/Login/Secure', {
      username: username.value,
      password: passwordMd5,
      vcode: vcode.value,
    })
    if (res.success) {
      localStorage.setItem('token', res.data.token)
      sessionStorage.setItem('id', res.data.ID)
      router.replace('/')
    } else {
      getCode()
      ElMessage.error(res.msg)
    }
  },
  3000,
  true
)
</script>

<template>
  <div class="main grid">
    <div class="box flex flex-col items-end">
      <div class="content">
        <div class="title">通用管理平台</div>
        <div class="item">
          <img src="../assets/img//loginuser.png" />
          <input placeholder="用户名" v-model="username" class="inputNoBorder" autocomplete="off" maxlength="20" />
        </div>
        <div class="item">
          <img src="../assets/img//loginpwd.png" />
          <input type="password" placeholder="登录密码" v-model="password" class="inputNoBorder" autocomplete="off" maxlength="20" />
        </div>
        <div class="item">
          <img src="../assets/img//logincode.png" />
          <input placeholder="验证码" v-model="vcode" class="inputNoBorder" autocomplete="off" maxlength="4" />
          <img id="imgVCode" class="code" :src="imgCode" alt="验证码" title="看不清，换一张" @click="getCode()" />
        </div>
        <div class="login-box">
          <a v-on:click="doLogin" class="do-login">登录</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.main {
  width: 100vw;
  height: 100vh;
  background: url('../assets/img/loginbj.png') top center no-repeat;

  > .box {
    justify-self: center;
    align-self: center;
    width: 844px;
    height: 492px;
    background: url('../assets/img/loginmainbj.png');

    > .content {
      width: 450px;
      margin: 50px 30px 0 0;

      > .title {
        font-size: 25px;
        color: #34a8ff;
        font-weight: 700;
        margin-bottom: 20px;
        text-align: center;
      }

      > .item {
        width: 300px;
        margin: 15px 60px 0;
        padding: 10px;
        border-bottom: 1px solid #e1e1e1;
        display: flex;
        align-items: center;

        > img {
          width: 22px;
          height: 22px;
          vertical-align: middle;
        }

        > input {
          width: 100%;
          flex: 1;
          height: 40px;
          margin-left: 20px;
          border: 0;
        }

        > .code {
          display: block;
          width: 90px;
          height: 40px;
          cursor: pointer;
        }
      }

      > .login-box {
        margin: 40px;

        > .do-login {
          width: 220px;
          height: 60px;
          display: block;
          text-align: center;
          background-image: url('../assets/img/loginbtn.png');
          line-height: 55px;
          font-size: 24px;
          color: #fff;
          background-size: 100% 100%;
          margin: 0 auto;
          cursor: pointer;
        }
      }
    }
  }
}

a:hover {
  color: white;
}

input {
  outline: none;
}
</style>
