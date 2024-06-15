import { faker } from '@faker-js/faker';
import { makeBroth } from 'test/factories/make-broth';
import { makeImage } from 'test/factories/make-image';
import { InMemoryBrothsRepository } from 'test/repositories/in-memory-broth-repository';
import { InMemoryImagesRepository } from 'test/repositories/in-memory-image-repository';
import { CreateBrothUseCase } from './broth-create.usecase';
import { BrothAlreadyExistsError } from './errors/broth-already-exists-error';

let inMemoryBrothsRepository: InMemoryBrothsRepository;
let inMemoryImagesRepository: InMemoryImagesRepository;
let sut: CreateBrothUseCase; // Subject Under Test

describe('Create Broth', () => {
  beforeEach(() => {
    inMemoryBrothsRepository = new InMemoryBrothsRepository();
    inMemoryImagesRepository = new InMemoryImagesRepository();
    sut = new CreateBrothUseCase(
      inMemoryBrothsRepository,
      inMemoryImagesRepository,
    );
  });

  it('should be able to create a broth', async () => {
    const imageActive = makeImage();

    inMemoryImagesRepository.create(imageActive);

    const imageInactive = makeImage();

    inMemoryImagesRepository.create(imageInactive);

    const result = await sut.execute({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      imageActiveId: imageActive.id.toString(),
      imageInactiveId: imageInactive.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      broth: inMemoryBrothsRepository.items[0],
    });
  });

  it('should not be able to create a broth with a name already in use', async () => {
    const imageActive = makeImage();

    inMemoryImagesRepository.create(imageActive);

    const imageInactive = makeImage();

    inMemoryImagesRepository.create(imageInactive);

    const broth = makeBroth({
      name: 'Salt',
    });

    await inMemoryBrothsRepository.create(broth);

    const result = await sut.execute({
      name: 'Salt',
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      imageActiveId: imageActive.id.toString(),
      imageInactiveId: imageInactive.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(BrothAlreadyExistsError);
  });
});
