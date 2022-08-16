import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'ant-design-vue/dist/antd.css'
import 'virtual:windi.css'
import 'nprogress/nprogress.css'
import moment from 'moment'
import 'moment/dist/locale/zh-cn'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import './Icons/Icon.scss'

moment.locale('zh-cn')

export const app = createApp(App)
app.use(router)
app.use(ElementPlus, {
  locale: zhCn,
})
app.mount('#app')
