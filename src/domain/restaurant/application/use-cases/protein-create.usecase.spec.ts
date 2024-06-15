import { faker } from '@faker-js/faker';
import { makeImage } from 'test/factories/make-image';
import { makeProtein } from 'test/factories/make-protein';
import { InMemoryImagesRepository } from 'test/repositories/in-memory-image-repository';
import { InMemoryProteinsRepository } from 'test/repositories/in-memory-protein-repository';
import { ProteinAlreadyExistsError } from './errors/protein-already-exists-error';
import { CreateProteinUseCase } from './protein-create.usecase';

let inMemoryProteinRepository: InMemoryProteinsRepository;
let inMemoryImagesRepository: InMemoryImagesRepository;
let sut: CreateProteinUseCase; // Subject Under Test

describe('Create Protein', () => {
  beforeEach(() => {
    inMemoryImagesRepository = new InMemoryImagesRepository();
    inMemoryProteinRepository = new InMemoryProteinsRepository();
    sut = new CreateProteinUseCase(
      inMemoryProteinRepository,
      inMemoryImagesRepository,
    );
  });

  it('should be able to create a protein', async () => {
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
      protein: inMemoryProteinRepository.items[0],
    });
  });

  it('should not be able to create a protein with a name already in use', async () => {
    const imageActive = makeImage();

    inMemoryImagesRepository.create(imageActive);

    const imageInactive = makeImage();

    inMemoryImagesRepository.create(imageInactive);

    const protein = makeProtein({
      name: 'Salt',
    });

    await inMemoryProteinRepository.create(protein);

    const result = await sut.execute({
      name: 'Salt',
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      imageActiveId: imageActive.id.toString(),
      imageInactiveId: imageInactive.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ProteinAlreadyExistsError);
  });
});
