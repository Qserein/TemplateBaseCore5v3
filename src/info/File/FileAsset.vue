<script setup lang="ts">
import { ASpace, AInput, AButton, ACheckbox } from '../../antd'
import { Search, Plus, Delete, Upload, FolderOpened, Right } from '@element-plus/icons'
import UiTree from '../../components/UiTree/UiTree.vue'
import { computed, reactive, ref, watch } from 'vue'
import { UiTreeExpose, useUiTreeData } from '../../components/UiTree/UiTree'
import { guard } from 'libsugar/fn'
import { ElMessage, ElInput, ElDialog, ElForm, ElFormItem, ElSelect, ElOption, ElIcon, ElPagination } from 'element-plus'
import UiLoadingBox from '../../components/UiLoading/UiLoadingBox.vue'
import { calcByteSize, useQueue } from '../../utils'
import { reactiveRef } from '../../utils/reactive'
import FragmentUpload from '../../common/FragmentUpload'
import FileAssetItem from './FileAssetItem.vue'
import api from '../../api'
import { seq } from 'libsugar/seq'
import UiBgCover from '../../components/UiBgCover/UiBgCover.vue'
import PreViewContent from './PreViewContent.vue'
import { ApiResult, CommonAssetViewEditModel, CommonAssetViewModel, FileAssetListViewModel, FileAssetType, FoldAssetViewModel } from '../../api/gen/main/types/AdminSystem'
import { GetParams } from '../../api/gen/main/api'

const query = reactiveRef<GetParams['/api/FileAsset/List']>({
  IsEnable: true,
})

type TreeNode = Omit<FoldAssetViewModel, 'HasChild'> & { Child?: TreeNode[] } & { HasChild?: boolean }

const tree = ref<UiTreeExpose>(null!)
const currentDir = ref(0)
const data = useUiTreeData({
  root: guard<TreeNode[]>([{ ID: 0, FID: 0, Name: '根目录', HasChild: void 0 }]),
  expand: new Set([0]),
  map: new Map<number, TreeNode>(),
  prop: {
    key: 'ID',
    title: 'Name',
    child: 'Child',
    hasChild: 'HasChild',
  },
  line: true,
  async getData(obj: TreeNode) {
    const d = await getData(obj.ID)
    if (d) {
      obj.Child = d
      obj.HasChild = d.length > 0
    } else {
      obj.HasChild = false
    }
  },
})

const currentPath = computed(() => {
  function* doGet(id: number): Iterable<TreeNode> {
    if (id == 0) return yield { ID: 0, FID: 0, Name: '根目录', HasChild: void 0 }
    const node = data.map.get(id)!
    if (node == null) return yield { ID: 0, FID: 0, Name: '根目录', HasChild: void 0 }
    else {
      yield* doGet(node.FID)
      yield node
    }
  }
  return [...doGet(currentDir.value)]
})

function backToUplevel() {
  if (currentDir.value == 0) return
  const node = data.map.get(currentDir.value)!
  if (node == null) return
  openDir(node.FID)
}

async function reSetUiTree() {
  await tree.value.initData()
}

function openDir(id: number) {
  data.expand!.add(id)
  currentDir.value = id
  openAllParent(id)
}

function openAllParent(id: number) {
  if (id == 0) return
  const node = data.map.get(currentDir.value)!
  if (node == null) return
  data.expand!.add(node.FID)
  openAllParent(node.FID)
}

/** 获取目录 */
async function getData(FID: number) {
  const r = await api.main['/api/FileAsset/Fold'].get(
    guard<GetParams['/api/FileAsset/Fold']>({
      FID,
      IsEnable: query.IsEnable,
    })
  )
  if (r.success) {
    return r.data ?? []
  } else {
    ElMessage.error(r.msg || '获取失败')
  }
}

/** 选中的项 */
const itemSelect = ref(new Set<number>())
const foldSelect = ref(new Set<number>())
const selectedCount = computed(() => itemSelect.value.size + foldSelect.value.size)
const isAllSelected = computed(() => list.value.length > 0 && selectedCount.value >= list.value.length)
const isAnySelected = computed(() => selectedCount.value < list.value.length && selectedCount.value > 0)

