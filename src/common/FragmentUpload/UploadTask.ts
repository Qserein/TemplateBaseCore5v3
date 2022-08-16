import { FileAssetType } from '../../api/gen/main/types/AdminSystem'
export { FileAssetType } from '../../api/gen/main/types/AdminSystem'

export const enum UploadState {
  None,
  Uploading,
  Failed,
  Finish,
}

export type UpLoadTask = {
  id: string
  url?: string
  fileID?: number
  file: File
  chunk: {
    finish: number
    total: number
    size: number
  }
  state: UploadState
}

/** 上传任务操作 */
export const enum UploadTaskOper {
  /** 创建上传任务，需传 { ExtName: 文件扩展名, FileName: 文件名, Type: 文件类型, FileSize: 文件大小 } 可传 { Width: 宽度, Height: 高度 } 返回 { TaskID: 文件任务 ID, ChunkSize: 文件区块大小, Url: 上传后的文件路径, ID: 文件 ID } */
  Create = 1,
  /** 上传分片，需传 { TaskID: 文件任务 ID, Number: 文件分片序号, Chunk: 文件分片 } */
  Upload,
}

const imgRegex = /^image\//iu
const videoRegex = /^video\//iu
const audioRegex = /^audio\//iu
const textRegex = /^text\//iu
const zipMimes = ['application/x-zip-compressed', 'application/x-7z-compressed', 'application/x-rar-compressed', 'application/zip', 'application/x-tar', 'application/x-gzip', 'application/x-bzip', 'application/x-bzip2']
const zipRegex = /\.7z$/iu
const exeRegex = /\.exe$/iu
const textRegex2 = /\.(txt|md|json|js|ts|html|sql)$/iu

/** 获取文件的类型 */
export function getFileType(file: File): FileAssetType {
  if (imgRegex.test(file.type)) return FileAssetType.Image
  else if (videoRegex.test(file.type)) return FileAssetType.Video
  else if (audioRegex.test(file.type)) return FileAssetType.Audio
  else if (textRegex.test(file.type) || textRegex2.test(file.name)) return FileAssetType.Text
  else if (zipMimes.includes(file.type) || zipRegex.test(file.name)) return FileAssetType.Zip
  else if (exeRegex.test(file.name)) return FileAssetType.Exe
  else return FileAssetType.File
}

export async function getWH(file: File, type: FileAssetType): Promise<{ Width: number; Height: number }> {
  const wh = { Width: 0, Height: 0 }
  if (type == FileAssetType.Image) {
    var url = URL.createObjectURL(file)
    try {
      const dom = document.createElement('img')
      dom.src = url
      await new Promise(res => (dom.onload = res))
      wh.Width = dom.naturalWidth
      wh.Height = dom.naturalHeight
    } finally {
      URL.revokeObjectURL(url)
    }
  } else if (type == FileAssetType.Video) {
    var url = URL.createObjectURL(file)
    try {
      const dom = document.createElement('video')
      dom.src = url
      await new Promise(res => (dom.onloadedmetadata = res))
      wh.Width = dom.videoWidth
      wh.Height = dom.videoHeight
    } finally {
      URL.revokeObjectURL(url)
    }
  }
  return wh
}
