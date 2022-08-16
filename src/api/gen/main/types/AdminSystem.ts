/** 添加参数 */
export type AddConfigParam = {
  /** 名称 */
  Title?: string,
  /** 编号 */
  Number?: string,
  /** 值 */
  Value?: string,
}

/** 添加参数 */
export type AddMenuParam = {
  /** 名称 */
  Names?: string,
  /** 图标 */
  Icon?: string,
  /** 地址 */
  Url?: string,
  /** 备注 */
  Remark?: string,
  /** 是否显示 */
  IsEnable: boolean,
  /** 顺序 */
  Sorting: number,
  /** 父ID */
  FID: number,
}

/** 添加参数 */
export type AddParam = {
  /** 名称 */
  Names?: string,
  /** 顺序 */
  Sorting: number,
  /** 备注 */
  Remark?: string,
}

/** 添加角色参数 */
export type AddRoleParam = {
  /** 名字 */
  Names?: string,
  /** 排序 */
  Sorting: number,
}

/** 广告类型 */
export type AdvertType = {
  ID: number,
  /** 名称 */
  Names?: string,
  /** 顺序 */
  Sorting: number,
  /** 备注 */
  Remark?: string,
}

/** API 返回值 数据 */
export type AdvertTypeApiResult = {
  /** 是否成功 */
  success: boolean,
  /** 信息 */
  msg?: string,
  statusCode: ApiEnum,
  data: AdvertType,
}

/** API 返回值 分页列表 */
export type AdvertTypeApiResultPage = {
  /** 是否成功 */
  success: boolean,
  /** 信息 */
  msg?: string,
  statusCode: ApiEnum,
  /** 数据集 */
  data?: AdvertType[],
  /** 分页页码 */
  index: number,
  /** 分页的总数据 */
  count: number,
  /** 每页数量 */
  size: number,
  /** 总页数 */
  pages: number,
  /** 是否有下一页 */
  hasNextPage: boolean,
}

export type AdverViewModel = {
  ID: number,
  /** 标题 */
  Title?: string,
  /** 类型ID */
  TypeID: number,
  /** 图片 */
  Pic?: string,
  /** 背景色 */
  BackgroundColor?: string,
  /** 开始时间 */
  StartDate?: string,
  /** 结束时间 */
  EndDate?: string,
  /** 地址 */
  Url?: string,
  /** 顺序 */
  Sorting: number,
  /** 是否启用 */
  IsEnable: boolean,
}

/** API 返回值 数据 */
export type AdverViewModelApiResult = {
  /** 是否成功 */
  success: boolean,
  /** 信息 */
  msg?: string,
  statusCode: ApiEnum,
  data: AdverViewModel,
}

/** API 返回值 分页列表 */
export type AdverViewModelApiResultPage = {
  /** 是否成功 */
  success: boolean,
  /** 信息 */
  msg?: string,
  statusCode: ApiEnum,
  /** 数据集 */
  data?: AdverViewModel[],
  /** 分页页码 */
  index: number,
  /** 分页的总数据 */
  count: number,
  /** 每页数量 */
  size: number,
  /** 总页数 */
  pages: number,
  /** 是否有下一页 */
  hasNextPage: boolean,
}

/** 

200 = Status (请求(或处理)成功)

400 = ParameterError (请求参数不完整或不正确)

401 = Unauthorized (未授权标识)

403 = TokenInvalid (请求TOKEN失效)

404 = NotFound (请求的资源不存在)

405 = HttpMehtodError (HTTP请求类型不合法)

406 = HttpRequestError (HTTP请求不合法,请求参数可能被篡改)

407 = URLExpireError (该URL已经失效)

500 = Error (内部请求出错) */
export enum ApiEnum {
  /** 请求(或处理)成功 */
  Status = 200,
  /** 请求参数不完整或不正确 */
  ParameterError = 400,
  /** 未授权标识 */
  Unauthorized = 401,
  /** 请求TOKEN失效 */
  TokenInvalid = 403,
  /** 请求的资源不存在 */
  NotFound = 404,
  /** HTTP请求类型不合法 */
  HttpMehtodError = 405,
  /** HTTP请求不合法,请求参数可能被篡改 */
  HttpRequestError = 406,
  /** 该URL已经失效 */
  URLExpireError = 407,
  /** 内部请求出错 */
  Error = 500,
}
/** API 返回值 基础 */
export type ApiResult = {
  /** 是否成功 */
  success: boolean,
  /** 信息 */
  msg?: string,
  statusCode: ApiEnum,
}

