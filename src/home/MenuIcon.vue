<script setup lang="ts">
import { ControlOutlined, PieChartOutlined, SettingOutlined, FireOutlined, FileTextOutlined, AppstoreOutlined, HomeOutlined, DesktopOutlined, DeploymentUnitOutlined, PartitionOutlined, DatabaseOutlined } from '@ant-design/icons-vue'
defineProps<{
  icon: string
}>()
</script>

<template>
  <HomeOutlined v-if="icon == 'home'" />
  <ControlOutlined v-else-if="icon == 'control-outlined'" />
  <AppstoreOutlined v-else-if="icon == 'appstore-outlined'" />
  <SettingOutlined v-else-if="icon == 'el-icon-s-tools' || icon == 'setting-outlined'" />
  <FireOutlined v-else-if="icon == 'el-icon-orange' || icon == 'fire-outlined'" />
  <FileTextOutlined v-else-if="icon == 'el-icon-notebook-2' || icon == 'file-text-outlined'" />
  <DesktopOutlined v-else-if="icon == 'desktop-outlined'" />
  <DeploymentUnitOutlined v-else-if="icon == 'deployment-unit-outlined'" />
  <PartitionOutlined v-else-if="icon == 'partition-outlined'" />
  <DatabaseOutlined v-else-if="icon === 'database-outlined'" />
  <PieChartOutlined v-else />
</template>

<style lang="scss"></style>
