<script setup lang="ts">
import { ACheckbox } from '../../antd'
import IconFile from '../../common/FragmentUpload/Icons/IconFile.vue'
import IconFileExe from '../../common/FragmentUpload/Icons/IconFileExe.vue'
import IconFileZip from '../../common/FragmentUpload/Icons/IconFileZip.vue'
import IconFileTxt from '../../common/FragmentUpload/Icons/IconFileTxt.vue'
import IconFold from '../../common/FragmentUpload/Icons/IconFold.vue'
import { computed } from 'vue'
import { ElIcon } from 'element-plus'
import { Edit } from '@element-plus/icons'
import { CommonAssetViewModel, FileAssetType } from '../../api/gen/main/types/AdminSystem'

const props = defineProps<{
  f: CommonAssetViewModel
  itemSelect: Set<number>
  foldSelect: Set<number>
}>()

const emit = defineEmits<{
  (type: 'openDir'): void
  (type: 'open'): void
  (type: 'edit'): void
}>()

function onOpen() {
  if (props.f.IsFold) emit('openDir')
  else emit('open')
}

function onEdit() {
  emit('edit')
}

const isSelected = computed(() => (props.f.IsFold ? props.foldSelect.has(props.f.ID) : props.itemSelect.has(props.f.ID)))
function doSelect() {
  if (props.f.IsFold) toggleSelect(props.foldSelect, props.f.ID)
  else toggleSelect(props.itemSelect, props.f.ID)
}
function toggleSelect(set: Set<number>, id: number) {
  if (set.has(id)) set.delete(id)
  else set.add(id)
}
</script>

<template>
  <div class="file-asset-item grid" @dblclick="onOpen">
    <div class="cover" @click.stop="doSelect">
      <div class="bg" v-if="!f.IsFold && (f.TypeID == FileAssetType.Image || f.TypeID == FileAssetType.Video)"></div>
      <div class="icon" v-if="f.IsFold"><IconFold /></div>
      <div class="icon" v-else-if="f.TypeID == FileAssetType.Exe"><IconFileExe /></div>
      <div class="icon" v-else-if="f.TypeID == FileAssetType.Zip"><IconFileZip /></div>
      <div class="icon" v-else-if="f.TypeID == FileAssetType.Text"><IconFileTxt /></div>
      <video v-else-if="f.TypeID == FileAssetType.Video" :src="f.Url" muted autoplay loop />
      <img v-else-if="f.TypeID == FileAssetType.Image" :src="f.Url" />
      <div v-else class="icon"><IconFile /></div>
    </div>
    <div class="select" @click.stop="doSelect">
      <a-checkbox :checked="isSelected"></a-checkbox>
    </div>
    <div class="edit" title="编辑" @dblclick.stop @click.stop="onEdit">
      <el-icon class="icon"><edit /></el-icon>
    </div>
    <div class="name" :title="f.Name">{{ f.Name }}</div>
  </div>
</template>

<style lang="scss" scoped>
.file-asset-item {
  --cover-size: 100px;
  --border-radius: 9px;
  grid-template-columns: 1fr;
  grid-template-rows: auto auto;

  > .cover {
    grid-area: 1 / 1;
    width: var(--cover-size);
    height: var(--cover-size);
    font-size: 50px;
    border: 1px solid #ccc;
    border-radius: var(--border-radius);
    display: grid;
    overflow: hidden;
    background: #fff;
    transition: background 0.25s, border 0.25s;
    cursor: pointer;

    > * {
      grid-area: 1 / 1;
      place-self: center;
      z-index: 5;
      cursor: pointer;
    }
    > video,
    > img {
      max-width: var(--cover-size);
      max-height: var(--cover-size);
      object-fit: contain;
      object-position: center;
      border-radius: var(--border-radius);
    }
    > video {
      width: var(--cover-size);
      height: var(--cover-size);
    }

    > .bg {
      z-index: 0;
      width: 100%;
      height: 100%;
      background: url(../../assets/transparent_bg.png);
      background-position: center;
      background-size: 10px;
      image-rendering: pixelated;
      opacity: 0.5;
    }

    > .icon {
      pointer-events: none;
    }
  }

  > .name {
    grid-area: 2 / 1;
    width: var(--cover-size);
    height: 18px * 2;
    text-align: center;
    font-size: 14px;
    line-height: 18px;
    padding: 3px;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  &:hover {
    > .cover {
      border-color: #409eff;
      background: #ecf5ff;
    }
  }

  > .select {
    grid-area: 1 / 1;
    margin: 10px;
    z-index: 10;
    place-self: flex-start;
    cursor: pointer;
  }

  > .edit {
    grid-area: 1 / 1;
    z-index: 10;
    place-self: flex-end;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin: 5px;
    width: 22px;
    height: 22px;
    background: rgba(0, 0, 0, 0.25);
    border-radius: var(--border-radius);
    border-top-left-radius: var(--border-radius);
    color: #fff;
    font-size: 16px;
    opacity: 0;
    transition: opacity 0.25s, transform 0.25s;

    > .icon {
      pointer-events: none;
    }

    &:hover {
      transform: scale(1.1);
    }
  }

  &:hover {
    > .edit {
      opacity: 1;
    }
  }
}
</style>
