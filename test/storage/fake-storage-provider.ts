import {
  StorageProvider,
  UploadParams,
} from '@/domain/media/application/storage/storage-provider'

interface File {
  fileName: string
  url: string
}

export class FakeStorageProvider implements StorageProvider {
  public items: File[] = []

  async upload({ fileName }: UploadParams): Promise<{ url: string }> {
    const url = `http://www.fakeuploader.test/${fileName}`

    this.items.push({
      fileName,
      url,
    })

    return { url }
  }

  async delete(url: string): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.url === url)

    this.items.splice(itemIndex, 1)
  }
}
