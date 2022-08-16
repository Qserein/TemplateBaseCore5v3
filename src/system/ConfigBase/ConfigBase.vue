<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import { AForm, AFormItem, AInput, AButton, ATextarea } from '../../antd'
import { api } from '../../api'
import { ConfigBase } from '../../api/gen2/main/types/AdminSystem'

const rules = {
  Names: [{ required: true, message: '活动名称不能为空', trigger: 'change' }],
  Title: [{ required: true, message: '标题不能为空', trigger: 'change' }],
}
function defaultData(): ConfigBase {
  return {
    ID: 0,
    /** 名称 */
    Names: '',
    /** 首页Title */
    Title: '',
    /** 首页关键字 */
    Keywords: '',
    /** 首页描述 */
    Description: '',
    /** 首页JS代码 */
    JSCode: '',
  }
}
const data = ref(defaultData())
const formRef = ref()

async function save() {
  try {
    await formRef.value.validate()
  } catch {
    return
  }
  const res = await api.main['/api/Admin/ConfigBase'].put(data.value)
  if (res.success) {
    data.value = defaultData()
    formRef.value.clearValidate()
    ElMessage.success(res.msg || '提交成功')
  } else {
    ElMessage.error(res.msg || '提交失败')
  }
}
</script>

<template>
  <div class="box">
    <div class="container">
      <div class="title">网站基本配置</div>
      <div style="margin: 20px"></div>
      <a-form ref="formRef" :model="data" :rules="rules" :label-col="{ span: 3 }">
        <a-form-item label="名称" has-feedback name="Names" style="width: 95%">
          <a-input v-model:value="data.Names"></a-input>
        </a-form-item>
        <a-form-item label="首页标题" has-feedback name="Title" style="width: 95%">
          <a-input v-model:value="data.Title"></a-input>
        </a-form-item>
        <a-form-item label="首页关键字" has-feedback name="Keywords" style="width: 95%">
          <a-input v-model:value="data.Keywords"></a-input>
        </a-form-item>
        <a-form-item label="首页描述" has-feedback name="Description" style="width: 95%">
          <a-textarea v-model:value="data.Description" :autosize="{ minRows: 2, maxRows: 4 }"></a-textarea>
        </a-form-item>
        <a-form-item label="首页js代码" has-feedback name="JSCode" style="width: 95%">
          <a-textarea v-model:value="data.JSCode" :autosize="{ minRows: 6, maxRows: 12 }"></a-textarea>
        </a-form-item>
      </a-form>
      <div class="btn">
        <a-button type="primary" @click="save()">提交</a-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.box {
  padding: 20px 5px;
}
.container {
  max-width: unset;
  border: 1px solid #dddddd;

  .title {
    padding: 10px;
    background-color: #f5f5f5;
    font-size: 14px;
    font-weight: bold;
  }
}

.btn {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}
</style>
