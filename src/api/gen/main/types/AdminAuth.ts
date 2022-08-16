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
/** 登录参数 */
export type LoginParam = {
  /** 账号 */
  userName?: string,
  /** 密码 */
  password?: string,
  /** 验证码 */
  vcode?: string,
}

/** 登录返回值 */
export type LoginResultViewModel = {
  /** ID */
  ID: number,
  /** 用户名 */
  UserName?: string,
  /** 昵称 */
  NickName?: string,
  /** 全名 */
  FullName?: string,
  /** Token */
  token?: string,
}

/** API 返回值 数据 */
export type LoginResultViewModelApiResult = {
  /** 是否成功 */
  success: boolean,
  /** 信息 */
  msg?: string,
  statusCode: ApiEnum,
  data: LoginResultViewModel,
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
