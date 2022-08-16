<script setup lang="ts">
import { ASpace, ARangePicker, AButton, AInputNumber, AUpload, ARadio, ARadioGroup } from '../../antd'
import { ElIcon, ElMessage, ElMessageBox, ElTable, ElTableColumn, ElPagination, ElInput, ElSelect, ElOption, ElForm, ElFormItem, ElDialog, ElColorPicker, ElDatePicker } from 'element-plus'
import { Search, Delete, Plus, Edit } from '@element-plus/icons'
import { PlusOutlined } from '@ant-design/icons-vue'
import { nextTick, reactive, ref } from 'vue'
import { Moment } from 'moment'
import { api } from '../../api'
import { toDateRange } from '../../utils'
import { GetParams } from '../../api/gen2/main/api'
import { AdverViewModel, IDTitleViewModel } from '../../api/gen2/main/types/AdminSystem'

//#region 列表

/** 类型下拉数据 */
const adClassify = ref<IDTitleViewModel[]>([])

getAdClassify()
/** 获取类型下拉数据 */
async function getAdClassify() {
  const res = await api.main['/api/Admin/Advert'].get()
  if (res.success) {
    adClassify.value = res.data ?? []
  } else {
    ElMessage.error(res.msg || '获取类型下拉数据失败')
  }
}

/** 查询参数 */
const query = ref<Omit<GetParams['/api/Admin/Advert/List'], 'SelStartDate, SelEndDate'> & { DateRange: [Moment, Moment] }>({
  DateRange: [null!, null!], // 日期范围
  Title: null!, // 标题
  IsEnable: null!, // 是否启用
  TypeID: null!, // 类型
})

/** 分页 */
const page = reactive({
  pageIndex: 1, // 第几页
  pageSize: 15, // 页大小
  total: 0, // 总共几条
})

/** 数据 */
const list = ref<AdverViewModel[]>([])

/** 重新查询 */
async function reQuery() {
  page.pageIndex = 1
  await doQuery()
}