function clearSelect() {
  itemSelect.value.clear()
  foldSelect.value.clear()
}

function selectAll(v: boolean) {
  if (v) {
    for (const f of list.value) {
      if (f.IsFold) foldSelect.value.add(f.ID)
      else itemSelect.value.add(f.ID)
    }
  } else {
    clearSelect()
  }
}

/** 分页 */
const page = reactive({
  pageIndex: 1, // 第几页
  pageSize: 15, // 页大小
  total: 0, // 总共几条
})

/** 在当前目录搜索 */
const q = ref('')

const [loading, queue] = useQueue()

const list = ref<CommonAssetViewModel[]>([])

reQuery()
async function reQuery() {
  clearSelect()
  await doQuery()
}
async function reQueryWithTree() {
  clearSelect()
  await Promise.all([reSetUiTree(), reQuery()])
}

async function doQuery() {
  await queue(async () => {
    const r = await api.main['/api/FileAsset/List'].get(
      guard<GetParams['/api/FileAsset/List']>({
        ...query,
        FoldID: currentDir.value,
        Name: q.value,
        PageIndex: page.pageIndex,
        PageSize: page.pageSize,
      })
    )
    if (r.success) {
      list.value = r.data ?? []
      page.pageSize = r.size
      page.total = r.count
    } else {
      ElMessage.error(r.msg || '获取失败')
    }
  })
}

watch(currentDir, () => {
  reQuery()
})

//#region 批量删除

/** 批量删除 */
async function batchDel() {
  await queue(
    async success => {
      const ps: Promise<ApiResult>[] = []
      if (itemSelect.value.size) {
        ps.push(api.main['/api/FileAsset'].del([...itemSelect.value]))
      }
      if (foldSelect.value.size) {
        ps.push(api.main['/api/FileAsset/Fold'].del([...foldSelect.value]))
      }
      const rs = await Promise.all(ps)
      for (const r of rs) {
        if (!r.success) ElMessage.error(r.msg || '删除失败')
      }
      if (seq(rs).all(i => i.success)) {
        ElMessage.success('删除成功')
      }
      for (const r of rs) {
        if (r.success) {
          success()
          break
        }
      }
    },
    async () => {
      for (const f of foldSelect.value) {
        data.expand!.delete(f)
      }
      await reQueryWithTree()
    }
  )
}

// #endregion

async function openUpload() {
  await FragmentUpload.open({
    fold: currentDir.value,
    multiple: true,
  })
}

//#region 新建目录
const showNewFoldDialog = ref(false)
const showNewFoldKey = ref(0)
function openNewFoldDialog() {
  showNewFoldDialog.value = true
  showNewFoldKey.value++
  newFold.Name = ''
}
function closeNewFoldDialog() {
  showNewFoldDialog.value = false
}
const newFold = reactive({
  Name: '',
})
const newFoldRules = reactive({
  Name: [{ required: true, message: '请输入目录名', trigger: 'blur' }],
})
async function saveNewFold() {
  if (!newFold.Name?.trim()) return void ElMessage.warning('请先填写目录名')
  await queue(
    async success => {
      const r = await api.main['/api/FileAsset/Fold'].post({
        FID: currentDir.value,
        Name: newFold.Name,
      })
      if (r.success) {
        ElMessage.success('创建成功')
        closeNewFoldDialog()
        success()
      } else {
        ElMessage.error(r.msg || '创建失败')
      }
    },
    async () => {
      data.expand!.add(currentDir.value)
      await reQueryWithTree()
    }
  )
}
//#endregion

//#region 编辑
const showEditDialog = ref(false)
const editRules = {
  Name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
}
const editItem = ref<CommonAssetViewEditModel>({
  ID: 0,
  IsFold: false,
  TypeID: FileAssetType.Image,
  IsEnable: true,
})
function openEdit(f: CommonAssetViewModel) {
  showEditDialog.value = true
  editItem.value = {
    ID: f.ID,
    Name: f.Name,
    IsFold: f.IsFold,
    TypeID: f.TypeID,
    IsEnable: f.IsEnable,
  }
}
function closeEdit() {
  showEditDialog.value = false
}
async function saveEdit() {
  await queue(
    async success => {
      const r = await api.main['/api/FileAsset/Edit'].put({ ...editItem.value })
      if (r.success) {
        ElMessage.success('编辑成功')
        closeEdit()
        success()
      } else {
        ElMessage.error(r.msg || '编辑失败')
      }
    },
    async () => {
      await reQueryWithTree()
    }
  )
}
//#endregion