export type APIRoutViewModel = {
  /** 路径 */
  Path?: string,
  /** 名称 */
  Name?: string,
  /** 地址 */
  PagePath?: string,
}

/** API 返回值 数据 */
export type APIRoutViewModelIEnumerableApiResult = {
  /** 是否成功 */
  success: boolean,
  /** 信息 */
  msg?: string,
  statusCode: ApiEnum,
  /** 数据集 */
  data?: APIRoutViewModel[],
}

export type APIUserViewModel = {
  /** 用户名 */
  UserName?: string,
  /** 密码 */
  Password?: string,
  /** 头像 */
  HeadPortrait?: string,
  /** 昵称 */
  NickName?: string,
  /** 姓名 */
  FullName?: string,
  /** 职位 */
  Position?: string,
  /** 身份证 */
  IdCard?: string,
  /** 性别,0:未知,1:男,2:女 */
  Gender: number,
  /** 手机 */
  MobilePhone?: string,
  /** QQ */
  QQ?: string,
  /** 邮箱 */
  Mail?: string,
  /** 状态 1未审核 2已审核 3禁用 4被标记删除 */
  State: number,
  /** 角色ID 1.超级管理员 2.区域管理员 3.支部管理员 4.用户 */
  RoleID: number,
}

export type ArticleItemViewModel = {
  ID: number,
  /** 标题 */
  Title?: string,
  /** 内容 */
  Contents?: string,
  /** 图片地址 */
  ImgUrl?: string,
  /** 添加时间 */
  AddDate?: string,
  /** 文件地址 */
  FileUrl?: string,
  /** 显示方式,1.文字 2.图片 3.视频 4.音频 5.软件 */
  Type: number,
  /** 关键字 */
  Keyword?: string,
  /** 浏览次数 */
  PageView: number,
  /** 是否置顶 */
  IsTop: boolean,
  /** 顺序 */
  Sorting: number,
  /** 状态 1.未审核 2.已审核 3.标记删除 */
  State: number,
  /** 简介 */
  Synopsis?: string,
  /** 来源 转载或原创 */
  Source?: string,
  /** 作者 */
  Author?: string,
  /** 文件大小 */
  FileSize?: string,
  /** 文件格式 */
  FileFormat?: string,
  /** 栏目 */
  Articlemenumodel?: ArticleMenuViewModel[],
}

/** API 返回值 数据 */
export type ArticleItemViewModelApiResult = {
  /** 是否成功 */
  success: boolean,
  /** 信息 */
  msg?: string,
  statusCode: ApiEnum,
  data: ArticleItemViewModel,
}

export type ArticleMenuModel = {
  /** 栏目ID */
  ArticleMenuID: number,
  /** 栏目名 */
  Names?: string,
}

export type ArticleMenuViewModel = {
  /** 栏目ID */
  id: number,
  /** 栏目名 */
  Names?: string,
}

export type ArticlePostViewModel = {
  ID: number,
  /** 标题 */
  Title?: string,
  /** 内容 */
  Contents?: string,
  /** 图片地址 */
  ImgUrl?: string,
  /** 添加时间 */
  AddDate?: string,
  /** 文件地址 */
  FileUrl?: string,
  /** 显示方式,1.文字 2.图片 3.视频 4.音频 5.软件 */
  Type: number,
  /** 关键字 */
  Keyword?: string,
  /** 浏览次数 */
  PageView: number,
  /** 是否置顶 */
  IsTop: boolean,
  /** 顺序 */
  Sorting: number,
  /** 状态 1.未审核 2.已审核 3.标记删除 */
  State: number,
  /** 简介 */
  Synopsis?: string,
  /** 来源 转载或原创 */
  Source?: string,
  /** 作者 */
  Author?: string,
  /** 栏目类型 */
  ArticleMenuIDs?: string,
}

export type ArticleViewModel = {
  /** 文章ID */
  ID: number,
  /** 栏目 */
  ArticleMenu?: ArticleMenuModel[],
  /** 标题 */
  Title?: string,
  /** 浏览次数 */
  PageView: number,
  /** 图片地址 */
  ImgUrl?: string,
  /** 文件地址 */
  FileUrl?: string,
  /** 状态 1.未审核 2.已审核 3.标记删除 */
  State: number,
  /** 添加时间 */
  AddDate?: string,
}

