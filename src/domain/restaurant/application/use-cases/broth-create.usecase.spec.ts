import { faker } from '@faker-js/faker';
import { InMemoryBrothRepository } from 'test/repositories/in-memory-broth-repository';
import { CreateBrothUseCase } from './broth-create.usecase';
import { makeBroth } from 'test/factories/make-broth';
import { BrothAlreadyExistsError } from './errors/broth-already-exists-error';

let inMemoryBrothRepository: InMemoryBrothRepository;
let sut: CreateBrothUseCase; // Subject Under Test

describe('Create Broth', () => {
  beforeEach(() => {
    inMemoryBrothRepository = new InMemoryBrothRepository();
    sut = new CreateBrothUseCase(inMemoryBrothRepository);
  });

  it('should be able to create a broth', async () => {
    const result = await sut.execute({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      broth: inMemoryBrothRepository.items[0],
    });
  });

  it('should not be able to create a broth with a name already in use', async () => {
    const broth = makeBroth({
      name: 'Salt',
    });

    await inMemoryBrothRepository.create(broth);

    const result = await sut.execute({
      name: 'Salt',
      description: faker.commerce.productDescription(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(BrothAlreadyExistsError);
  });
});
