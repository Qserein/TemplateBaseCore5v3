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

/** 创建文件上传任务参数 */
export type CreateUploadTaskParam = {
  /** 文件扩展名 */
  ExtName?: string,
  /** 文件大小 */
  FileSize: number,
}

/** 创建文件上传任务返回值 */
export type CreateUploadTaskResult = {
  /** 文件任务 ID */
  TaskID?: string,
  /** 文件区块大小 */
  ChunkSize: number,
}

/** API 返回值 数据 */
export type CreateUploadTaskResultApiResult = {
  /** 是否成功 */
  success: boolean,
  /** 信息 */
  msg?: string,
  statusCode: ApiEnum,
  data: CreateUploadTaskResult,
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
/** 完成上传任务 */
export type FinishUploadResult = {
  /** 上传后的文件路径 */
  Url?: string,
}

/** API 返回值 数据 */
export type FinishUploadResultApiResult = {
  /** 是否成功 */
  success: boolean,
  /** 信息 */
  msg?: string,
  statusCode: ApiEnum,
  data: FinishUploadResult,
}

/** 获取上传任务元信息 */
export type GetMetaInfoResult = {
  /** 文件大小 */
  FileSize: number,
  /** 分片大小 */
  ChunkSize: number,
}

/** API 返回值 数据 */
export type GetMetaInfoResultApiResult = {
  /** 是否成功 */
  success: boolean,
  /** 信息 */
  msg?: string,
  statusCode: ApiEnum,
  data: GetMetaInfoResult,
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

/** 

1 = Create

2 = Upload */
export enum UploadTaskOper {
  Create = 1,
  Upload = 2,
}