/** API 返回值 分页列表 */
export type ArticleViewModelApiResultPage = {
  /** 是否成功 */
  success: boolean,
  /** 信息 */
  msg?: string,
  statusCode: ApiEnum,
  /** 数据集 */
  data?: ArticleViewModel[],
  /** 分页页码 */
  index: number,
  /** 分页的总数据 */
  count: number,
  /** 每页数量 */
  size: number,
  /** 总页数 */
  pages: number,
  /** 是否有下一页 */
  hasNextPage: boolean,
}

/** 目录或文件编辑 */
export type CommonAssetViewEditModel = {
  /** ID */
  ID: number,
  /** 是否是目录 */
  IsFold: boolean,
  /** 目录名或文件名 */
  Name?: string,
  TypeID: FileAssetType,
  /** 是否启用 */
  IsEnable: boolean,
}

/** 目录或文件 */
export type CommonAssetViewModel = {
  /** ID */
  ID: number,
  /** 前端循环的 key */
  Key?: string,
  /** 是否是目录 */
  IsFold: boolean,
  /** 目录名或文件名 */
  Name?: string,
  TypeID: FileAssetType,
  /** 文件地址 */
  Url?: string,
  /** 宽度 (像素) */
  Width: number,
  /** 高度 (像素) */
  Height: number,
  /** 是否启用 */
  IsEnable: boolean,
}

/** API 返回值 分页列表 */
export type CommonAssetViewModelApiResultPage = {
  /** 是否成功 */
  success: boolean,
  /** 信息 */
  msg?: string,
  statusCode: ApiEnum,
  /** 数据集 */
  data?: CommonAssetViewModel[],
  /** 分页页码 */
  index: number,
  /** 分页的总数据 */
  count: number,
  /** 每页数量 */
  size: number,
  /** 总页数 */
  pages: number,
  /** 是否有下一页 */
  hasNextPage: boolean,
}

/** 全局配置表 */
export type Config = {
  ID: number,
  /** 名称 */
  Title?: string,
  /** 编号 */
  Number?: string,
  /** 值 */
  Value?: string,
}

/** API 返回值 数据 */
export type ConfigApiResult = {
  /** 是否成功 */
  success: boolean,
  /** 信息 */
  msg?: string,
  statusCode: ApiEnum,
  data: Config,
}

/** API 返回值 分页列表 */
export type ConfigApiResultPage = {
  /** 是否成功 */
  success: boolean,
  /** 信息 */
  msg?: string,
  statusCode: ApiEnum,
  /** 数据集 */
  data?: Config[],
  /** 分页页码 */
  index: number,
  /** 分页的总数据 */
  count: number,
  /** 每页数量 */
  size: number,
  /** 总页数 */
  pages: number,
  /** 是否有下一页 */
  hasNextPage: boolean,
}

/** 网站基本配置 */
export type ConfigBase = {
  ID: number,
  /** 名称 */
  Names?: string,
  /** 首页Title */
  Title?: string,
  /** 首页关键字 */
  Keywords?: string,
  /** 首页描述 */
  Description?: string,
  /** 首页JS代码 */
  JSCode?: string,
}

/** 栏目更新参数 */
export type EditParam = {
  /** 选择id */
  ID: number,
  /** 父类id */
  ParentID: number,
  /** 名称 */
  Names?: string,
  /** 存英文名或副标题 */
  ENames?: string,
  /** 顺序 */
  Sorting: number,
  /** 类型，自由定义 */
  Type: number,
  /** 外链 */
  URL?: string,
}

/** 树状图 */
export type ELTreeViewModel = {
  id: number,
  label?: string,
  children?: ELTreeViewModel[],
}

/** API 返回值 列表 */
export type ELTreeViewModelApiResultList = {
  /** 是否成功 */
  success: boolean,
  /** 信息 */
  msg?: string,
  statusCode: ApiEnum,
  /** 数据集 */
  data?: ELTreeViewModel[],
}

/** API 返回值 数据 */
export type ELTreeViewModelIEnumerableApiResult = {
  /** 是否成功 */
  success: boolean,
  /** 信息 */
  msg?: string,
  statusCode: ApiEnum,
  /** 数据集 */
  data?: ELTreeViewModel[],
}

