<script setup lang="ts">
import { RouterView } from 'vue-router'
import { AConfigProvider } from './antd'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { initStore } from './store'

initStore()
</script>

<template>
  <a-config-provider :locale="zhCN">
    <router-view></router-view>
  </a-config-provider>
</template>

<style lang="scss">
.col-1 {
  grid-column: 1;
}
.row-1 {
  grid-row: 1;
}

html,
body,
#app {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #333333;
}
#app,
body {
  .ant-form-item-label > label {
    color: #555555;
  }

  .ant-calendar-range-picker-input {
    &::placeholder {
      color: #c0c4cc;
    }
  }

  .ant-input,
  .ant-input-number,
  .ant-select,
  .ant-select-selector,
  .ant-btn,
  .ant-input-affix-wrapper {
    border-radius: 4px;
    height: 36px;
    font-size: 14px;

    border-color: #dcdfe6;

    &:hover {
      border-color: #40a9ff;
    }

    &:focus {
      border-color: #40a9ff;
    }

    &::placeholder {
      color: #c0c4cc;
    }

    &.ant-input-affix-wrapper-textarea-with-clear-btn {
      height: unset;
    }
  }

  .ant-form-item-has-error .ant-input,
  .ant-form-item-has-error .ant-input-number {
    border-color: #ff4d4f;

    &:hover {
      border-color: #ff4d4f;
    }

    &:focus {
      border-color: #ff4d4f;
    }
  }

  .ant-input-number {
    width: 100%;

    > .ant-input-number-input-wrap {
      height: 100%;

      > .ant-input-number-input {
        height: 100%;
      }
    }
  }

  .ant-input-affix-wrapper {
    > .ant-input {
      height: unset;
    }
  }

  .ant-select {
    .ant-select-selection-search-input {
      height: 100%;
      display: flex;
      align-items: center;
    }

    .ant-select-selection-item,
    .ant-select-selection-placeholder {
      display: flex;
      align-items: center;
    }

    .ant-select-selection-search-input,
    .ant-select-selection-item {
      color: #555555;
    }
  }

  .ant-btn {
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    border: 1px solid #dcdfe6;
    color: #606266;

    &:hover {
      color: #409eff;
      border-color: #c6e2ff;
      background-color: #ecf5ff;
    }

    &:active {
      color: #3a8ee6;
      border-color: #3a8ee6;
    }

    > .el-icon {
      margin-right: 5px;
    }

    &.ant-btn-sm {
      padding: 0 15px;
      height: 32px;
      font-size: 12px;
      border-radius: 3px;
    }

    &.plain {
      &:hover {
        color: #66b1ff;
        background: #ffffff;
        border-color: #66b1ff;
      }

      &:active {
        color: #3a8ee6;
        background: #ffffff;
        border-color: #3a8ee6;
      }

      &.success,
      &.green {
        color: #67c23a;
        background: #f0f9eb;
        border-color: #c2e7b0;

        &:hover {
          color: #fcfcfc;
          background: #67c23a;
          border-color: #67c23a;
        }

        &:active {
          color: #e6e6e6;
          background: #5daf34;
          border-color: #5daf34;
        }
      }

      &.primary,
      &.blue {
        color: #409eff;
        border-color: #c6e2ff;
        background-color: #ecf5ff;

        &:hover {
          color: #fcfcfc;
          background: #66b1ff;
          border-color: #66b1ff;
        }

        &:active {
          color: #e6e6e6;
          background: #3a8ee6;
          border-color: #3a8ee6;
        }
      }

      &.gray,
      &.info {
        color: #909399;
        border-color: #d3d4d6;
        background-color: #f4f4f5;

        &:hover {
          color: #fcfcfc;
          background: #909399;
          border-color: #909399;
        }

        &:active {
          color: #e6e6e6;
          background: #82848a;
          border-color: #82848a;
        }
      }

      &.yellow,
      &.warning {
        color: #e6a23c;
        border-color: #f5dab1;
        background-color: #fdf6ec;

        &:hover {
          color: #fcfcfc;
          background: #e6a23c;
          border-color: #e6a23c;
        }

        &:active {
          color: #e6e6e6;
          background: #cf9236;
          border-color: #cf9236;
        }
      }

      &.red,
      &.danger {
        color: #f56c6c;
        border-color: #fbc4c4;
        background-color: #fef0f0;

        &:hover {
          color: #fcfcfc;
          background: #f56c6c;
          border-color: #f56c6c;
        }

        &:active {
          color: #e6e6e6;
          background: #dd6161;
          border-color: #dd6161;
        }
      }
    }
  }

  .ant-btn-primary {
    background: #409eff;
    border-color: #409eff;
    color: #fcfcfc;
    text-shadow: none;

    &:hover {
      color: #fcfcfc;
      background: #66b1ff;
      border-color: #66b1ff;
    }

    &:active {
      color: #e6e6e6;
      background: #3a8ee6;
      border-color: #3a8ee6;
    }

    &.plain {
      color: #409eff;
      border-color: #c6e2ff;
      background-color: #ecf5ff;

      &:hover {
        color: #fcfcfc;
        background: #66b1ff;
        border-color: #66b1ff;
      }

      &:active {
        color: #e6e6e6;
        background: #3a8ee6;
        border-color: #3a8ee6;
      }
    }

    &.red,
    &.ant-btn-dangerous {
      background: #f56c6c;
      border-color: #f56c6c;

      &:hover {
        background: #f78989;
        border-color: #f78989;
      }

      &:active {
        background: #dd6161;
        border-color: #dd6161;
      }
    }

    &.success,
    &.green {
      background: #67c23a;
      border-color: #67c23a;

      &:hover {
        background: #85ce61;
        border-color: #85ce61;
      }

      &:active {
        background: #5daf34;
        border-color: #5daf34;
      }
    }

    &.info,
    &.gray {
      background: #909399;
      border-color: #909399;

      &:hover {
        background: #a6a9ad;
        border-color: #a6a9ad;
      }

      &:active {
        background: #82848a;
        border-color: #82848a;
      }
    }

    &.yellow,
    &.warning {
      background: #e6a23c;
      border-color: #e6a23c;

      &:hover {
        background: #ebb563;
        border-color: #ebb563;
      }

      &:active {
        background: #cf9236;
        border-color: #cf9236;
      }
    }
  }

  .ant-calendar-range-picker-separator {
    vertical-align: middle;
    line-height: unset;
  }
}

