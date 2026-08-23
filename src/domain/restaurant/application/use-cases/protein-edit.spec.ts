import { faker } from '@faker-js/faker'
import { makeImage } from 'test/factories/restaurant/make-image'
import { makeProtein } from 'test/factories/restaurant/make-protein'
import { InMemoryImagesRepository } from 'test/repositories/restaurant/in-memory-image-repository'
import { InMemoryProteinsRepository } from 'test/repositories/restaurant/in-memory-protein-repository'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { ProteinAlreadyExistsError } from './errors/protein-already-exists-error'
import { EditProteinUseCase } from './protein-edit'

let inMemoryProteinsRepository: InMemoryProteinsRepository
let inMemoryImagesRepository: InMemoryImagesRepository
let sut: EditProteinUseCase

describe('Edit Protein Use Case', () => {
  beforeEach(() => {
    inMemoryImagesRepository = new InMemoryImagesRepository()
    inMemoryProteinsRepository = new InMemoryProteinsRepository(
      inMemoryImagesRepository,
    )
    sut = new EditProteinUseCase(
      inMemoryProteinsRepository,
      inMemoryImagesRepository,
    )
  })

  it('should be able to update a protein name', async () => {
    const protein = makeProtein()
    await inMemoryProteinsRepository.create(protein)

    const newName = faker.commerce.productName()
    const result = await sut.execute({
      proteinId: protein.id.toString(),
      name: newName,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryProteinsRepository.items[0].name).toEqual(newName)
  })

  it('should be able to update a protein description', async () => {
    const protein = makeProtein()

    await inMemoryProteinsRepository.create(protein)

    const newDescription = faker.commerce.productDescription()

    const result = await sut.execute({
      proteinId: protein.id.toString(),
      description: newDescription,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryProteinsRepository.items[0].description).toEqual(
      newDescription,
    )
  })

  it('should be able to update a protein price', async () => {
    const protein = makeProtein()
    await inMemoryProteinsRepository.create(protein)

    const newPrice = parseFloat(faker.commerce.price())

    const result = await sut.execute({
      proteinId: protein.id.toString(),
      price: newPrice,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryProteinsRepository.items[0].price).toEqual(newPrice)
  })

  it('should be able to update a protein active image', async () => {
    const protein = makeProtein()

    await inMemoryProteinsRepository.create(protein)

    const imageActive = makeImage()

    await inMemoryImagesRepository.create(imageActive)

    const result = await sut.execute({
      proteinId: protein.id.toString(),
      imageActiveId: imageActive.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryProteinsRepository.items[0].imageActiveId).toEqual(
      imageActive.id.toString(),
    )
  })

  it('should be able to update a protein inactive image', async () => {
    const protein = makeProtein()

    await inMemoryProteinsRepository.create(protein)

    const imageInactive = makeImage()

    await inMemoryImagesRepository.create(imageInactive)

    const result = await sut.execute({
      proteinId: protein.id.toString(),
      imageInactiveId: imageInactive.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryProteinsRepository.items[0].imageInactiveId).toEqual(
      imageInactive.id.toString(),
    )
  })

  it('should be able to update a protein', async () => {
    const protein = makeProtein()

    await inMemoryProteinsRepository.create(protein)

    const imageActive = makeImage()
    const imageInactive = makeImage()

    await inMemoryImagesRepository.create(imageActive)
    await inMemoryImagesRepository.create(imageInactive)

    const newName = faker.commerce.productName()
    const newDescription = faker.commerce.productDescription()
    const newPrice = parseFloat(faker.commerce.price())

    const result = await sut.execute({
      proteinId: protein.id.toString(),
      name: newName,
      description: newDescription,
      price: newPrice,
      imageActiveId: imageActive.id.toString(),
      imageInactiveId: imageInactive.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryProteinsRepository.items[0]).toEqual(
      expect.objectContaining({
        name: newName,
        description: newDescription,
        price: newPrice,
        imageActiveId: imageActive.id.toString(),
        imageInactiveId: imageInactive.id.toString(),
      }),
    )
  })

  it('should be able to update a protein description to an empty string', async () => {
    const protein = makeProtein()

    await inMemoryProteinsRepository.create(protein)

    const result = await sut.execute({
      proteinId: protein.id.toString(),
      description: '',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryProteinsRepository.items[0].description).toEqual('')
  })

  it('should be able to update a protein with the same name', async () => {
    const protein = makeProtein()
    await inMemoryProteinsRepository.create(protein)

    const result = await sut.execute({
      proteinId: protein.id.toString(),
      name: protein.name,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryProteinsRepository.items[0].name).toEqual(protein.name)
  })

  it('should be able to edit a protein without changing any field', async () => {
    const protein = makeProtein()
    await inMemoryProteinsRepository.create(protein)

    const result = await sut.execute({
      proteinId: protein.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryProteinsRepository.items[0]).toEqual(protein)
  })

  it('should not be able to update a protein that does not exist', async () => {
    const result = await sut.execute({ proteinId: 'non-existent-id' })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to update a protein with a non-existent active image', async () => {
    const protein = makeProtein()

    await inMemoryProteinsRepository.create(protein)

    const result = await sut.execute({
      proteinId: protein.id.toString(),
      imageActiveId: 'non-existent-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    expect(inMemoryProteinsRepository.items[0].imageActiveId).toEqual(
      protein.imageActiveId,
    )
  })

  it('should not be able to update a protein with a non-existent inactive image', async () => {
    const protein = makeProtein()

    await inMemoryProteinsRepository.create(protein)

    const result = await sut.execute({
      proteinId: protein.id.toString(),
      imageInactiveId: 'non-existent-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    expect(inMemoryProteinsRepository.items[0].imageInactiveId).toEqual(
      protein.imageInactiveId,
    )
  })

  it('should not be able to update a protein with an already existing name', async () => {
    const protein1 = makeProtein()
    const protein2 = makeProtein()

    await inMemoryProteinsRepository.create(protein1)
    await inMemoryProteinsRepository.create(protein2)

    const result = await sut.execute({
      proteinId: protein1.id.toString(),
      name: protein2.name,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ProteinAlreadyExistsError)
    expect(inMemoryProteinsRepository.items[0].name).toEqual(protein1.name)
  })
})
