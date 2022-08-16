import { ElMessage } from 'element-plus'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
const UnSupport = () => import('./UnSupport.vue')
const Index = () => import('./home/Index.vue')
const Home = () => import('./home/Home.vue')
const Login = () => import('./login/Login.vue')
const NotFound = () => import('./home/NotFound.vue')
const LoginLog = () => import('./system/LoginLog/LoginLog.vue')
const ExceptionLog = () => import('./system/ExceptionLog/ExceptionLog.vue')
const Config = () => import('./system/Config/Config.vue')
const Menu = () => import('./system/Menu/Menu.vue')
const Role = () => import('./system/Role/Role.vue')
const ConfigBase = () => import('./system/ConfigBase/ConfigBase.vue')
const Permissions = () => import('./system/Permissions/Permissions.vue')
const User = () => import('./system/User/User.vue')
const Advert = () => import('./info/Advert/Advert.vue')
const AdvertType = () => import('./info/Advert/AdvertType.vue')
const ArticleMenu = () => import('./info/Article/ArticleMenu.vue')
const Article = () => import('./info/Article/Article.vue')
const FileAsset = () => import('./info/File/FileAsset.vue')
const FileList = () => import('./info/File/FileList.vue')

export const routes: RouteRecordRaw[] = [
  { path: '/login', name: '登录', component: Login },
  {
    path: '/',
    name: '根',
    component: Index,
    children: [
      //#region 主页
      { path: '/', name: '主页', component: Home, alias: '/home' },
      //#endregion
      //#region 内容管理
      { path: '/home/fileAsset', name: '文件管理', component: FileAsset, meta: { title: '文件管理' } },
      { path: '/home/fileList', name: '文件列表', component: FileList, meta: { title: '文件列表' } },
      { path: '/home/articleMgt', name: '文章管理', component: Article, meta: { title: '文章管理' } },
      { path: '/home/classifyMgt', name: '栏目管理', component: ArticleMenu, meta: { title: '栏目管理' } },
      { path: '/home/advertList', name: '广告列表', component: Advert, meta: { title: '广告列表' } },
      { path: '/home/advertType', name: '广告类型', component: AdvertType, meta: { title: '广告类型' } },
      //#endregion
      //#region 系统管理
      { path: '/home/loginLog', name: '登录日志', component: LoginLog, meta: { title: '登录日志' } },
      { path: '/home/abnormal', name: '异常日志', component: ExceptionLog, meta: { title: '异常日志' } },
      { path: '/home/adminList', name: '管理员列表', component: User, meta: { title: '管理员列表' } },
      { path: '/home/authorityMgt', name: '权限管理', component: Permissions, meta: { title: '权限管理' } },
      { path: '/home/roleMgt', name: '角色管理', component: Role, meta: { title: '角色管理' } },
      { path: '/home/menuMgt', name: '菜单管理', component: Menu, meta: { title: '菜单管理' } },
      { path: '/home/globalMgt', name: '全局配置', component: Config, meta: { title: '全局配置' } },
      { path: '/home/websiteMgt', name: '网站基本配置', component: ConfigBase, meta: { title: '网站基本配置' } },
      { path: '/:pathMatch(.*)*', name: '未找到', component: NotFound },
      //#endregion
    ],
  },
  { path: '/:p(.*)*', name: '不支持', component: UnSupport },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token')
  if (to.path === '/login') return next()
  if (!token) {
    if (to.path !== '/') ElMessage.error('用户登录信息失效,请重新登录')
    return next('./login')
  } else {
    return next()
  }
})

router.beforeEach((to, _from, next) => {
  if (typeof to.meta?.title === 'string') document.title = `项目管理平台 · ${to.meta.title}`
  else document.title = '项目管理平台'
  next()
})
