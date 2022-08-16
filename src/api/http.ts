import { baseURL, isDevelopment, reqTimeout } from '../config'
import router from '../router'
import NProgress from 'nprogress'
import { ElMessage } from 'element-plus'
import { ApiResult, ApiResultBasic } from './def'
import { seq } from 'libsugar/seq'

/** 参数对象 */
export type QueryParams = Record<string, unknown> | unknown[]

/** 构建查询字符串, 不包含 ? */
export function buildFormData(params: QueryParams): FormData {
  const fd = new FormData()
  for (const [k, v] of Object.entries(params)) {
    switch (typeof v) {
      case 'bigint':
      case 'boolean':
      case 'number':
        fd.append(k, `${v}`)
        break
      case 'string':
        fd.append(k, v)
        break
      case 'undefined':
        break
      case 'object':
        if (v == null) break
        else if (v instanceof Date) fd.append(k, v.toString())
        else if (v instanceof File) fd.append(k, v, v.name)
        else if (v instanceof Blob) fd.append(k, v)
        else fd.append(k, JSON.stringify(v))
    }
  }
  return fd
}

/** 构建查询字符串, 不包含 ? */
export function buildQueryString(params: QueryParams): string {
  return seq(Object.entries(params))
    .map(([k, v]) => [
      k,
      (() => {
        switch (typeof v) {
          case 'bigint':
          case 'boolean':
          case 'number':
            return `${v}`
          case 'string':
            return v
          case 'undefined':
            return ''
          case 'object':
            if (v == null) return ''
            else if (v instanceof Date) return v.toJSON()
            else return JSON.stringify(v)
          default:
            return ''
        }
      })(),
    ])
    .filter(([k, v]) => k != null && k != '' && v != null)
    .map(([k, v]) => `${encodeURIComponent(k!)}=${encodeURIComponent(v!)}`)
    .join('&')
}

type AMethodBasci = 'Get' | 'Post' | 'Put' | 'Delete' | 'Patch' | 'Head'
export type AMethod = Lowercase<AMethodBasci> | Uppercase<AMethodBasci>

/** 异步 http 请求的配置选项 */
export interface AHttpConfig {
  /** 是否不打印请求记录 */
  nolog?: boolean
  /** 是否是没有 ApiResult 的接口 */
  nores?: boolean
  /** 请求发送的数据类型，默认 json */
  reqType?: 'json' | 'raw'
  /** 请求返回的数据类型，默认 json */
  resType?: 'json' | 'arraybuffer' | 'text' | 'blob' | 'formData'
  /** 存放在 body 内的数据 */
  data?: BodyInit | QueryParams
  /** 从 url 传递的参数 */
  params?: QueryParams
  /** 是否不包含身份验证 */
  noAuth?: boolean
}