//#region 预览
const showPreview = ref(false)
const preview = ref<FileAssetListViewModel>({
  ID: 0,
  TypeID: FileAssetType.Image,
  Size: 0,
  Width: 0,
  Height: 0,
  UserID: 0,
  IsEnable: true,
})
async function openPreview(f: CommonAssetViewModel) {
  if (f.IsFold) return
  await queue(async () => {
    const r = await api.main['/api/FileAsset/Info/{ID}'].get({ ID: f.ID })
    if (r.success) {
      preview.value = r.data
      showPreview.value = true
    } else {
      ElMessage.error(r.msg || '获取详情失败')
    }
  })
}
function closePreview() {
  showPreview.value = false
}
//#endregion

//#region 移动到
const moveTree = useUiTreeData({
  root: guard<TreeNode[]>([{ ID: 0, FID: 0, Name: '根目录', HasChild: void 0 }]),
  expand: new Set([0]),
  prop: {
    key: 'ID',
    title: 'Name',
    child: 'Child',
    hasChild: 'HasChild',
  },
  line: true,
  async getData(obj: TreeNode) {
    const d = await getData(obj.ID)
    if (d) {
      obj.Child = d
      obj.HasChild = d.length > 0
    } else {
      obj.HasChild = false
    }
  },
})
const moveDir = ref(0)
const moveKey = ref(0)
const showMoveDialog = ref(false)
function openMove() {
  showMoveDialog.value = true
  moveDir.value = currentDir.value
  moveTree.expand = new Set(currentPath.value.map(i => i.ID))
  moveKey.value++
}
function closeMove() {
  showMoveDialog.value = false
}
async function doMove() {
  await queue(
    async success => {
      const r = await api.main['/api/FileAsset/Move'].post({
        TargetFoldID: moveDir.value,
        FoldIDs: [...foldSelect.value],
        FileIDs: [...itemSelect.value],
      })
      if (r.success) {
        ElMessage.success('移动成功')
        closeMove()
        success()
      } else {
        ElMessage.error(r.msg || '移动失败')
      }
    },
    async () => {
      reQueryWithTree()
    }
  )
}
//#endregion
</script>

