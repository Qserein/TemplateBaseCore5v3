/** API 返回值 基础 */
export interface ApiResultBasic {
  success: boolean
  msg: string
  statusCode: number
}

/** API 返回值 数据 */
export interface ApiResult<T> extends ApiResultBasic {
  data: T
}

/** API 返回值 列表 */
export interface ApiResultList<T> extends ApiResult<T[]> {}

/** API 返回值 分页列表 */
export interface ApiResultPage<T> extends ApiResultList<T> {
  /** 分页页码 */
  index: number
  /** 分页的总数据 */
  count: number
  /** 每页数量 */
  size: number
  /** 总页数 */
  pages: number
  /** 是否有下一页 */
  hasNextPage: boolean
}

/** API 返回值 数量 */
export interface ApiResultCount extends ApiResultBasic {
  /** 数量 */
  count: number
}

/** ID 和 Title 的通用模型 */
export interface IDTitleViewModel {
  /** ID */
  ID: number
  /** 名称 */
  Title: string
}
/** ID 和 Title 的通用模型 */
export type MenuItem = IDTitleViewModel

/** 登录结果 */
export type LoginRes = ApiResult<LoginResult>
/** 登录结果 */
export interface LoginResult {
  /** UID */
  ID: string
  /** 用户名 */
  UserName: string
  /** 昵称 */
  NickName: string
  /** 姓名 */
  FullName: string
  /** Token */
  token: string
}

/** 用于绑定页面上的菜单 */
export type MenuRes = ApiResultList<MenuViewModel>
/** 用于绑定页面上的菜单 */
export interface MenuViewModel {
  name: string
  url: string
  icon: string
  childMenus?: MenuViewModel[]
}

/** 登录日志 */
export type LoginLogRes = ApiResultPage<LoginLogViewModel>

/** 登录日志 */
export interface LoginLogViewModel {
  /** ID */
  ID: number
  /** 标题 */
  Title: string
  /** 触发的用户ID */
  UserID: number
  /** 添加时间 */
  AddDate: string
  /** 触发的系统 */
  Os: string
  /** 触发的浏览器 */
  Browser: string
  /** 分辨率宽度 ResolutionWidth */
  R_W: number
  /** 分辨率高度 ResolutionHeight */
  R_H: number
}

/** 登录日志 */
export type ExceptionLogRes = ApiResultPage<ExceptionLogViewModel>
/** 异常日志 */
export interface ExceptionLogViewModel {
  /** ID */
  ID: number
  /** 标题 */
  Title: string
  /** 触发的用户ID */
  UserID: number
  /** 添加时间 */
  AddDate: string
  /** 内容 */
  Content: string
  /** 是否解决 */
  IsSolve: boolean
  /** 类型 1.异常 2.文件不存在 3.登录失败 4.其它 */
  Type: 1 | 2 | 3 | 4
}

/** 全局配置 */
export type ConfigRes = ApiResultPage<ConfigModel>
/** 全局配置 */
export interface ConfigModel {
  /** ID */
  ID: number
  /** 名称 */
  Title: string
  /** 编号 */
  Number: string
  /** 值 */
  Value: string
}

/** 菜单 */
export interface MenuModel {
  ID: number
  /** 父ID */
  FID: number
  /** 名称 */
  Names: string
  /** 图标 */
  Icon: string
  /** 地址 */
  Url: string
  /** 是否显示 */
  IsEnable: boolean
  /** 顺序 */
  Sorting: number
  /** 备注 */
  Remark: string
}

/** 角色 */
export type RoleRes = ApiResultPage<RoleModel>
/** 角色 */
export interface RoleModel {
  ID: number
  /** 名称 */
  Names: string
  /** 顺序 */
  Sorting: number
  /** 菜单权限 */
  Menus: string
  /** 栏目权限 */
  ArticleMenus: string
  /** 课程权限 */
  Courses: string
}

/** 树状图 */
export interface ELTreeViewModel {
  /** id */
  id: number
  /** 标签 */
  label: string
  /** 子集 */
  children: ELTreeViewModel[]
}