/** 启用禁用参数 */
export type EnableParam = {
  /** ID */
  ID?: number[],
  /** 启用禁用 */
  IsEnable: boolean,
}

export type ExceptionLogViewModel = {
  ID: number,
  /** 标题 */
  Title?: string,
  /** 触发的用户ID */
  UserID: number,
  /** 添加时间 */
  AddDate?: string,
  /** 内容 */
  Content?: string,
  /** 是否解决 */
  IsSolve: boolean,
  /** 类型 1.异常 2.文件不存在 3.登录失败 4.其它 */
  Type: number,
}

/** API 返回值 数据 */
export type ExceptionLogViewModelApiResult = {
  /** 是否成功 */
  success: boolean,
  /** 信息 */
  msg?: string,
  statusCode: ApiEnum,
  data: ExceptionLogViewModel,
}

/** API 返回值 分页列表 */
export type ExceptionLogViewModelApiResultPage = {
  /** 是否成功 */
  success: boolean,
  /** 信息 */
  msg?: string,
  statusCode: ApiEnum,
  /** 数据集 */
  data?: ExceptionLogViewModel[],
  /** 分页页码 */
  index: number,
  /** 分页的总数据 */
  count: number,
  /** 每页数量 */
  size: number,
  /** 总页数 */
  pages: number,
  /** 是否有下一页 */
  hasNextPage: boolean,
}

/** 文件列表编辑 */
export type FileAssetListEditViewModel = {
  /** ID */
  ID: number,
  /** 文件名 */
  Name?: string,
  TypeID: FileAssetType,
  /** 上传用户 */
  UserID: number,
  /** 是否启用 */
  IsEnable: boolean,
}

/** API 返回值 数据 */
export type FileAssetListEditViewModelApiResult = {
  /** 是否成功 */
  success: boolean,
  /** 信息 */
  msg?: string,
  statusCode: ApiEnum,
  data: FileAssetListEditViewModel,
}

/** 文件列表 */
export type FileAssetListViewModel = {
  /** ID */
  ID: number,
  TypeID: FileAssetType,
  /** 文件地址 */
  Url?: string,
  /** 文件名 */
  Name?: string,
  /** 文件大小 (字节) */
  Size: number,
  /** 宽度 (像素) */
  Width: number,
  /** 高度 (像素) */
  Height: number,
  /** 上传者 */
  UserID: number,
  /** 上传人 */
  User?: string,
  /** 创建日期 */
  AddDate?: string,
  /** 上传完成日期 */
  UploadedDate?: string,
  /** 是否启用 */
  IsEnable: boolean,
}

/** API 返回值 数据 */
export type FileAssetListViewModelApiResult = {
  /** 是否成功 */
  success: boolean,
  /** 信息 */
  msg?: string,
  statusCode: ApiEnum,
  data: FileAssetListViewModel,
}

/** API 返回值 分页列表 */
export type FileAssetListViewModelApiResultPage = {
  /** 是否成功 */
  success: boolean,
  /** 信息 */
  msg?: string,
  statusCode: ApiEnum,
  /** 数据集 */
  data?: FileAssetListViewModel[],
  /** 分页页码 */
  index: number,
  /** 分页的总数据 */
  count: number,
  /** 每页数量 */
  size: number,
  /** 总页数 */
  pages: number,
  /** 是否有下一页 */
  hasNextPage: boolean,
}

/** 文件类型

0 = File (其他文件)

1 = Image (图片文件)

2 = Video (视频文件)

3 = Audio (音频文件)

4 = Text (文本文件)

5 = Zip (压缩文件)

6 = Exe (可执行文件) */
export enum FileAssetType {
  /** 其他文件 */
  File = 0,
  /** 图片文件 */
  Image = 1,
  /** 视频文件 */
  Video = 2,
  /** 音频文件 */
  Audio = 3,
  /** 文本文件 */
  Text = 4,
  /** 压缩文件 */
  Zip = 5,
  /** 可执行文件 */
  Exe = 6,
}
/** 目录 */
export type FoldAssetViewModel = {
  /** ID */
  ID: number,
  /** 父 ID */
  FID: number,
  /** 目录名 */
  Name?: string,
  /** 是否有子级 */
  HasChild: boolean,
}

/** API 返回值 列表 */
export type FoldAssetViewModelApiResultList = {
  /** 是否成功 */
  success: boolean,
  /** 信息 */
  msg?: string,
  statusCode: ApiEnum,
  /** 数据集 */
  data?: FoldAssetViewModel[],
}

