import { InMemoryImagesRepository } from 'test/repositories/in-memory-image-repository';
import { FakeUploader } from 'test/storage/fake-uploader';
import { InvalidImageTypeError } from './errors/invalid-image-type-error';
import { UploadAndCreateImageUseCase } from './upload-and-create-image.usecase';

let inMemoryImagesRepository: InMemoryImagesRepository;
let fakeUploader: FakeUploader;
let sut: UploadAndCreateImageUseCase; // Subject Under Test

describe('Upload and create image', () => {
  beforeEach(() => {
    inMemoryImagesRepository = new InMemoryImagesRepository();
    fakeUploader = new FakeUploader();
    sut = new UploadAndCreateImageUseCase(
      inMemoryImagesRepository,
      fakeUploader,
    );
  });

  it('should be able to upload and create an image', async () => {
    const result = await sut.execute({
      fileName: 'icon.svg',
      fileType: 'image/svg+xml',
      body: Buffer.from(''),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      image: inMemoryImagesRepository.items[0],
    });
    expect(fakeUploader.uploads).toHaveLength(1);
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: 'icon.svg',
      }),
    );
  });

  it('should not be able to upload an attachment with a non allowed file type', async () => {
    const result = await sut.execute({
      fileName: 'profile.mp3',
      fileType: 'audio/mpeg',
      body: Buffer.from(''),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidImageTypeError);
  });
});
