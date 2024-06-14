import { faker } from '@faker-js/faker';
import { InMemoryBrothsRepository } from 'test/repositories/in-memory-broth-repository';
import { CreateBrothUseCase } from './broth-create.usecase';
import { makeBroth } from 'test/factories/make-broth';
import { BrothAlreadyExistsError } from './errors/broth-already-exists-error';
import { makeImage } from 'test/factories/make-image';

let inMemoryBrothRepository: InMemoryBrothsRepository;
let sut: CreateBrothUseCase; // Subject Under Test

describe('Create Broth', () => {
  beforeEach(() => {
    inMemoryBrothRepository = new InMemoryBrothsRepository();
    sut = new CreateBrothUseCase(inMemoryBrothRepository);
  });

  it('should be able to create a broth', async () => {
    const imageActive = makeImage();
    const imageInactive = makeImage();

    const result = await sut.execute({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      imageActiveId: imageActive.id.toString(),
      imageInactiveId: imageInactive.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      broth: inMemoryBrothRepository.items[0],
    });
  });

  it('should not be able to create a broth with a name already in use', async () => {
    const imageActive = makeImage();
    const imageInactive = makeImage();

    const broth = makeBroth({
      name: 'Salt',
    });

    await inMemoryBrothRepository.create(broth);

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
