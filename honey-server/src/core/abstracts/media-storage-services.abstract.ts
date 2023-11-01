import { BufferedFile } from '@frameworks/media-storage-services/interface/file.interface'

export abstract class IMediaStorageServices {
  abstract upload(file: BufferedFile, baseBucket?: string): Promise<{ url: string }>
}