/** 用户模型 */
export interface SysUserViewModel {
  /** ID */
  ID: number
  /** 用户名 */
  UserName: string
  /** 密码 */
  Password: string
  /** 头像 */
  HeadPortrait: string
  /** 昵称 */
  NickName: string
  /** 姓名 */
  FullName: string
  /** 职位 */
  Position: string
  /** 身份证 */
  IdCard: string
  /** 性别,0:未知,1:男,2:女 */
  Gender: number
  /** 手机 */
  MobilePhone: string
  /** QQ */
  QQ: string
  /** 邮箱 */
  Mail: string
  /** 状态 1未审核 2已审核 3禁用 4被标记删除 */
  State: number
  /** 角色ID 1.超级管理员 2.区域管理员 3.支部管理员 4.用户 */
  RoleID: number
  /** 角色名称 1.超级管理员 2.区域管理员 3.支部管理员 4.用户 */
  RoleName: string
  /** 注册时间 */
  AddDate: string
}

/** 广告模型 */
export interface AdverViewModel {
  ID: number
  /** 标题 */
  Title: string
  /** 类型ID */
  TypeID: number
  /** 图片 */
  Pic: string
  /** 背景色 */
  BackgroundColor: string
  /** 开始时间 */
  StartDate: string
  /** 结束时间 */
  EndDate: string
  /** 地址 */
  Url: string
  /** 顺序 */
  Sorting: number
  /** 是否启用 */
  IsEnable: boolean
}

/** 广告类型 */
export interface AdvertType {
  /** ID */
  ID: number
  /** 名称 */
  Names: string
  /** 顺序 */
  Sorting: number
  /** 备注 */
  Remark: string
}

/** 文章栏目 */
export interface ArticleMenuModel {
  /** ID */
  ID: number
  /** 名称 */
  Names: string
  /** 存英文名或副标题 */
  ENames: string
  /** 父ID */
  ParentID: number
  /** 企业ID */
  EnterpriseID: number
  /** 顺序 */
  Sorting: number
  /** 状态 1.未审核 2.已审核 3.标记删除 */
  State: number
  /** 类型，自由定义 */
  Type: number
  /** 添加时间 */
  AddDate: Date
  /** 外链 */
  URL: string
}

/** 文章模型 */
export interface ArticleViewModel {
  /** 文章ID */
  ID: number
  /** 栏目 */
  ArticleMenu: ArticleMenuModel[]
  /** 标题 */
  Title: string
  /** 浏览次数 */
  PageView: number
  /** 图片地址 */
  ImgUrl: string
  /** 文件地址 */
  FileUrl: string
  /** 状态 1.未审核 2.已审核 3.标记删除 */
  State: number
  /** 添加时间 */
  AddDate: string
}

/** 文章提交模型 */
export interface ArticlePostViewModel {
  /** ID */
  ID: number
  /** 标题 */
  Title: string
  /** 内容 */
  Contents: string
  /** 图片地址 */
  ImgUrl: string
  /** 添加时间 */
  AddDate: string
  /** 文件地址 */
  FileUrl: string
  /** 显示方式,1.文字 2.图片 3.视频 4.音频 5.软件 */
  Type: number
  /** 关键字 */
  Keyword: string
  /** 浏览次数 */
  PageView: number
  /** 是否置顶 */
  IsTop: boolean
  /** 顺序 */
  Sorting: number
  /** 状态 1.未审核 2.已审核 3.标记删除 */
  State: number
  /** 简介 */
  Synopsis: string
  /** 来源 转载或原创 */
  Source: string
  /** 作者 */
  Author: string
  /** 栏目类型 */
  ArticleMenuIDs: string
}

/** 文章详情模型 */
export interface ArticleItemViewModel {
  /** ID */
  ID: number
  /** 标题 */
  Title: string
  /** 内容 */
  Contents: string
  /** 图片地址 */
  ImgUrl: string
  /** 添加时间 */
  AddDate: string
  /** 文件地址 */
  FileUrl: string
  /** 显示方式,1.文字 2.图片 3.视频 4.音频 5.软件 */
  Type: number
  /** 关键字 */
  Keyword: string
  /** 浏览次数 */
  PageView: number
  /** 是否置顶 */
  IsTop: boolean
  /** 顺序 */
  Sorting: number
  /** 状态 1.未审核 2.已审核 3.标记删除 */
  State: number
  /** 简介 */
  Synopsis: string
  /** 来源 转载或原创 */
  Source: string
  /** 作者 */
  Author: string
  /** 文件大小 */
  FileSize: string
  /** 文件格式 */
  FileFormat: string
  /** 文章栏目 */
  Articlemenumodel: ArticleMenuViewModel[]
}

/** 文章栏目模型 */
export interface ArticleMenuViewModel {
  /** 栏目ID */
  id: number
  /** 栏目名 */
  Names: string
}
