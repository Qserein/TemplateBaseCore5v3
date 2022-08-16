import { version as version_ } from '../package.json'

/** 判断是不是开发环境 */
export const isDevelopment = import.meta.env.DEV

/** Api 请求地址 */
export let baseURL = 'http://192.168.1.85:8005'
baseURL = 'http://localhost:4573'

/** 请求超时时间 */
export const reqTimeout = 0 // 5000

/** 版本号 */
export const version = version_