/** ID 和 Title 的通用模型 */
export type IDTitleViewModel = {
  /** ID */
  ID: number,
  /** 名称 */
  Title?: string,
}

/** API 返回值 列表 */
export type IDTitleViewModelApiResultList = {
  /** 是否成功 */
  success: boolean,
  /** 信息 */
  msg?: string,
  statusCode: ApiEnum,
  /** 数据集 */
  data?: IDTitleViewModel[],
}

/** API 返回值 分页列表 */
export type IDTitleViewModelApiResultPage = {
  /** 是否成功 */
  success: boolean,
  /** 信息 */
  msg?: string,
  statusCode: ApiEnum,
  /** 数据集 */
  data?: IDTitleViewModel[],
  /** 分页页码 */
  index: number,
  /** 分页的总数据 */
  count: number,
  /** 每页数量 */
  size: number,
  /** 总页数 */
  pages: number,
  /** 是否有下一页 */
  hasNextPage: boolean,
}

/** API 返回值 数据 */
export type Int32ApiResult = {
  /** 是否成功 */
  success: boolean,
  /** 信息 */
  msg?: string,
  statusCode: ApiEnum,
  /** 数据集 */
  data: number,
}

export type LoginLogViewModel = {
  ID: number,
  /** 标题 */
  Title?: string,
  /** 触发的用户ID */
  UserID: number,
  /** 添加时间 */
  AddDate?: string,
  /** 触发的系统 */
  Os?: string,
  /** 触发的浏览器 */
  Browser?: string,
  /** 分辨率宽度 ResolutionWidth */
  R_W: number,
  /** 分辨率高度 ResolutionHeight */
  R_H: number,
}

/** API 返回值 分页列表 */
export type LoginLogViewModelApiResultPage = {
  /** 是否成功 */
  success: boolean,
  /** 信息 */
  msg?: string,
  statusCode: ApiEnum,
  /** 数据集 */
  data?: LoginLogViewModel[],
  /** 分页页码 */
  index: number,
  /** 分页的总数据 */
  count: number,
  /** 每页数量 */
  size: number,
  /** 总页数 */
  pages: number,
  /** 是否有下一页 */
  hasNextPage: boolean,
}

/** 菜单表 */
export type Menu = {
  ID: number,
  /** 父ID */
  FID: number,
  /** 名称 */
  Names?: string,
  /** 图标 */
  Icon?: string,
  /** 地址 */
  Url?: string,
  /** 是否显示 */
  IsEnable: boolean,
  /** 顺序 */
  Sorting: number,
  /** 备注 */
  Remark?: string,
}

/** API 返回值 数据 */
export type MenuApiResult = {
  /** 是否成功 */
  success: boolean,
  /** 信息 */
  msg?: string,
  statusCode: ApiEnum,
  data: Menu,
}

/** API 返回值 分页列表 */
export type MenuApiResultPage = {
  /** 是否成功 */
  success: boolean,
  /** 信息 */
  msg?: string,
  statusCode: ApiEnum,
  /** 数据集 */
  data?: Menu[],
  /** 分页页码 */
  index: number,
  /** 分页的总数据 */
  count: number,
  /** 每页数量 */
  size: number,
  /** 总页数 */
  pages: number,
  /** 是否有下一页 */
  hasNextPage: boolean,
}

/** 用于绑定页面上的菜单 */
export type MenuViewModel = {
  name?: string,
  url?: string,
  icon?: string,
  childMenus?: MenuViewModel[],
}

/** API 返回值 列表 */
export type MenuViewModelApiResultList = {
  /** 是否成功 */
  success: boolean,
  /** 信息 */
  msg?: string,
  statusCode: ApiEnum,
  /** 数据集 */
  data?: MenuViewModel[],
}

/** 更换父级参数 */
export type ModifyParentIDParam = {
  /** ID */
  ID: number,
  /** 父级 ID */
  ParentID: number,
}

/** 移动目录和文件参数 */
export type MoveParam = {
  /** 目标目录ID */
  TargetFoldID: number,
  /** 要移动的目录 */
  FoldIDs?: number[],
  /** 要移动的文件 */
  FileIDs?: number[],
}