/** 异步 http 请求 */
export async function ahttp<T>(url: string, method: AMethod, config?: RequestInit & AHttpConfig & { resType: 'formData' }): Promise<FormData>
export async function ahttp<T>(url: string, method: AMethod, config?: RequestInit & AHttpConfig & { resType: 'blob' }): Promise<Blob>
export async function ahttp<T>(url: string, method: AMethod, config?: RequestInit & AHttpConfig & { resType: 'text' }): Promise<string>
export async function ahttp<T>(url: string, method: AMethod, config?: RequestInit & AHttpConfig & { resType: 'arraybuffer' }): Promise<ArrayBuffer>
export async function ahttp<T = ApiResultBasic>(url: string, method: AMethod, config?: RequestInit & AHttpConfig): Promise<T>
export async function ahttp<T>(url: string, method: AMethod, config?: RequestInit & AHttpConfig): Promise<any> {
  let reqUrl = `${baseURL}${url}`
  let token = localStorage.getItem('token')
  const nolog = config?.nolog
  let reqType = config?.reqType
  const resType = config?.resType
  const noAuth = config?.noAuth
  const isget = method.toLowerCase() == 'get'
  const params = config?.params
  let body = config?.data
  if (reqType == null && (body instanceof FormData || body instanceof Blob)) reqType = 'raw'
  if (body != null && (reqType == null || reqType == 'json')) {
    body = JSON.stringify(body)
  }
  if (params) {
    const query = buildQueryString(params)
    if (query) {
      reqUrl = `${reqUrl}?${query}`
    }
  }
  const controller = new AbortController()
  try {
    NProgress.start()
    let retry = 0
    return await doReq()
    async function doReq(): Promise<T | { res: boolean } | undefined> {
      let timeoutId: number | undefined
      if (reqTimeout > 0) {
        controller.signal.addEventListener('abort', () => NProgress.done())
        timeoutId = setTimeout(() => controller.abort(), reqTimeout) as any
      }
      const res = await fetch(reqUrl, {
        method,
        body: body as any,
        mode: 'cors',
        credentials: 'include',
        signal: controller.signal,
        ...config,
        headers: {
          ...(reqType === 'json' || reqType == null
            ? {
                'Content-Type': 'application/json',
              }
            : {}),
          ...(token && !noAuth
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {}),
          ...config?.headers,
        },
      })
      clearTimeout(timeoutId)
      if (res.ok) {
        const data: T =
          resType == null || resType == 'json'
            ? await res.json()
            : await (() => {
                switch (resType) {
                  case 'arraybuffer':
                    return res.arrayBuffer()
                  case 'blob':
                    return res.blob()
                  case 'formData':
                    return res.formData()
                  default:
                    return res.text()
                }
              })()
        if (isDevelopment && !nolog) {
          console.info(
            `%c${method}%c%s%o${!isget ? '%c %o' : ''}%c\n%o`,
            'background-color: #34495e; color: #fcfcfc; border-radius: 5px; padding: 1px 5px; margin-right: 5px;',
            'background-color: #4fc08d; color: #fcfcfc; border-radius: 5px; padding: 1px 5px; margin-right: 5px;',
            url,
            ...(isget ? [config?.params || {}] : [tryShowData(config?.data), '', config?.params || {}]),
            '',
            data
          )
        }
        return data
      } else if (res.status === 401) {
        if (token && !noAuth && retry < 2) {
          const rr = await fetch(`${baseURL}/api/Admin/Login/Tokenrefresh`, {
            method: 'get',
            mode: 'cors',
            credentials: 'include',
            signal: controller.signal,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          if (rr.ok) {
            const rrd: ApiResult<string> = await rr.json()
            if (rrd.success) {
              localStorage.setItem('token', (token = rrd.data))
              return doReq()
            }
          }
        }
        if (isDevelopment && !nolog) {
          console.warn(
            `%c${method}%c%s%o${!isget ? '%c %o' : ''}%c\n%c登录过期%o`,
            'background-color: #F7941D; color: #fcfcfc; border-radius: 5px; padding: 1px 5px; margin-right: 5px;',
            'background-color: #fdd835; color: #6d4c41; border-radius: 5px; padding: 1px 5px; margin-right: 5px;',
            url,
            ...(isget ? [config?.params || {}] : [tryShowData(config?.data), '', config?.params || {}]),
            '',
            'background-color: #c0ca33; color: #524c00; border-radius: 5px; padding: 1px 5px; margin-right: 5px; margin-top: 5px;',
            await tryResLog(res)
          )
        }
        localStorage.setItem('isDated', 'true')
        localStorage.removeItem('token')
        router.replace({ path: '/login' })
      } else {
        if (isDevelopment && !nolog) {
          console.error(
            `%c${method}%c%s%o${!isget ? '%c %o' : ''}%c\n%o`,
            'background-color: #c63c1b; color: #fcfcfc; border-radius: 5px; padding: 1px 5px; margin-right: 5px;',
            'background-color: #e45735; color: #fcfcfc; border-radius: 5px; padding: 1px 5px; margin-right: 5px;',
            url,
            ...(isget ? [config?.params || {}] : [tryShowData(config?.data), '', config?.params || {}]),
            '',
            await tryResLog(res)
          )
        }
      }
      return config?.nores ? void 0 : { res: false }
    }
  } catch (err) {
    if (!isDevelopment) console.error(err)
    if (isDevelopment && !nolog) {
      console.error(
        `%c${method}%c%s%o${!isget ? '%c %o' : ''}%c\n%o`,
        'background-color: #c63c1b; color: #fcfcfc; border-radius: 5px; padding: 1px 5px; margin-right: 5px;',
        'background-color: #e45735; color: #fcfcfc; border-radius: 5px; padding: 1px 5px; margin-right: 5px;',
        url,
        ...(isget ? [config?.params] : [config?.data, '', config?.params]),
        '',
        err instanceof Response ? await tryResLog(err) : err
      )
    }
    if (controller.signal.aborted) ElMessage.error(`请求超时`)
    else ElMessage.error(`${err}`)
    return config?.nores ? void 0 : { res: false }
  } finally {
    NProgress.done()
  }
  async function tryResLog(res: Response) {
    try {
      const text = await res.text()
      try {
        return JSON.parse(text)
      } catch {
        return text
      }
    } catch {
      return res
    }
  }
  function tryShowData(v: unknown) {
    if (v instanceof FormData) {
      try {
        return Object.fromEntries((v as any).entries())
      } catch {}
    }
    return v
  }
}

/** 异步 get 请求 */
export async function aget<T>(url: string, params: QueryParams | undefined, config: RequestInit & AHttpConfig & { resType: 'formData' }): Promise<FormData>
export async function aget<T>(url: string, params: QueryParams | undefined, config: RequestInit & AHttpConfig & { resType: 'blob' }): Promise<Blob>
export async function aget<T>(url: string, params: QueryParams | undefined, config: RequestInit & AHttpConfig & { resType: 'text' }): Promise<string>
export async function aget<T>(url: string, params: QueryParams | undefined, config: RequestInit & AHttpConfig & { resType: 'arraybuffer' }): Promise<ArrayBuffer>
export async function aget<T = ApiResultBasic>(url: string, params?: QueryParams, config?: RequestInit & AHttpConfig): Promise<T>
export async function aget<T>(url: string, params?: QueryParams, config?: RequestInit & AHttpConfig) {
  return await ahttp<T>(url, 'get', { params, ...config })
}

/** 异步 post 请求 */
export async function apost<T>(url: string, data: BodyInit | QueryParams | undefined, params: QueryParams | undefined, config: RequestInit & AHttpConfig & { resType: 'formData' }): Promise<FormData>
export async function apost<T>(url: string, data: BodyInit | QueryParams | undefined, params: QueryParams | undefined, config: RequestInit & AHttpConfig & { resType: 'blob' }): Promise<Blob>
export async function apost<T>(url: string, data: BodyInit | QueryParams | undefined, params: QueryParams | undefined, config: RequestInit & AHttpConfig & { resType: 'text' }): Promise<string>
export async function apost<T>(url: string, data: BodyInit | QueryParams | undefined, params: QueryParams | undefined, config: RequestInit & AHttpConfig & { resType: 'arraybuffer' }): Promise<ArrayBuffer>
export async function apost<T = ApiResultBasic>(url: string, data?: BodyInit | QueryParams, params?: QueryParams, config?: RequestInit & AHttpConfig): Promise<T>
export async function apost<T>(url: string, data?: BodyInit | QueryParams, params?: QueryParams, config?: RequestInit & AHttpConfig) {
  return await ahttp<T>(url, 'post', { data, params, ...config })
}

/** 异步 put 请求 */
export async function aput<T>(url: string, data: BodyInit | QueryParams | undefined, params: QueryParams | undefined, config: RequestInit & AHttpConfig & { resType: 'formData' }): Promise<FormData>
export async function aput<T>(url: string, data: BodyInit | QueryParams | undefined, params: QueryParams | undefined, config: RequestInit & AHttpConfig & { resType: 'blob' }): Promise<Blob>
export async function aput<T>(url: string, data: BodyInit | QueryParams | undefined, params: QueryParams | undefined, config: RequestInit & AHttpConfig & { resType: 'text' }): Promise<string>
export async function aput<T>(url: string, data: BodyInit | QueryParams | undefined, params: QueryParams | undefined, config: RequestInit & AHttpConfig & { resType: 'arraybuffer' }): Promise<ArrayBuffer>
export async function aput<T = ApiResultBasic>(url: string, data?: BodyInit | QueryParams, params?: QueryParams, config?: RequestInit & AHttpConfig): Promise<T>
export async function aput<T>(url: string, data?: BodyInit | QueryParams, params?: QueryParams, config?: RequestInit & AHttpConfig) {
  return await ahttp<T>(url, 'put', { data, params, ...config })
}

/** 异步 delete 请求 */
export async function adel<T>(url: string, data: BodyInit | QueryParams | undefined, params: QueryParams | undefined, config: RequestInit & AHttpConfig & { resType: 'formData' }): Promise<FormData>
export async function adel<T>(url: string, data: BodyInit | QueryParams | undefined, params: QueryParams | undefined, config: RequestInit & AHttpConfig & { resType: 'blob' }): Promise<Blob>
export async function adel<T>(url: string, data: BodyInit | QueryParams | undefined, params: QueryParams | undefined, config: RequestInit & AHttpConfig & { resType: 'text' }): Promise<string>
export async function adel<T>(url: string, data: BodyInit | QueryParams | undefined, params: QueryParams | undefined, config: RequestInit & AHttpConfig & { resType: 'arraybuffer' }): Promise<ArrayBuffer>
export async function adel<T = ApiResultBasic>(url: string, data?: BodyInit | QueryParams, params?: QueryParams, config?: RequestInit & AHttpConfig): Promise<T>
export async function adel<T>(url: string, data?: BodyInit | QueryParams, params?: QueryParams, config?: RequestInit & AHttpConfig) {
  return await ahttp<T>(url, 'delete', { data, params, ...config })
}

/** 异步 patch 请求 */
export async function apatch<T>(url: string, data: BodyInit | QueryParams | undefined, params: QueryParams | undefined, config?: RequestInit & AHttpConfig & { resType: 'formData' }): Promise<FormData>
export async function apatch<T>(url: string, data: BodyInit | QueryParams | undefined, params: QueryParams | undefined, config?: RequestInit & AHttpConfig & { resType: 'blob' }): Promise<Blob>
export async function apatch<T>(url: string, data: BodyInit | QueryParams | undefined, params: QueryParams | undefined, config?: RequestInit & AHttpConfig & { resType: 'text' }): Promise<string>
export async function apatch<T>(url: string, data: BodyInit | QueryParams | undefined, params: QueryParams | undefined, config?: RequestInit & AHttpConfig & { resType: 'arraybuffer' }): Promise<ArrayBuffer>
export async function apatch<T = ApiResultBasic>(url: string, data?: BodyInit | QueryParams, params?: QueryParams, config?: RequestInit & AHttpConfig): Promise<T>
export async function apatch<T>(url: string, data?: BodyInit | QueryParams, params?: QueryParams, config?: RequestInit & AHttpConfig) {
  return await ahttp<T>(url, 'patch', { data, params, ...config })
}