doQuery()
/** 进行查询 */
async function doQuery() {
  const res = await api.main['/api/Admin/Advert/List'].get({
    Title: query.value.Title,
    IsEnable: query.value.IsEnable,
    TypeID: query.value.TypeID,
    ...toDateRange(query.value.DateRange, { from: 'SelStartDate', to: 'SelEndDate' }),
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
const selected = ref<AdverViewModel[]>([])
function selectionChange(rows: AdverViewModel[]) {
  selected.value = rows
}

/** 将图片地址转成 css */
function picCss(v: string) {
  return `url(${JSON.stringify(v)})`
}

//#endregion

//#region 业务

/** 删除单个 */
async function delItem(row: AdverViewModel) {
  try {
    await ElMessageBox.confirm('是否删除选中数据？', '提示', {
      cancelButtonText: '取消',
      confirmButtonText: '确认',
    })
    const res = await api.main['/api/Admin/Advert/{ID}'].del({ ID: row.ID })
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

function defaultModel(): AdverViewModel {
  return {
    ID: 0,
    Title: '',
    TypeID: '' as any,
    Pic: '',
    BackgroundColor: '',
    StartDate: '',
    EndDate: '',
    Url: '',
    Sorting: 0,
    IsEnable: true,
  }
}
const editRef = ref()
const editRules = {
  Title: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
  TypeID: [{ required: true, message: '类型不能为空', trigger: 'blur' }],
  StartDate: [{ required: true, message: '开始时间不能为空', trigger: 'blur' }],
  EndDate: [{ required: true, message: '结束时间不能为空', trigger: 'blur' }],
  IsEnable: [{ required: true, message: '请选择状态', trigger: 'blur' }],
}
const editItem = ref<AdverViewModel>(defaultModel())
const showEdit = ref(false)
const isEdit = ref(true)
function openNew() {
  editItem.value = defaultModel()
  isEdit.value = false
  showEdit.value = true
}
async function openEdit(row: AdverViewModel) {
  openNew()
  isEdit.value = true
  await nextTick()
  const res = await api.main['/api/Admin/Advert/{ID}'].get({ ID: row.ID })
  if (res.success) {
    editItem.value = res.data
    const obj = {
      name: res.data.Title,
      url: res.data.Pic,
    }
    if (res.data.Pic) {
      imgFile.value = [res.data.Pic]
      imgFileList.value = [{ uid: 0, name: '0', status: 'done', url: res.data.Pic }] as any
    } else {
      imgFile.value = []
      imgFileList.value = []
    }
    attachList.value = [obj]
    isEdit.value = true
    showEdit.value = true
  } else {
    ElMessage.error(res.msg || '获取详情失败')
  }
}
function closeEdit() {
  showEdit.value = false
  editRef.value.clearValidate()
  attachList.value = []
}
async function saveEdit() {
  try {
    await editRef.value.validate()
  } catch {
    return
  }
  const data = {
    ...editItem.value,
    Pic: imgFile.value[0] || '',
  }
  if (isEdit.value) {
    const res = await api.main['/api/Admin/Advert'].put(data)
    if (res.success) {
      closeEdit()
      ElMessage.success(res.msg || '修改成功')
      reQuery()
    } else {
      ElMessage.error(res.msg || '修改失败')
    }
  } else {
    const res = await api.main['/api/Admin/Advert'].post(data)
    if (res.success) {
      closeEdit()
      ElMessage.success(res.msg || '添加成功')
      reQuery()
    } else {
      ElMessage.error(res.msg || '添加失败')
    }
  }
}

const imgFile = ref<string[]>([])
const imgFileList = ref<{ uid: any; name: any }[]>([])
const attachList = ref<any[]>([])

function beforeUpload(file: any) {
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = e => {
    const img_base64 = reader.result as string
    imgFile.value = [img_base64]
  }
  return false
}

//#endregion

//#endregion
</script>

<template>
  <a-space class="app-top flex items-center">
    <el-select placeholder="类型" style="width: 150px" v-model="query.TypeID" clearable size="medium">
      <el-option v-for="i in adClassify" :key="i.ID" :label="i.Title" :value="i.ID" />
    </el-select>
    <el-select placeholder="状态" style="width: 100px" v-model="query.IsEnable" clearable size="medium">
      <el-option label="启用" :value="true" />
      <el-option label="禁用" :value="false" />
    </el-select>
    <el-input placeholder="名称" v-model="query.Title" clearable size="medium"></el-input>
    <a-range-picker style="width: 250px" v-model:value="query.DateRange" separator="-"></a-range-picker>
    <a-button type="primary" @click="reQuery()">
      <el-icon><search /></el-icon>
      <span>查询</span>
    </a-button>
  </a-space>

  <a-space class="app-tools">
    <a-button type="primary" class="success" danger size="small" @click="openNew()">
      <el-icon><plus /></el-icon>
      <span>添加</span>
    </a-button>
  </a-space>

  <el-table class="app-table" ref="tableRef" :data="list" row-key="ID" highlight-current-row tooltip-effect="dark" header-cell-class-name="app-table-header" border height="100%" @selection-change="selectionChange">
    <el-table-column align="center" type="selection" width="40" :reserve-selection="true" fixed></el-table-column>
    <el-table-column label="序号" align="center" type="index" width="60" fixed :index="comIndex"></el-table-column>
    <el-table-column label="标题" align="center" prop="Title"></el-table-column>
    <el-table-column label="类型" align="center" prop="TypeID" width="80"></el-table-column>
    <el-table-column label="图片" align="center" prop="Pic" width="80">
      <template v-slot="{ row: { Pic } }">
        <div v-if="Pic" class="grid" style="width: 56px; height: 56px; border: 1px solid #ccc; border-radius: 4px; padding: 2px">
          <div style="border-radius: 3px; background-size: cover; background-position: center" :style="{ backgroundImage: picCss(Pic) }"></div>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="背景色" align="center" prop="BackgroundColor" width="140">
      <template v-slot="{ row: { BackgroundColor } }">
        <a-space>
          <div style="border: 1px solid #ccc; border-radius: 3px; padding: 2px">
            <div style="width: 15px; height: 15px; border-radius: 2px" :style="{ background: BackgroundColor }"></div>
          </div>
          <span>{{ BackgroundColor }}</span>
        </a-space>
      </template>
    </el-table-column>
    <el-table-column label="开始时间" align="center" prop="StartDate" width="140"></el-table-column>
    <el-table-column label="结束时间" align="center" prop="EndDate" width="140"></el-table-column>
    <el-table-column label="顺序" align="center" prop="Sorting" width="50"></el-table-column>
    <el-table-column label="状态" align="center" prop="IsEnable" width="70">
      <template v-slot="{ row: { IsEnable } }">
        <span v-if="IsEnable" style="color: green">启用</span>
        <span v-else style="color: red">禁用</span>
      </template>
    </el-table-column>
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

  <el-dialog :title="isEdit ? '编辑' : '添加'" v-model="showEdit" width="800px">
    <el-form ref="editRef" :model="editItem" :rules="editRules" label-width="100px">
      <div class="flex flex-col">
        <div class="flex">
          <div class="flex-1">
            <el-form-item label="名称：" prop="Title">
              <el-input v-model="editItem.Title" size="medium"></el-input>
            </el-form-item>
            <el-form-item label="类型：" prop="TypeID">
              <el-select v-model="editItem.TypeID" placeholder="--请选择--" style="width: 250px" size="medium">
                <el-option v-for="item in adClassify" :key="item.ID" :label="item.Title" :value="item.ID"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="背景色：" prop="BackgroundColor">
              <div class="flex align-center">
                <el-input v-model="editItem.BackgroundColor" size="medium" style="width: 154px; margin-right: 60px"></el-input>
                <el-color-picker v-model="editItem.BackgroundColor"></el-color-picker>
              </div>
            </el-form-item>
          </div>
          <div style="width: 30px"></div>
          <div class="flex-1">
            <el-form-item label="图片：">
              <a-upload action="" list-type="picture-card" v-model:file-list="imgFileList" :beforeUpload="beforeUpload">
                <div v-if="imgFileList.length == 0">
                  <plus-outlined />
                  <div class="ant-upload-text">Upload</div>
                </div>
              </a-upload>
              <!-- <el-upload action="" class="avatar-uploader" ref="upload" :on-change="uploadChange" :on-success="onFileChange" accept="image/png,image/gif,image/jpg,image/jpeg" list-type="picture-card" :auto-upload="false" :limit="1" :file-list="attachList">
                <i class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload> -->
              <span>png图片请转成jpg或压缩后再上传</span>
            </el-form-item>
          </div>
          <div style="width: 30px"></div>
        </div>
        <div class="flex">
          <div class="flex-1">
            <el-form-item label="开始时间：" prop="StartDate">
              <el-date-picker size="medium" v-model="editItem.StartDate" type="date" placeholder="开始时间" value-format="YYYY-MM-DD" style="width: 250px"> </el-date-picker>
            </el-form-item>
            <el-form-item label="顺序：">
              <a-input-number v-model:value="editItem.Sorting"></a-input-number>
            </el-form-item>
            <el-form-item label="状态：" prop="IsEnable">
              <a-radio-group v-model:value="editItem.IsEnable">
                <a-radio :value="true">启用</a-radio>
                <a-radio :value="false">禁用</a-radio>
              </a-radio-group>
            </el-form-item>
          </div>
          <div style="width: 30px"></div>
          <div class="flex-1">
            <el-form-item label="结束时间：" prop="EndDate">
              <el-date-picker size="medium" v-model="editItem.EndDate" type="date" placeholder="结束时间" value-format="YYYY-MM-DD" style="width: 250px"> </el-date-picker>
            </el-form-item>
            <el-form-item label="链接地址：">
              <el-input v-model="editItem.Url" placeholder="http://或https://" size="medium"></el-input>
            </el-form-item>
          </div>
          <div style="width: 30px"></div>
        </div>
      </div>
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