/** 栏目新增参数 */
export type NewParam = {
  /** 父类id */
  ParentID: number,
  /** 名称 */
  Names?: string,
  /** 存英文名或副标题 */
  ENames?: string,
  /** 顺序 */
  Sorting: number,
  /** 类型，自由定义 */
  Type: number,
  /** 外链 */
  URL?: string,
}

/** API 返回值 数据 */
export type ObjectApiResult = {
  /** 是否成功 */
  success: boolean,
  /** 信息 */
  msg?: string,
  statusCode: ApiEnum,
  /** 数据集 */
  data?: any,
}

export type PutAPIUserViewModel = {
  /** 用户名 */
  UserName?: string,
  /** 密码 */
  Password?: string,
  /** 头像 */
  HeadPortrait?: string,
  /** 昵称 */
  NickName?: string,
  /** 姓名 */
  FullName?: string,
  /** 职位 */
  Position?: string,
  /** 身份证 */
  IdCard?: string,
  /** 性别,0:未知,1:男,2:女 */
  Gender: number,
  /** 手机 */
  MobilePhone?: string,
  /** QQ */
  QQ?: string,
  /** 邮箱 */
  Mail?: string,
  /** 状态 1未审核 2已审核 3禁用 4被标记删除 */
  State: number,
  /** 角色ID 1.超级管理员 2.区域管理员 3.支部管理员 4.用户 */
  RoleID: number,
  ID: number,
}

/** 角色 */
export type Role = {
  ID: number,
  /** 名称 */
  Names: string,
  /** 顺序 */
  Sorting: number,
  /** 菜单权限 */
  Menus?: string,
  /** 栏目权限 */
  ArticleMenus?: string,
  /** 课程权限 */
  Courses?: string,
}

/** API 返回值 数据 */
export type RoleApiResult = {
  /** 是否成功 */
  success: boolean,
  /** 信息 */
  msg?: string,
  statusCode: ApiEnum,
  data: Role,
}

/** API 返回值 分页列表 */
export type RoleApiResultPage = {
  /** 是否成功 */
  success: boolean,
  /** 信息 */
  msg?: string,
  statusCode: ApiEnum,
  /** 数据集 */
  data?: Role[],
  /** 分页页码 */
  index: number,
  /** 分页的总数据 */
  count: number,
  /** 每页数量 */
  size: number,
  /** 总页数 */
  pages: number,
  /** 是否有下一页 */
  hasNextPage: boolean,
}

/** API 返回值 数据 */
export type RoleListApiResult = {
  /** 是否成功 */
  success: boolean,
  /** 信息 */
  msg?: string,
  statusCode: ApiEnum,
  /** 数据集 */
  data?: Role[],
}

/** 更新权限菜单参数 */
export type SetMenusParam = {
  /** 角色 ID */
  RoleID: number,
  /** 菜单 */
  Menus?: string,
}

/** API 返回值 数据 */
export type StringApiResult = {
  /** 是否成功 */
  success: boolean,
  /** 信息 */
  msg?: string,
  statusCode: ApiEnum,
  /** 数据集 */
  data?: string,
}

export type SysUserViewModel = {
  ID: number,
  /** 用户名 */
  UserName?: string,
  /** 密码 */
  Password?: string,
  /** 头像 */
  HeadPortrait?: string,
  /** 昵称 */
  NickName?: string,
  /** 姓名 */
  FullName?: string,
  /** 职位 */
  Position?: string,
  /** 身份证 */
  IdCard?: string,
  /** 性别,0:未知,1:男,2:女 */
  Gender: number,
  /** 手机 */
  MobilePhone?: string,
  /** QQ */
  QQ?: string,
  /** 邮箱 */
  Mail?: string,
  /** 状态 1未审核 2已审核 3禁用 4被标记删除 */
  State: number,
  /** 角色ID 1.超级管理员 2.区域管理员 3.支部管理员 4.用户 */
  RoleID: number,
  /** 角色名称 1.超级管理员 2.区域管理员 3.支部管理员 4.用户 */
  RoleName?: string,
  /** 注册时间 */
  AddDate?: string,
}

/** API 返回值 数据 */
export type SysUserViewModelApiResult = {
  /** 是否成功 */
  success: boolean,
  /** 信息 */
  msg?: string,
  statusCode: ApiEnum,
  data: SysUserViewModel,
}

