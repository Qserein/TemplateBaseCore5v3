import { ElMessageBox } from 'element-plus'
import FragmentUploadVue from './FragmentUpload.vue'
import { h, reactive } from 'vue'
import { empty } from 'libsugar/fn'
import { UpLoadTask } from './UploadTask'

export const FragmentUpload: typeof FragmentUploadVue & { open: typeof openFragmentUpload } = FragmentUploadVue as any
export default FragmentUpload

if (FragmentUpload != null) FragmentUpload.open = openFragmentUpload
else {
  setTimeout(() => {
    ;(FragmentUpload as any).open = openFragmentUpload
  }, 0)
}

export type FragmentUploadProps = {
  /** 要上传的目录 ID */
  fold?: number
  /** 要上传的文件列表，有此字段将不会显示选择文件界面 */
  files?: File[]
  /** 是否允许多选 */
  multiple?: boolean
  /** 允许的 MIME 类型数组 */
  accept?: string[]
  /** 允许上传多少个文件，0 为无限，默认为 0 */
  count?: number
  /** 立即上传，无需等待用户确定 */
  immediateUpload?: boolean
  /** 上传完成后立即关闭，无需等待用户确定 */
  immediateClose?: boolean
  /** 只选择文件，将返回文件数组 */
  selectOnly?: boolean
}
export async function openFragmentUpload(props: FragmentUploadProps & { selectOnly: true }): Promise<File[] | void>
export async function openFragmentUpload(props?: FragmentUploadProps): Promise<string[] | void>
export async function openFragmentUpload(props?: FragmentUploadProps) {
  const data = reactive({ canClose: true, tasks: void 0 as UpLoadTask[] | undefined, files: void 0 as File[] | undefined })
  return new Promise<any>(res => {
    ElMessageBox({
      title: '上传',
      message: h(FragmentUploadVue, { ...props, inMessageBox: data }),
      customClass: 'ui-fragment-upload-dialog',
      closeOnClickModal: false,
      closeOnPressEscape: false,
      closeOnHashChange: false,
      showConfirmButton: false,
      beforeClose(action, instance, done) {
        if (!data.canClose) return
        done()
        if (props?.selectOnly) {
          res(data.files)
        } else {
          res(data.tasks?.map(i => i.url!))
        }
      },
    }).catch(empty)
  })
}