#app {
  .app-top {
    padding: 10px 0;
  }

  .app-foot {
    padding: 10px 0;
  }

  .app-tools {
    background-color: #f5fafe;
    display: flex;
    justify-content: flex-end;
    padding: 10px;
  }

  .app-table {
    flex: 1;

    .el-checkbox {
      height: unset;
    }

    .el-table__cell {
      padding: 8px 0;
    }
  }

  .app-table-header {
    text-align: center;
    background: #eef1f6;
    color: #606266;
  }
}

.el-dialog {
  min-width: 700px;
}

body {
  .ant-select-dropdown {
    z-index: 3050;
  }
}

.ant-switch.app-state {
  &:not(.ant-switch-checked) {
    background: #f56c6c;

    &.ant-switch:focus {
      box-shadow: 0 0 0 2px rgb(245 108 108 / 20%);
    }
  }
}

body {
  .el-input__inner {
    transition: all 0.3s;

    &:hover {
      border-color: #40a9ff;
    }

    &:focus {
      border-color: #40a9ff;
      border-right-width: 1px !important;
      outline: 0;
      box-shadow: 0 0 0 2px rgb(24 144 255 / 20%);
    }
  }

  .el-form-item.is-error .el-input__inner {
    &:focus {
      border-color: #ff7875;
      border-right-width: 1px !important;
      outline: 0;
      box-shadow: 0 0 0 2px #ff4d4f33;
    }
  }
}

#app,
body {
  .ant-radio,
  .ant-radio-wrapper {
    color: #606266;
  }

  .ant-radio-checked .ant-radio-inner {
    border-color: #409eff;
  }

  .ant-radio-inner::after {
    background: #409eff;
  }

  .el-select {
    --el-select-border-color-hover: #40a9ff;
  }

  .ant-input-number.ant-input-number-focused,
  .ant-select.ant-select-focused,
  .ant-select.ant-select-focused .ant-select-selector {
    border-color: #40a9ff;
  }
}

#app {
  .el-table__header {
    background: #eef1f6;
  }
}

body, #app {
  .ant-input-affix-wrapper.ant-input-affix-wrapper-focused {
    border-color: #409eff;
  }
}
</style>
