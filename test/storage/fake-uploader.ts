import {
  UploadParams,
  Uploader,
} from '@/domain/restaurant/application/storage/uploader';

interface Upload {
  fileName: string;
  url: string;
}

export class FakeUploader implements Uploader {
  public uploads: Upload[] = [];

  async upload({ fileName }: UploadParams): Promise<{ url: string }> {
    const url = `http://www.fakeuploader.test/${fileName}`;

    this.uploads.push({
      fileName,
      url,
    });

    return { url };
  }
}
