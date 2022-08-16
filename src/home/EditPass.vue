<script setup lang="ts">
import { ref } from 'vue'
import { AForm, AInput, AFormItem, AButton, ASpace } from '../antd'
import type { RuleObject } from 'ant-design-vue/lib/form/interface'
import { ElDialog, ElMessage } from 'element-plus'
import { ApiResultBasic } from '../api/def'
import { aput } from '../api'
import router from '../router'

function backToLogin() {
  router.push('/login')
  localStorage.removeItem('token')
}

const edit_password_form_ref = ref()
const show_edit_password = ref(false)
function openEditPassword() {
  show_edit_password.value = true
  edit_password.value = {}
}
function closeEditPassword() {
  show_edit_password.value = false
  edit_password_form_ref.value.resetFields()
}
interface EditPassword {
  old_pass?: string
  pass?: string
  check_pass?: string
}
const edit_password = ref<EditPassword>({})
async function validatePass(_rule: RuleObject, value: string) {
  if (!value) throw '请输入密码'
  else if (edit_password.value.check_pass !== '') edit_password_form_ref.value.validateFields('check_pass')
}
async function validateCheckPass(_rule: RuleObject, value: string) {
  if (!value) throw '请再次输入密码'
  else if (value !== edit_password.value.pass) throw '两次输入的密码不同'
}
const edit_password_rules = {
  old_pass: [{ required: true, message: '请输入旧密码', trigger: 'change' }],
  pass: [{ required: true, validator: validatePass, trigger: 'change' }],
  check_pass: [{ required: true, validator: validateCheckPass, trigger: 'change' }],
}
async function doEditPassword() {
  const { old_pass, pass, check_pass } = edit_password.value
  try {
    await edit_password_form_ref.value.validate()
  } catch {
    return
  }
  if (!old_pass || !pass || !check_pass || pass !== check_pass) return
  const res = await aput<ApiResultBasic>('/api/Admin/Index/UpdatePwd', {
    Oldpassword: old_pass,
    Newpassword1: pass,
    Newpassword2: check_pass,
  })
  if (res.success) {
    ElMessage.success('修改成功！')

    closeEditPassword()
    backToLogin()
  } else {
    ElMessage.error(res.msg || '修改失败')
    edit_password.value = {}
    edit_password_form_ref.value.resetFields()
  }
}

defineExpose({
  open: ref(openEditPassword),
  close: ref(closeEditPassword),
})
</script>

<template>
  <el-dialog title="修改密码" v-model="show_edit_password" width="500px">
    <a-form ref="edit_password_form_ref" :model="edit_password" :label-col="{ span: 4 }" :rules="edit_password_rules">
      <a-form-item label="旧密码" has-feedback name="old_pass">
        <a-input v-model:value="edit_password.old_pass" type="password"></a-input>
      </a-form-item>

      <a-form-item label="新密码" has-feedback name="pass">
        <a-input v-model:value="edit_password.pass" type="password" autocomplete="off"></a-input>
      </a-form-item>

      <a-form-item label="再次输入密码" has-feedback name="check_pass">
        <a-input v-model:value="edit_password.check_pass" type="password" autocomplete="off"></a-input>
      </a-form-item>
    </a-form>

    <template #footer>
      <div class="flex justify-center items-center">
        <a-space>
          <a-button type="primary" @click="doEditPassword()">确认修改</a-button>
          <a-button @click="closeEditPassword()">取 消</a-button>
        </a-space>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss"></style>
