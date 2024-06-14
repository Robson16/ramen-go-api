import { Either, left, right } from '@/core/either';
import { ImagesRepository } from '@/domain/restaurant/application/repositories/image-repository';
import { Image } from '@/domain/restaurant/enterprise/entities/image';
import { Injectable } from '@nestjs/common';
import { Uploader } from '../storage/uploader';
import { InvalidImageTypeError } from './errors/invalid-image-type-error';

interface UploadAndCreateImageUseCaseRequest {
  fileName: string;
  fileType: string;
  body: Buffer;
}

type UploadAndCreateImageUseCaseResponse = Either<
  InvalidImageTypeError,
  {
    image: Image;
  }
>;

@Injectable()
export class UploadAndCreateImageUseCase {
  constructor(
    private imagesRepository: ImagesRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    fileName,
    fileType,
    body,
  }: UploadAndCreateImageUseCaseRequest): Promise<UploadAndCreateImageUseCaseResponse> {
    if (!/^image\/(jpeg|png|svg\+xml)$/.test(fileType)) {
      return left(new InvalidImageTypeError(fileType));
    }

    const { url } = await this.uploader.upload({
      fileName,
      fileType,
      body,
    });

    const image = Image.create({
      title: fileName,
      url,
    });

    await this.imagesRepository.create(image);

    return right({
      image,
    });
  }
}