/** API 返回值 分页列表 */
export type SysUserViewModelApiResultPage = {
  /** 是否成功 */
  success: boolean,
  /** 信息 */
  msg?: string,
  statusCode: ApiEnum,
  /** 数据集 */
  data?: SysUserViewModel[],
  /** 分页页码 */
  index: number,
  /** 分页的总数据 */
  count: number,
  /** 每页数量 */
  size: number,
  /** 总页数 */
  pages: number,
  /** 是否有下一页 */
  hasNextPage: boolean,
}

/** API 返回值 数据 */
export type SysUserViewModelIEnumerableApiResult = {
  /** 是否成功 */
  success: boolean,
  /** 信息 */
  msg?: string,
  statusCode: ApiEnum,
  /** 数据集 */
  data?: SysUserViewModel[],
}

/** 单元类型，表示没有值，void 的代替品 */
export type Unit = {

}

/** API 返回值 数据 */
export type UnitApiResult = {
  /** 是否成功 */
  success: boolean,
  /** 信息 */
  msg?: string,
  statusCode: ApiEnum,
  data: Unit,
}

/** API 返回值 分页列表 */
export type UnitApiResultPage = {
  /** 是否成功 */
  success: boolean,
  /** 信息 */
  msg?: string,
  statusCode: ApiEnum,
  /** 数据集 */
  data?: Unit[],
  /** 分页页码 */
  index: number,
  /** 分页的总数据 */
  count: number,
  /** 每页数量 */
  size: number,
  /** 总页数 */
  pages: number,
  /** 是否有下一页 */
  hasNextPage: boolean,
}

/** 修改参数 */
export type UpdateParam = {
  /** ID */
  ID: number,
  /** 名称 */
  Names?: string,
  /** 顺序 */
  Sorting: number,
  /** 备注 */
  Remark?: string,
}

export type UpdatePwdParam = {
  Oldpassword?: string,
  Newpassword1?: string,
  Newpassword2?: string,
}

/** 部分更新参数 */
export type UpdateRoleParam = {
  /** ID */
  ID: number,
  /** 名称 */
  Names?: string,
  /** 顺序 */
  Sorting: number,
}

/** 用户表 */
export type UserInfo = {
  ID: number,
  /** 用户平台唯一ID */
  PiUserID?: string,
  /** 用户名 */
  UserName?: string,
  /** 密码 */
  Password?: string,
  /** 头像 */
  HeadPortrait?: string,
  /** 昵称 */
  NickName?: string,
  /** 姓名 */
  FullName?: string,
  /** 职位 */
  Position?: string,
  /** 身份证 */
  IdCard?: string,
  /** 银行卡 */
  BankCard?: string,
  /** 是否实名认证 */
  IsCertification: boolean,
  /** 性别,0:未知,1:男,2:女 */
  Gender: number,
  /** 注册时间 */
  AddDate: string | Date,
  /** 手机 */
  MobilePhone?: string,
  /** QQ */
  QQ?: string,
  /** 生日 */
  BirthDate: string | Date,
  /** 支部ID */
  CompanyID: number,
  /** 邮箱 */
  Mail?: string,
  /** 最后登录时间 */
  LastLoginData: string | Date,
  /** 状态 1未审核 2已审核 3禁用 4被标记删除 */
  State: number,
  /** 支部申请状态0.未绑定1.申请2.绑定 */
  CompanyState: number,
  /** 用户类型 1导入 2申请 */
  Type: number,
  /** 角色ID 1.超级管理员 2.区域管理员 3.支部管理员 4.用户 */
  RoleID: number,
  /** 注册的IP */
  RegistIP?: string,
  /** 推荐人 */
  Referrer: number,
  /** 地区 */
  AreasID: number,
  /** 地区 文字 */
  Areas?: string,
  /** 车牌号 */
  PlateNumber?: string,
  /** 余额（用户充值） */
  Fund: number,
  /** 累计充值金额 */
  SumFund: number,
  /** 积分 */
  Gold: number,
  /** 累计赠送积分 */
  SumGold: number,
  /** 荣誉 */
  Honor: number,
  /** 用户设备ID(app推送使用) */
  ClientID?: string,
  /** 主ID */
  MasterID: number,
  /** 手机绑定时间 */
  BindDate: string | Date,
}

/** API 返回值 数据 */
export type UserInfoApiResult = {
  /** 是否成功 */
  success: boolean,
  /** 信息 */
  msg?: string,
  statusCode: ApiEnum,
  data: UserInfo,
}