<template>
  <div id="file-asset" class="grid">
    <ui-loading-box class="box" :show="loading" large>
      <div class="box grid">
        <div class="left">
          <div class="box">
            <ui-tree ref="tree" :data="data" v-model:current="currentDir"></ui-tree>
          </div>
        </div>
        <div class="right grid">
          <div class="top flex items-center">
            <a-space class="app-top flex items-center">
              <el-select placeholder="状态" style="width: 100px" v-model="query.IsEnable" clearable size="medium">
                <el-option label="启用" :value="true" />
                <el-option label="禁用" :value="false" />
              </el-select>
              <el-select placeholder="类型" style="width: 100px" v-model="query.Type" clearable size="medium">
                <el-option label="图片" :value="FileAssetType.Image" />
                <el-option label="视频" :value="FileAssetType.Video" />
                <el-option label="音频" :value="FileAssetType.Audio" />
                <el-option label="文本" :value="FileAssetType.Text" />
                <el-option label="压缩包" :value="FileAssetType.Zip" />
                <el-option label="可执行" :value="FileAssetType.Exe" />
                <el-option label="其他" :value="FileAssetType.File" />
              </el-select>
              <a-input class="w-200px" placeholder="在当前目录搜索" allow-clear v-model:value="q"></a-input>
              <a-button class="w-70px" type="primary" @click="reQueryWithTree()">
                <el-icon><search /></el-icon>
                <span>搜索</span>
              </a-button>
            </a-space>
            <div class="flex-1"></div>
            <a-space class="app-top flex items-center">
              <a-button class="w-100px" type="primary" @click="openNewFoldDialog()">
                <el-icon><plus /></el-icon>
                <span>新建目录</span>
              </a-button>
              <a-button class="w-70px green" type="primary" @click="openUpload()">
                <el-icon><upload /></el-icon>
                <span>上传</span>
              </a-button>
            </a-space>
          </div>
          <div class="path flex">
            <a-button class="uplevel" shape="circle" :disabled="!currentDir" title="返回上一级" @click="backToUplevel()">
              <template #icon>
                <el-icon><right /></el-icon>
              </template>
            </a-button>
            <div class="paths">
              <template v-for="(p, i) of currentPath">
                <span class="line" v-if="i"> / </span>
                <span class="item" @click="openDir(p.ID)">{{ p.Name }}</span>
              </template>
            </div>
          </div>
          <div class="tools flex items-center pl-15px gap-10px min-h-32px">
            <a-checkbox :checked="isAllSelected" :indeterminate="isAnySelected" class="slected" @update:checked="selectAll">
              <span>已选 {{ selectedCount }} 项</span>
            </a-checkbox>
            <template v-if="isAllSelected || isAnySelected">
              <a-button type="primary" class="red" danger size="small" @click="batchDel()">
                <el-icon><delete /></el-icon>
                <span>删除</span>
              </a-button>
              <a-button type="primary" class="yellow" size="small" @click="openMove()">
                <el-icon><folder-opened /></el-icon>
                <span>移动到</span>
              </a-button>
            </template>
          </div>
          <div class="items flex flex-wrap gap-10px p-15px">
            <file-asset-item v-for="f in list" :key="f.Key" :f="f" @open-dir="openDir(f.ID)" :item-select="itemSelect" :fold-select="foldSelect" @edit="openEdit(f)" @open="openPreview(f)" />
          </div>
          <div class="app-foot flex justify-center">
            <el-pagination background layout="total, prev, pager, next, jumper" :page-size="page.pageSize" :total="page.total" v-model:current-page="page.pageIndex" @current-change="doQuery()"></el-pagination>
          </div>
        </div>
      </div>
    </ui-loading-box>
    <el-dialog v-model="showNewFoldDialog" title="新建目录" width="600px" top="15%">
      <div class="pr-50px" :key="showNewFoldKey">
        <el-form ref="editRef" :model="newFold" :rules="newFoldRules" label-width="100px">
          <el-form-item label="名称：" prop="Name">
            <el-input v-model="newFold.Name" size="medium" maxlength="100" show-word-limit></el-input>
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <div class="flex justify-center items-center">
          <a-space>
            <a-button type="primary" @click="saveNewFold()">确定</a-button>
            <a-button @click="closeNewFoldDialog()">取消</a-button>
          </a-space>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="showEditDialog" title="编辑" width="600px" top="15%">
      <div class="pr-50px">
        <el-form ref="editRef" :model="editItem" :rules="editRules" label-width="100px">
          <el-form-item label="名称：" prop="Name">
            <el-input v-model="editItem.Name" size="medium"></el-input>
          </el-form-item>
          <el-form-item label="类型：" prop="TypeID" v-if="!editItem.IsFold">
            <el-select class="w-full" placeholder="类型" v-model="editItem.TypeID" clearable size="medium">
              <el-option label="图片" :value="FileAssetType.Image" />
              <el-option label="视频" :value="FileAssetType.Video" />
              <el-option label="音频" :value="FileAssetType.Audio" />
              <el-option label="文本" :value="FileAssetType.Text" />
              <el-option label="压缩包" :value="FileAssetType.Zip" />
              <el-option label="可执行" :value="FileAssetType.Exe" />
              <el-option label="其他" :value="FileAssetType.File" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态：" prop="IsEnable">
            <a-switch class="app-state" v-model:checked="editItem.IsEnable" checked-children="启用" un-checked-children="禁用" />
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <div class="flex justify-center items-center">
          <a-space>
            <a-button type="primary" @click="saveEdit()">修改</a-button>
            <a-button @click="closeEdit()">取消</a-button>
          </a-space>
        </div>
      </template>
    </el-dialog>
    <ui-bg-cover v-model:show="showPreview">
      <div id="file-asset-preview" class="grid" @click="closePreview()">
        <div class="top grid">
          <div class="name" :title="preview.Name">{{ preview.Name }}</div>
          <div class="meta flex flex-wrap gap-x-30px items-center">
            <div class="item">
              <span>类型：</span>
              <span v-if="preview.TypeID == FileAssetType.Image">图片</span>
              <span v-else-if="preview.TypeID == FileAssetType.Video">视频</span>
              <span v-else-if="preview.TypeID == FileAssetType.Audio">音频</span>
              <span v-else-if="preview.TypeID == FileAssetType.Text">文本</span>
              <span v-else-if="preview.TypeID == FileAssetType.Zip">压缩包</span>
              <span v-else-if="preview.TypeID == FileAssetType.Exe">可执行</span>
              <span v-else>其他</span>
            </div>
            <div class="item" :title="`${preview.Size} 字节`">大小：{{ calcByteSize(preview.Size) }}</div>
            <template v-if="preview.TypeID == FileAssetType.Image || preview.TypeID == FileAssetType.Video">
              <div class="item">宽度：{{ preview.Width }} px</div>
              <div class="item">高度：{{ preview.Height }} px</div>
            </template>
            <div class="item" v-if="preview.User">上传人：{{ preview.User }}</div>
            <div class="item" v-if="preview.AddDate">创建日期：{{ preview.AddDate }}</div>
            <div class="item" v-if="preview.UploadedDate">上传日期：{{ preview.UploadedDate }}</div>
            <div class="item">
              <span>状态：</span>
              <span v-if="preview.IsEnable">启用</span>
              <span v-else>禁用</span>
            </div>
          </div>
        </div>
        <pre-view-content :f="preview"></pre-view-content>
        <div class="bottom"></div>
      </div>
    </ui-bg-cover>
    <el-dialog v-model="showMoveDialog" title="移动到" width="600px">
      <div class="box max-h-600px overflow-auto" :key="moveKey">
        <ui-tree :data="moveTree" v-model:current="moveDir"></ui-tree>
      </div>
      <template #footer>
        <div class="flex justify-center items-center">
          <a-space>
            <a-button type="primary" @click="doMove()">确定</a-button>
            <a-button @click="closeMove()">取消</a-button>
          </a-space>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
