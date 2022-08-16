<script setup lang="ts">
import IconFile from '../../common/FragmentUpload/Icons/IconFile.vue'
import IconFileExe from '../../common/FragmentUpload/Icons/IconFileExe.vue'
import IconFileZip from '../../common/FragmentUpload/Icons/IconFileZip.vue'
import IconFileTxt from '../../common/FragmentUpload/Icons/IconFileTxt.vue'
import { FileAssetListViewModel, FileAssetType } from '../../api/gen/main/types/AdminSystem'

const props = defineProps<{
  f: FileAssetListViewModel
}>()
</script>

<template>
  <div class="content">
    <div class="icon" v-if="f.TypeID == FileAssetType.Exe"><IconFileExe /></div>
    <div class="icon" v-else-if="f.TypeID == FileAssetType.Zip"><IconFileZip /></div>
    <div class="icon" v-else-if="f.TypeID == FileAssetType.Text"><IconFileTxt /></div>
    <video @click.stop v-else-if="f.TypeID == FileAssetType.Video" :src="f.Url" controls autoplay loop />
    <audio @click.stop v-else-if="f.TypeID == FileAssetType.Audio" :src="f.Url" controls autoplay loop />
    <img v-else-if="f.TypeID == FileAssetType.Image" :src="f.Url" />
    <div v-else class="icon"><IconFile /></div>
  </div>
</template>

<style lang="scss" scoped>
.content {
  width: 100%;
  height: 100%;
  display: grid;

  > * {
    grid-area: 1 / 1;
    place-self: center;
  }
  > video,
  > img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    object-position: center;
    z-index: 10;
    place-self: center;
  }

  > .icon {
    font-size: 100px;
  }
}
</style>
