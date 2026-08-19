import {
  BadRequestException,
  Controller,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import { InvalidImageTypeError } from '@/domain/restaurant/application/use-cases/errors/invalid-image-type-error'
import { UploadAndCreateImageUseCase } from '@/domain/restaurant/application/use-cases/upload-and-create-image.usecase'
import { Roles } from '@/infra/auth/roles-decorator'

class UploadImage {
  file: any
}

@ApiTags('admin', 'restaurant', 'images')
@ApiBearerAuth()
@Controller('/images')
export class UploadImageController {
  constructor(private uploadAndCreateImage: UploadAndCreateImageUseCase) {}

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Upload an image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'The image file to be uploaded',
    type: UploadImage,
  })
  @ApiResponse({
    status: 201,
    description: 'The image has been successfully uploaded.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid or missing Bearer token.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Only admin users can upload images.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Invalid file type or size.',
  })
  @UseInterceptors(FileInterceptor('file'))
  async handle(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 2, // 2mb
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const result = await this.uploadAndCreateImage.execute({
      fileName: file.originalname,
      fileType: file.mimetype,
      body: file.buffer,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case InvalidImageTypeError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException('An unexpected error occurred.')
      }
    }

    const { image } = result.value

    return {
      imageId: image.id.toString(),
    }
  }
}
