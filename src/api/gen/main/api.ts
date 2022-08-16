import { AHttpConfig, aget, apost, aput, adel, apatch } from '../../../api/http'
import type * as d0 from './types/AdminAuth'
import type * as d1 from './types/AdminSystem'
import type * as d3 from './types/Common'

export type GetParams = {
  ["/api/Admin/Login"]: {
      /** 账号 */
      userName?: string
      /** 密码 */
      password?: string
      /** 验证码 */
      vcode?: string
    }
  ["/api/Admin/Advert/List"]: {
      pageIndex?: number
      Title?: string
      IsEnable?: boolean
      TypeID?: number
      SelStartDate?: string
      SelEndDate?: string
    }
  ["/api/Admin/Advert/{ID}"]: {
      ID: number
    }
  ["/api/Admin/AdvertType"]: {
      pageIndex?: number
      Title?: string
    }
  ["/api/Admin/AdvertType/{ID}"]: {
      ID: number
    }
  ["/api/Admin/Article/{ID}"]: {
      ID: number
    }
  ["/api/Admin/Article/List"]: {
      /** 当前页 */
      pageIndex?: number
      /** 栏目id JSON */
      ArticleMenuID?: string
      /** 状态 */
      State?: number
      /** 标题 */
      Title?: string
    }
  ["/api/Admin/ArticleMenu"]: {
      /** 状态 */
      State?: number
    }
  ["/api/Admin/ArticleMenu/{ID}"]: {
      ID: number
    }
  ["/api/Admin/Config/List"]: {
      pageIndex?: number
      Title?: string
    }
  ["/api/Admin/Config/ID"]: {
      id?: number
    }
  ["/api/Admin/ExceptionLog"]: {
      pageIndex?: number
      TypeID?: number
      Title?: string
      Date1?: string | Date
      Date2?: string | Date
      IsSolve?: boolean
    }
  ["/api/Admin/ExceptionLog/{id}"]: {
      id: number
    }
  ["/api/FileAsset/List"]: {
      /** 第几页 */
      PageIndex?: number
      /** 页大小 */
      PageSize?: number
      /** 目录 ID */
      FoldID?: number
      /** 目录名或文件名 */
      Name?: string
      /** 文件类型
    
    0 = File (其他文件)
    
    1 = Image (图片文件)
    
    2 = Video (视频文件)
    
    3 = Audio (音频文件)
    
    4 = Text (文本文件)
    
    5 = Zip (压缩文件)
    
    6 = Exe (可执行文件) */
      Type?: d1.FileAssetType
      /** 是否不包含目录 */
      NoFold?: boolean
      /** 是否启用 */
      IsEnable?: boolean
    }
  ["/api/FileAsset"]: {
      /** 第几页 */
      PageIndex?: number
      /** 页大小 */
      PageSize?: number
      /** 文件名 */
      Name?: string
      /** 文件类型
    
    0 = File (其他文件)
    
    1 = Image (图片文件)
    
    2 = Video (视频文件)
    
    3 = Audio (音频文件)
    
    4 = Text (文本文件)
    
    5 = Zip (压缩文件)
    
    6 = Exe (可执行文件) */
      Type?: d1.FileAssetType
      /** 是否启用 */
      IsEnable?: boolean
    }
  ["/api/FileAsset/Info/{ID}"]: {
      /** 文件 ID */
      ID: number
    }
  ["/api/FileAsset/{ID}"]: {
      /** 文件 ID */
      ID: number
    }
  ["/api/FileAsset/Fold"]: {
      /** 父级 ID */
      FID?: number
      /** 是否启用 */
      IsEnable?: boolean
    }
  ["/api/Admin/LoginLog"]: {
      pageIndex?: number
      Title?: string
      Date1?: string | Date
      Date2?: string | Date
    }
  ["/api/Admin/Menu"]: {
      /** 是否启用 */
      IsEnable?: boolean
      /** 标题 */
      Title?: string
    }
  ["/api/Admin/Menu/{id}"]: {
      id: number
    }
  ["/api/Admin/Menu/Menu"]: {
      IsEnable?: boolean
    }
  ["/api/Admin/Menu/Listrouting"]: {
      UserID?: number
    }
  ["/api/Admin/Permissions/UserList"]: {
      RoleID?: number
    }
  ["/api/Admin/Role/List"]: {
      pageIndex?: number
      title?: string
    }
  ["/api/Admin/Role/{ID}"]: {
      ID: number
    }
  ["/api/Admin/User/{id}"]: {
      id: number
    }
  ["/api/Admin/User"]: {
      pageIndex?: number
      RoleID?: number
      StateID?: number
      Title?: string
      Phone?: string
    }
  ["/api/Admin/User/Export"]: {
      /** 选择用户 */
      RoleID?: number
      /** 选择状态 */
      StateID?: number
      /** 选择标题 */
      Title?: string
      /** 选择手机号 */
      Phone?: string
    }
  ["/api/Upload/FragmentOld/{TaskID}/Meta"]: {
      TaskID: string
    }
  ["/api/Upload/FragmentOld/{TaskID}/Flags"]: {
      TaskID: string
    }
  ["/api/Upload/FragmentOld/{TaskID}/Progress"]: {
      TaskID: string
    }
}
export type PostParams = {
  ["/api/Admin/Login/val"]: {
      con?: string
    }
  ["/api/FileAsset/Fold"]: {
      /** 父级 ID */
      FID?: number
      /** 目录名 */
      Name?: string
    }
}
export type PutParams = {
  ["/api/Admin/ArticleMenu/Enable"]: {
      /** 是否启用 */
      Enable?: boolean
    }
  ["/api/FileAsset/Name"]: {
      /** 文件 ID */
      ID?: number
      /** 新名称 */
      Name?: string
    }
  ["/api/FileAsset/Fold/Name"]: {
      /** 目录 ID */
      ID?: number
      /** 新名称 */
      Name?: string
    }
}
export type DelParams = {
  ["/api/Admin/Advert/{ID}"]: {
      ID: number
    }
  ["/api/Admin/Role/{ID}"]: {
      ID: number
    }
}
export const api = {
  ["/api/Admin/Login"]: {
    /** 登录 */
    get: (params: GetParams["/api/Admin/Login"], config?: (RequestInit & AHttpConfig)) : Promise<d0.LoginResultViewModelApiResult> => aget("/api/Admin/Login", params as any, config),
    /** 登录 */
    post: (body: d0.LoginParam, config?: (RequestInit & AHttpConfig)) : Promise<d0.LoginResultViewModelApiResult> => apost("/api/Admin/Login", body as any, void 0, config),
  },
  ["/api/Admin/Login/VerificationCode"]: {
    /** 获取验证码 */
    get: (config?: (RequestInit & AHttpConfig)) : Promise<any> => aget("/api/Admin/Login/VerificationCode", void 0, config),
  },
  ["/api/Admin/Login/Tokenrefresh"]: {
    /** token刷新 */
    get: (config?: (RequestInit & AHttpConfig)) : Promise<d0.StringApiResult> => aget("/api/Admin/Login/Tokenrefresh", void 0, config),
  },
  ["/api/Admin/Advert"]: {
    /** 获取分类 */
    get: (config?: (RequestInit & AHttpConfig)) : Promise<d1.IDTitleViewModelApiResultList> => aget("/api/Admin/Advert", void 0, config),
    /** 添加 */
    post: (body: d1.AdverViewModel, config?: (RequestInit & AHttpConfig)) : Promise<d1.ApiResult> => apost("/api/Admin/Advert", body as any, void 0, config),
    /** 编辑 */
    put: (body: d1.AdverViewModel, config?: (RequestInit & AHttpConfig)) : Promise<d1.ApiResult> => aput("/api/Admin/Advert", body as any, void 0, config),
  },
  ["/api/Admin/Advert/List"]: {
    /** 列表 */
    get: (params: GetParams["/api/Admin/Advert/List"], config?: (RequestInit & AHttpConfig)) : Promise<d1.AdverViewModelApiResultPage> => aget("/api/Admin/Advert/List", params as any, config),
  },
  ["/api/Admin/Advert/{ID}"]: {
    /** 详情显示 */
    get: ({ ID, ...params }: GetParams["/api/Admin/Advert/{ID}"], config?: (RequestInit & AHttpConfig)) : Promise<d1.AdverViewModelApiResult> => aget("/api/Admin/Advert/{ID}".replace("{ID}", `${ID}`), params as any, config),
    /**  */
    del: ({ ID, ...params }: DelParams["/api/Admin/Advert/{ID}"], config?: (RequestInit & AHttpConfig)) : Promise<d1.ApiResult> => adel("/api/Admin/Advert/{ID}".replace("{ID}", `${ID}`), void 0, params as any, config),
  },
  ["/api/Admin/AdvertType"]: {
    /** 列表显示 */
    get: (params: GetParams["/api/Admin/AdvertType"], config?: (RequestInit & AHttpConfig)) : Promise<d1.AdvertTypeApiResultPage> => aget("/api/Admin/AdvertType", params as any, config),
    /** 添加 */
    post: (body: d1.AddParam, config?: (RequestInit & AHttpConfig)) : Promise<d1.ApiResult> => apost("/api/Admin/AdvertType", body as any, void 0, config),
    /** 修改 */
    put: (body: d1.UpdateParam, config?: (RequestInit & AHttpConfig)) : Promise<d1.ApiResult> => aput("/api/Admin/AdvertType", body as any, void 0, config),
  },
  ["/api/Admin/AdvertType/{ID}"]: {
    /** 显示详情 */
    get: ({ ID, ...params }: GetParams["/api/Admin/AdvertType/{ID}"], config?: (RequestInit & AHttpConfig)) : Promise<d1.AdvertTypeApiResult> => aget("/api/Admin/AdvertType/{ID}".replace("{ID}", `${ID}`), params as any, config),
  },
  ["/api/Admin/Article/{ID}"]: {
    /** 详情 */
    get: ({ ID, ...params }: GetParams["/api/Admin/Article/{ID}"], config?: (RequestInit & AHttpConfig)) : Promise<d1.ArticleItemViewModelApiResult> => aget("/api/Admin/Article/{ID}".replace("{ID}", `${ID}`), params as any, config),
  },
  ["/api/Admin/Article/List"]: {
    /** 文章展示 */
    get: (params: GetParams["/api/Admin/Article/List"], config?: (RequestInit & AHttpConfig)) : Promise<d1.ArticleViewModelApiResultPage> => aget("/api/Admin/Article/List", params as any, config),
  },
  ["/api/Admin/Article/GetMenuLevel"]: {
    /** 栏目数据 */
    get: (config?: (RequestInit & AHttpConfig)) : Promise<d1.ELTreeViewModelIEnumerableApiResult> => aget("/api/Admin/Article/GetMenuLevel", void 0, config),
  },
  ["/api/Admin/ArticleMenu"]: {
    /** 栏目列表 */
    get: (params: GetParams["/api/Admin/ArticleMenu"], config?: (RequestInit & AHttpConfig)) : Promise<d1.ELTreeViewModelIEnumerableApiResult> => aget("/api/Admin/ArticleMenu", params as any, config),
    /** 栏目新增 */
    post: (body: d1.NewParam, config?: (RequestInit & AHttpConfig)) : Promise<d1.StringApiResult> => apost("/api/Admin/ArticleMenu", body as any, void 0, config),
    /** 栏目更新 */
    put: (body: d1.EditParam, config?: (RequestInit & AHttpConfig)) : Promise<d1.StringApiResult> => aput("/api/Admin/ArticleMenu", body as any, void 0, config),
  },
  ["/api/Admin/ArticleMenu/{ID}"]: {
    /** 根据id查 */
    get: ({ ID, ...params }: GetParams["/api/Admin/ArticleMenu/{ID}"], config?: (RequestInit & AHttpConfig)) : Promise<d1.ObjectApiResult> => aget("/api/Admin/ArticleMenu/{ID}".replace("{ID}", `${ID}`), params as any, config),
  },
  ["/api/Admin/Config/List"]: {
    /** 列表显示 */
    get: (params: GetParams["/api/Admin/Config/List"], config?: (RequestInit & AHttpConfig)) : Promise<d1.ConfigApiResultPage> => aget("/api/Admin/Config/List", params as any, config),
  },
  ["/api/Admin/Config/ID"]: {
    /** 详情显示 */
    get: (params: GetParams["/api/Admin/Config/ID"], config?: (RequestInit & AHttpConfig)) : Promise<d1.ConfigApiResult> => aget("/api/Admin/Config/ID", params as any, config),
  },
  ["/api/Admin/ExceptionLog"]: {
    /** 列表显示 */
    get: (params: GetParams["/api/Admin/ExceptionLog"], config?: (RequestInit & AHttpConfig)) : Promise<d1.ExceptionLogViewModelApiResultPage> => aget("/api/Admin/ExceptionLog", params as any, config),
    /** 批量处理 */
    put: (body: number[], config?: (RequestInit & AHttpConfig)) : Promise<d1.UnitApiResultPage> => aput("/api/Admin/ExceptionLog", body as any, void 0, config),
    /** 删除 */
    del: (body: number[], config?: (RequestInit & AHttpConfig)) : Promise<d1.UnitApiResultPage> => adel("/api/Admin/ExceptionLog", body as any, void 0, config),
  },
  ["/api/Admin/ExceptionLog/{id}"]: {
    /** 详情查看 */
    get: ({ id, ...params }: GetParams["/api/Admin/ExceptionLog/{id}"], config?: (RequestInit & AHttpConfig)) : Promise<d1.ExceptionLogViewModelApiResult> => aget("/api/Admin/ExceptionLog/{id}".replace("{id}", `${id}`), params as any, config),
  },
  ["/api/FileAsset/List"]: {
    /** 获取某个目录下的目录和文件 */
    get: (params: GetParams["/api/FileAsset/List"], config?: (RequestInit & AHttpConfig)) : Promise<d1.CommonAssetViewModelApiResultPage> => aget("/api/FileAsset/List", params as any, config),
  },
  ["/api/FileAsset"]: {
    /** 列表显示所有文件 */
    get: (params: GetParams["/api/FileAsset"], config?: (RequestInit & AHttpConfig)) : Promise<d1.FileAssetListViewModelApiResultPage> => aget("/api/FileAsset", params as any, config),
    /** 编辑详情 */
    put: (body: d1.FileAssetListEditViewModel, config?: (RequestInit & AHttpConfig)) : Promise<d1.ApiResult> => aput("/api/FileAsset", body as any, void 0, config),
    /** 批量删除 */
    del: (body: number[], config?: (RequestInit & AHttpConfig)) : Promise<d1.ApiResult> => adel("/api/FileAsset", body as any, void 0, config),
  },
  ["/api/FileAsset/Info/{ID}"]: {
    /** 获取展示详情 */
    get: ({ ID, ...params }: GetParams["/api/FileAsset/Info/{ID}"], config?: (RequestInit & AHttpConfig)) : Promise<d1.FileAssetListViewModelApiResult> => aget("/api/FileAsset/Info/{ID}".replace("{ID}", `${ID}`), params as any, config),
  },
  ["/api/FileAsset/{ID}"]: {
    /** 获取详情 */
    get: ({ ID, ...params }: GetParams["/api/FileAsset/{ID}"], config?: (RequestInit & AHttpConfig)) : Promise<d1.FileAssetListEditViewModelApiResult> => aget("/api/FileAsset/{ID}".replace("{ID}", `${ID}`), params as any, config),
  },
  ["/api/FileAsset/Fold"]: {
    /** 获取目录 */
    get: (params: GetParams["/api/FileAsset/Fold"], config?: (RequestInit & AHttpConfig)) : Promise<d1.FoldAssetViewModelApiResultList> => aget("/api/FileAsset/Fold", params as any, config),
    /** 添加目录 */
    post: (params: PostParams["/api/FileAsset/Fold"], config?: (RequestInit & AHttpConfig)) : Promise<d1.Int32ApiResult> => apost("/api/FileAsset/Fold", void 0, params as any, config),
    /** 删除目录 */
    del: (body: number[], config?: (RequestInit & AHttpConfig)) : Promise<d1.ApiResult> => adel("/api/FileAsset/Fold", body as any, void 0, config),
  },
  ["/api/Admin/Index"]: {
    /** 首页下拉菜单接口 */
    get: (config?: (RequestInit & AHttpConfig)) : Promise<d1.MenuViewModelApiResultList> => aget("/api/Admin/Index", void 0, config),
  },
  ["/api/Admin/Index/Index2"]: {
    /** 用户信息 */
    get: (config?: (RequestInit & AHttpConfig)) : Promise<d1.StringApiResult> => aget("/api/Admin/Index/Index2", void 0, config),
  },
  ["/api/Admin/LoginLog"]: {
    /** 列表显示 */
    get: (params: GetParams["/api/Admin/LoginLog"], config?: (RequestInit & AHttpConfig)) : Promise<d1.LoginLogViewModelApiResultPage> => aget("/api/Admin/LoginLog", params as any, config),
  },
  ["/api/Admin/Menu"]: {
    /** 列表显示 */
    get: (params: GetParams["/api/Admin/Menu"], config?: (RequestInit & AHttpConfig)) : Promise<d1.MenuApiResultPage> => aget("/api/Admin/Menu", params as any, config),
    /** 添加菜单 */
    post: (body: d1.AddMenuParam, config?: (RequestInit & AHttpConfig)) : Promise<d1.ApiResult> => apost("/api/Admin/Menu", body as any, void 0, config),
    /** 编辑 */
    put: (body: d1.Menu, config?: (RequestInit & AHttpConfig)) : Promise<d1.ApiResult> => aput("/api/Admin/Menu", body as any, void 0, config),
  },
  ["/api/Admin/Menu/{id}"]: {
    /** 详情显示 */
    get: ({ id, ...params }: GetParams["/api/Admin/Menu/{id}"], config?: (RequestInit & AHttpConfig)) : Promise<d1.MenuApiResult> => aget("/api/Admin/Menu/{id}".replace("{id}", `${id}`), params as any, config),
  },
  ["/api/Admin/Menu/Menu"]: {
    /** 查询下拉框菜单 */
    get: (params: GetParams["/api/Admin/Menu/Menu"], config?: (RequestInit & AHttpConfig)) : Promise<d1.IDTitleViewModelApiResultPage> => aget("/api/Admin/Menu/Menu", params as any, config),
  },
  ["/api/Admin/Menu/Listrouting"]: {
    /** 栏目路由管理列表 */
    get: (params: GetParams["/api/Admin/Menu/Listrouting"], config?: (RequestInit & AHttpConfig)) : Promise<d1.APIRoutViewModelIEnumerableApiResult> => aget("/api/Admin/Menu/Listrouting", params as any, config),
  },
  ["/api/Admin/Permissions/GetRole"]: {
    /** 获取角色数据 */
    get: (config?: (RequestInit & AHttpConfig)) : Promise<d1.IDTitleViewModelApiResultList> => aget("/api/Admin/Permissions/GetRole", void 0, config),
  },
  ["/api/Admin/Permissions/GetMenu"]: {
    /** 获取菜单数据 */
    get: (config?: (RequestInit & AHttpConfig)) : Promise<d1.ELTreeViewModelApiResultList> => aget("/api/Admin/Permissions/GetMenu", void 0, config),
  },
  ["/api/Admin/Permissions/UserList"]: {
    /** 根据id显示权限 */
    get: (params: GetParams["/api/Admin/Permissions/UserList"], config?: (RequestInit & AHttpConfig)) : Promise<d1.IDTitleViewModelApiResultPage> => aget("/api/Admin/Permissions/UserList", params as any, config),
  },
  ["/api/Admin/Role/List2"]: {
    /** 列表 */
    get: (config?: (RequestInit & AHttpConfig)) : Promise<d1.RoleListApiResult> => aget("/api/Admin/Role/List2", void 0, config),
  },
  ["/api/Admin/Role/List"]: {
    /** 列表显示带分页 */
    get: (params: GetParams["/api/Admin/Role/List"], config?: (RequestInit & AHttpConfig)) : Promise<d1.RoleApiResultPage> => aget("/api/Admin/Role/List", params as any, config),
  },
  ["/api/Admin/Role/{ID}"]: {
    /** 详情显示 */
    get: ({ ID, ...params }: GetParams["/api/Admin/Role/{ID}"], config?: (RequestInit & AHttpConfig)) : Promise<d1.RoleApiResult> => aget("/api/Admin/Role/{ID}".replace("{ID}", `${ID}`), params as any, config),
    /** 根据ID删除 */
    del: ({ ID, ...params }: DelParams["/api/Admin/Role/{ID}"], config?: (RequestInit & AHttpConfig)) : Promise<d1.ApiResult> => adel("/api/Admin/Role/{ID}".replace("{ID}", `${ID}`), void 0, params as any, config),
  },
  ["/api/Admin/User/Item"]: {
    /** 自己详情 */
    get: (config?: (RequestInit & AHttpConfig)) : Promise<d1.UserInfoApiResult> => aget("/api/Admin/User/Item", void 0, config),
  },
  ["/api/Admin/User/{id}"]: {
    /** 选择用户查看 */
    get: ({ id, ...params }: GetParams["/api/Admin/User/{id}"], config?: (RequestInit & AHttpConfig)) : Promise<d1.SysUserViewModelApiResult> => aget("/api/Admin/User/{id}".replace("{id}", `${id}`), params as any, config),
  },
  ["/api/Admin/User/GetRoleViewModel"]: {
    /** 获取角色全部信息 */
    get: (config?: (RequestInit & AHttpConfig)) : Promise<d1.IDTitleViewModelApiResultList> => aget("/api/Admin/User/GetRoleViewModel", void 0, config),
  },
  ["/api/Admin/User"]: {
    /** 列表显示 */
    get: (params: GetParams["/api/Admin/User"], config?: (RequestInit & AHttpConfig)) : Promise<d1.SysUserViewModelApiResultPage> => aget("/api/Admin/User", params as any, config),
    /** 添加 */
    post: (body: d1.APIUserViewModel, config?: (RequestInit & AHttpConfig)) : Promise<d1.StringApiResult> => apost("/api/Admin/User", body as any, void 0, config),
    /** 编辑 */
    put: (body: d1.PutAPIUserViewModel, config?: (RequestInit & AHttpConfig)) : Promise<d1.StringApiResult> => aput("/api/Admin/User", body as any, void 0, config),
  },
  ["/api/Admin/User/Export"]: {
    /** a标签页面跳转导出 */
    get: (params: GetParams["/api/Admin/User/Export"], config?: (RequestInit & AHttpConfig)) : Promise<any> => aget("/api/Admin/User/Export", params as any, config),
  },
  ["/api/Admin/Welcome/ArticleCount"]: {
    /** 文章数量 */
    get: (config?: (RequestInit & AHttpConfig)) : Promise<d1.ObjectApiResult> => aget("/api/Admin/Welcome/ArticleCount", void 0, config),
  },
  ["/api/Admin/Welcome/UsersCount"]: {
    /** 用户数量 */
    get: (config?: (RequestInit & AHttpConfig)) : Promise<d1.ObjectApiResult> => aget("/api/Admin/Welcome/UsersCount", void 0, config),
  },
  ["/api/Admin/Welcome/AdvertCount"]: {
    /** 广告数量 */
    get: (config?: (RequestInit & AHttpConfig)) : Promise<d1.ObjectApiResult> => aget("/api/Admin/Welcome/AdvertCount", void 0, config),
  },
  ["/api/Admin/Welcome/UsersLoginCount"]: {
    /** 用户登录次数 */
    get: (config?: (RequestInit & AHttpConfig)) : Promise<d1.ObjectApiResult> => aget("/api/Admin/Welcome/UsersLoginCount", void 0, config),
  },
  ["/api/Admin/Welcome/ExLoginCount"]: {
    /** 程序异常次数 */
    get: (config?: (RequestInit & AHttpConfig)) : Promise<d1.ObjectApiResult> => aget("/api/Admin/Welcome/ExLoginCount", void 0, config),
  },
  ["/api/Upload/FragmentOld/{TaskID}/Meta"]: {
    /** 获取上传任务元信息 (Auth) */
    get: ({ TaskID, ...params }: GetParams["/api/Upload/FragmentOld/{TaskID}/Meta"], config?: (RequestInit & AHttpConfig)) : Promise<d3.GetMetaInfoResultApiResult> => aget("/api/Upload/FragmentOld/{TaskID}/Meta".replace("{TaskID}", `${TaskID}`), params as any, config),
  },
  ["/api/Upload/FragmentOld/{TaskID}/Flags"]: {
    /** 获取上传任务进度标志位 (Auth) */
    get: ({ TaskID, ...params }: GetParams["/api/Upload/FragmentOld/{TaskID}/Flags"], config?: (RequestInit & AHttpConfig)) : Promise<any> => aget("/api/Upload/FragmentOld/{TaskID}/Flags".replace("{TaskID}", `${TaskID}`), params as any, config),
  },
  ["/api/Upload/FragmentOld/{TaskID}/Progress"]: {
    /** 查询上传任务进度, 返回已上传的区块数量 (Auth) */
    get: ({ TaskID, ...params }: GetParams["/api/Upload/FragmentOld/{TaskID}/Progress"], config?: (RequestInit & AHttpConfig)) : Promise<d3.Int32ApiResult> => aget("/api/Upload/FragmentOld/{TaskID}/Progress".replace("{TaskID}", `${TaskID}`), params as any, config),
  },
  ["/api/Admin/Login/Secure"]: {
    /** 登录安全版，需要前端直接传散列后的密码 */
    post: (body: d0.LoginParam, config?: (RequestInit & AHttpConfig)) : Promise<d0.LoginResultViewModelApiResult> => apost("/api/Admin/Login/Secure", body as any, void 0, config),
  },
  ["/api/Admin/Login/val"]: {
    /** 获取百度富文本图片 */
    post: (params: PostParams["/api/Admin/Login/val"], config?: (RequestInit & AHttpConfig)) : Promise<boolean> => apost("/api/Admin/Login/val", void 0, params as any, config),
  },
  ["/api/Admin/Article/Postfile"]: {
    /** 上传文件 */
    post: (config?: (RequestInit & AHttpConfig)) : Promise<any> => apost("/api/Admin/Article/Postfile", void 0, void 0, config),
  },
  ["/api/Admin/Article/PostImage"]: {
    /** 上传图片 */
    post: (config?: (RequestInit & AHttpConfig)) : Promise<any> => apost("/api/Admin/Article/PostImage", void 0, void 0, config),
  },
  ["/api/Admin/Article/Add"]: {
    /** 添加 */
    post: (body: d1.ArticlePostViewModel, config?: (RequestInit & AHttpConfig)) : Promise<d1.StringApiResult> => apost("/api/Admin/Article/Add", body as any, void 0, config),
  },
  ["/api/Admin/Config"]: {
    /** 添加 */
    post: (body: d1.AddConfigParam, config?: (RequestInit & AHttpConfig)) : Promise<d1.ApiResult> => apost("/api/Admin/Config", body as any, void 0, config),
    /** 修改 */
    put: (body: d1.Config, config?: (RequestInit & AHttpConfig)) : Promise<d1.ApiResult> => aput("/api/Admin/Config", body as any, void 0, config),
  },
  ["/api/FileAsset/Move"]: {
    /** 移动目录和文件 */
    post: (body: d1.MoveParam, config?: (RequestInit & AHttpConfig)) : Promise<d1.ApiResult> => apost("/api/FileAsset/Move", body as any, void 0, config),
  },
  ["/api/Admin/Role"]: {
    /** 添加 */
    post: (body: d1.AddRoleParam, config?: (RequestInit & AHttpConfig)) : Promise<d1.ApiResult> => apost("/api/Admin/Role", body as any, void 0, config),
    /** 编辑 */
    put: (body: d1.Role, config?: (RequestInit & AHttpConfig)) : Promise<d1.ApiResult> => aput("/api/Admin/Role", body as any, void 0, config),
    /** 部分编辑 */
    patch: (body: d1.UpdateRoleParam, config?: (RequestInit & AHttpConfig)) : Promise<d1.StringApiResult> => apatch("/api/Admin/Role", body as any, void 0, config),
  },
  ["/api/Upload/Fragment"]: {
    /** 分片上传 (Auth) */
    post: (config?: (RequestInit & AHttpConfig)) : Promise<d3.ObjectApiResult> => apost("/api/Upload/Fragment", void 0, void 0, config),
  },
  ["/api/Upload/FragmentOld"]: {
    /** 创建上传任务 (Auth) */
    post: (body: d3.CreateUploadTaskParam, config?: (RequestInit & AHttpConfig)) : Promise<d3.CreateUploadTaskResultApiResult> => apost("/api/Upload/FragmentOld", body as any, void 0, config),
    /** 上传文件分片 (Auth) */
    put: (config?: (RequestInit & AHttpConfig)) : Promise<d3.ApiResult> => aput("/api/Upload/FragmentOld", void 0, void 0, config),
    /** 完成上传任务 (Auth) */
    patch: (body: string, config?: (RequestInit & AHttpConfig)) : Promise<d3.FinishUploadResultApiResult> => apatch("/api/Upload/FragmentOld", body as any, void 0, config),
  },
  ["/api/Admin/Article/Update"]: {
    /** 修改 */
    put: (body: d1.ArticlePostViewModel, config?: (RequestInit & AHttpConfig)) : Promise<d1.StringApiResult> => aput("/api/Admin/Article/Update", body as any, void 0, config),
  },
  ["/api/Admin/ArticleMenu/ModifyParentID"]: {
    /** 更换父级 */
    put: (body: d1.ModifyParentIDParam, config?: (RequestInit & AHttpConfig)) : Promise<d1.StringApiResult> => aput("/api/Admin/ArticleMenu/ModifyParentID", body as any, void 0, config),
  },
  ["/api/Admin/ArticleMenu/Enable"]: {
    /** 启用禁用 */
    put: (body: number[], params: PutParams["/api/Admin/ArticleMenu/Enable"], config?: (RequestInit & AHttpConfig)) : Promise<d1.UnitApiResultPage> => aput("/api/Admin/ArticleMenu/Enable", body as any, params as any, config),
  },
  ["/api/Admin/ConfigBase"]: {
    /**  */
    put: (body: d1.ConfigBase, config?: (RequestInit & AHttpConfig)) : Promise<d1.ApiResult> => aput("/api/Admin/ConfigBase", body as any, void 0, config),
  },
  ["/api/FileAsset/Edit"]: {
    /** 通用编辑，编辑文件或目录 */
    put: (body: d1.CommonAssetViewEditModel, config?: (RequestInit & AHttpConfig)) : Promise<d1.ApiResult> => aput("/api/FileAsset/Edit", body as any, void 0, config),
  },
  ["/api/FileAsset/Name"]: {
    /** 编辑文件名 */
    put: (params: PutParams["/api/FileAsset/Name"], config?: (RequestInit & AHttpConfig)) : Promise<d1.ApiResult> => aput("/api/FileAsset/Name", void 0, params as any, config),
  },
  ["/api/FileAsset/Fold/Name"]: {
    /** 编辑目录名 */
    put: (params: PutParams["/api/FileAsset/Fold/Name"], config?: (RequestInit & AHttpConfig)) : Promise<d1.ApiResult> => aput("/api/FileAsset/Fold/Name", void 0, params as any, config),
  },
  ["/api/Admin/Index/UpdatePwd"]: {
    /** 修改密码 */
    put: (body: d1.UpdatePwdParam, config?: (RequestInit & AHttpConfig)) : Promise<d1.UnitApiResult> => aput("/api/Admin/Index/UpdatePwd", body as any, void 0, config),
  },
  ["/api/Admin/Menu/Enable"]: {
    /** 启用禁用 */
    put: (body: d1.EnableParam, config?: (RequestInit & AHttpConfig)) : Promise<d1.UnitApiResultPage> => aput("/api/Admin/Menu/Enable", body as any, void 0, config),
  },
  ["/api/Admin/Permissions"]: {
    /** 更新权限菜单 */
    put: (body: d1.SetMenusParam, config?: (RequestInit & AHttpConfig)) : Promise<d1.ApiResult> => aput("/api/Admin/Permissions", body as any, void 0, config),
  },
  ["/api/Admin/User/Import"]: {
    /** 导入数据 */
    put: (config?: (RequestInit & AHttpConfig)) : Promise<d1.SysUserViewModelIEnumerableApiResult> => aput("/api/Admin/User/Import", void 0, void 0, config),
  },
  ["/api/Admin/Article/SetState"]: {
    /** 删除 */
    del: (body: number[], config?: (RequestInit & AHttpConfig)) : Promise<d1.UnitApiResultPage> => adel("/api/Admin/Article/SetState", body as any, void 0, config),
  },
  ["/api/Admin/LoginLog/Delete"]: {
    /** 删除 */
    del: (body: number[], config?: (RequestInit & AHttpConfig)) : Promise<d1.UnitApiResultPage> => adel("/api/Admin/LoginLog/Delete", body as any, void 0, config),
  },
  ["/api/Admin/User/Delete"]: {
    /** 删除 */
    del: (body: number[], config?: (RequestInit & AHttpConfig)) : Promise<d1.UnitApiResultPage> => adel("/api/Admin/User/Delete", body as any, void 0, config),
  },
}