#file-asset {
  width: 100%;
  height: 100%;

  > .box {
    > .box {
      > .box {
        width: 100%;
        height: 100%;
        grid-template-columns: 300px 1fr;

        > .left {
          grid-area: 1 / 1;
          display: grid;
          padding: 15px 0;
          padding-right: 15px;

          > .box {
            width: 100%;
            height: 100%;
            display: grid;
            overflow: auto;

            > .tree {
              width: 100%;
              height: 100%;
            }
          }
        }
        > .right {
          grid-area: 1 / 2;
          border-left: 1px solid #eee;
          padding: 5px 15px;
          grid-template-rows: auto auto auto 1fr auto;

          > .path {
            padding: 3px 0;
            gap: 9px;
            align-items: center;
            font-size: 14px;

            > .uplevel {
              min-width: 26px;
              width: 26px;
              height: 26px;
              border-radius: 10000px;
              padding: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              border-color: transparent;
              background: #fff;
              box-shadow: none;

              > .el-icon {
                font-size: 18px;
                transform: rotateY(180deg);
              }

              &:disabled {
                color: #ccc;
              }
            }

            > .paths {
              color: #999;

              > .item {
                transition: color 0.25s;
              }

              > .item:not(:last-child) {
                cursor: pointer;

                &:hover {
                  color: #409eff;
                }
              }
              > .line {
                color: #666;
              }
              > :last-child {
                color: #333;
              }
            }
          }

          > .items {
            align-self: flex-start;
          }
        }
      }
    }
  }
}
#file-asset-preview {
  width: 100%;
  height: 100%;
  grid-template-rows: auto 1fr auto;

  > .top {
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), transparent);
    justify-content: center;
    color: #ececec;
    text-shadow: 0 0 3px rgba(0, 0, 0, 1);
    padding: 9px 18px;
    gap: 9px;

    > .name {
      font-size: 26px;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: center;
    }

    > .meta {
      font-size: 14px;
    }
  }
}
</style>
