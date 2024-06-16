import { InMemoryBrothsRepository } from 'test/repositories/in-memory-broth-repository';
import { InMemoryImagesRepository } from 'test/repositories/in-memory-image-repository';
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-order-repository';
import { InMemoryProteinsRepository } from 'test/repositories/in-memory-protein-repository';
import { CreateOrderUseCase } from './order-create.usecase';
import { makeBroth } from 'test/factories/make-broth';
import { makeProtein } from 'test/factories/make-protein';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

let inMemoryImagesRepository: InMemoryImagesRepository;
let inMemoryBrothsRepository: InMemoryBrothsRepository;
let inMemoryProteinsRepository: InMemoryProteinsRepository;
let inMemoryOrdersRepository: InMemoryOrdersRepository;
let sut: CreateOrderUseCase; // Subject Under Test

describe('Create Order', () => {
  beforeEach(() => {
    inMemoryImagesRepository = new InMemoryImagesRepository();
    inMemoryBrothsRepository = new InMemoryBrothsRepository(
      inMemoryImagesRepository,
    );
    inMemoryProteinsRepository = new InMemoryProteinsRepository(
      inMemoryImagesRepository,
    );
    inMemoryOrdersRepository = new InMemoryOrdersRepository();
    sut = new CreateOrderUseCase(
      inMemoryBrothsRepository,
      inMemoryProteinsRepository,
      inMemoryOrdersRepository,
    );
  });

  it('should be able to create a order', async () => {
    const broth = makeBroth();
    const protein = makeProtein();

    await Promise.all([
      inMemoryBrothsRepository.create(broth),
      inMemoryProteinsRepository.create(protein),
    ]);

    const result = await sut.execute({
      brothId: broth.id.toString(),
      proteinId: protein.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      order: inMemoryOrdersRepository.items[0],
    });
  });

  it('should not be able to create a order without broth', async () => {
    const protein = makeProtein();

    await inMemoryProteinsRepository.create(protein);

    const result = await sut.execute({
      brothId: 'undefined-broth-id',
      proteinId: protein.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to create a order without protein', async () => {
    const broth = makeBroth();

    await inMemoryBrothsRepository.create(broth);

    const result = await sut.execute({
      brothId: broth.id.toString(),
      proteinId: 'undefined-protein-id',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
