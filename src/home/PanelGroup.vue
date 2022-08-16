<script setup lang="ts">
import { ContactsFilled, FireFilled, FileTextFilled, PieChartFilled } from '@ant-design/icons-vue'
import { reactive } from 'vue'
import { aget } from '../api'
import { ApiResult } from '../api/def'
import CountTo from '../common/Ani/CountTo.vue'

const data = reactive({
  UsersCount: 0,
  ArticleCount: 0,
  AdvertCount: 0,
})

async function getUsersCount() {
  const res = await aget<ApiResult<number>>('/api/Admin/Welcome/UsersCount')
  data.UsersCount = res.data
}
async function getArticleCount() {
  const res = await aget<ApiResult<number>>('/api/Admin/Welcome/ArticleCount')
  data.ArticleCount = res.data
}
async function getAdvertCount() {
  const res = await aget<ApiResult<number>>('/api/Admin/Welcome/AdvertCount')
  data.AdvertCount = res.data
}

getData()
async function getData() {
  await Promise.all([getUsersCount(), getArticleCount(), getAdvertCount()])
}
</script>

<template>
  <div class="panel-group grid grid-cols-4 grid-rows-1 gap-5">
    <div class="item green">
      <div class="icon">
        <ContactsFilled />
      </div>
      <div class="info">
        <div class="title">用户数</div>
        <div class="value">
          <CountTo :value="data.UsersCount" :split="4"></CountTo>
        </div>
      </div>
    </div>
    <div class="item red">
      <div class="icon">
        <FireFilled />
      </div>
      <div class="info">
        <div class="title">广告数</div>
        <div class="value">
          <CountTo :value="data.AdvertCount" :split="4"></CountTo>
        </div>
      </div>
    </div>
    <div class="item blue">
      <div class="icon">
        <FileTextFilled />
      </div>
      <div class="info">
        <div class="title">文章数</div>
        <div class="value"><CountTo :value="data.ArticleCount" :split="4"></CountTo></div>
      </div>
    </div>
    <div class="item yellow">
      <div class="icon">
        <PieChartFilled />
      </div>
      <div class="info">
        <div class="title">其他</div>
        <div class="value"><CountTo :value="123456" :split="4"></CountTo></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.panel-group {
  $item-size: 80px;

  > .item {
    height: $item-size + 30px;
    background: #fff;
    box-shadow: 2px 2px 20px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    display: grid;
    padding: 15px;

    > .info {
      grid-column: 2;
      grid-row: 1;
      justify-self: flex-end;
      align-self: center;
      display: grid;
      gap: 10px;
      text-align: right;
      padding-right: 20px;
      font-weight: bold;

      > .title {
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
      }

      > .value {
        color: #666666;
        font-size: 20px;
      }
    }

    > .icon {
      grid-column: 1;
      grid-row: 1;
      align-self: center;
      width: $item-size;
      height: $item-size;
      display: grid;
      font-size: $item-size * 0.5;
      border-radius: 7px;
      transition: color 0.25s, background 0.25s, box-shadow 0.55s;

      > * {
        justify-self: center;
        align-self: center;
      }
    }

    &.red {
      > .icon {
        color: #f56c6c;
      }

      &:hover {
        > .icon {
          background: #f56c6c;
          color: #fcfcfc;
          box-shadow: 0 0 0 5px #f56c6c33;
        }
      }
    }

    &.green {
      > .icon {
        color: #67c23a;
      }

      &:hover {
        > .icon {
          background: #67c23a;
          color: #fcfcfc;
          box-shadow: 0 0 0 5px #67c23a33;
        }
      }
    }

    &.blue {
      > .icon {
        color: #409eff;
      }

      &:hover {
        > .icon {
          background: #409eff;
          color: #fcfcfc;
          box-shadow: 0 0 0 5px #409eff33;
        }
      }
    }

    &.yellow {
      > .icon {
        color: #e6a23c;
      }

      &:hover {
        > .icon {
          background: #e6a23c;
          color: #fcfcfc;
          box-shadow: 0 0 0 5px #e6a23c33;
        }
      }
    }

    &.gray {
      > .icon {
        color: #909399;
      }

      &:hover {
        > .icon {
          background: #909399;
          color: #fcfcfc;
          box-shadow: 0 0 0 5px #90939933;
        }
      }
    }
  }
}
</style>
