export * from './def'
export * from './http'

import * as api_main from './gen/main/api'

/** 接口 */
export namespace api {
  export const main = api_main.api
}
export default api
