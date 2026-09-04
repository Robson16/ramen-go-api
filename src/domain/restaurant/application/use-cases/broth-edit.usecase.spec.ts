import { faker } from '@faker-js/faker'
import { makeBroth } from 'test/factories/restaurant/make-broth'
import { makeImage } from 'test/factories/restaurant/make-image'
import { InMemoryBrothsRepository } from 'test/repositories/restaurant/in-memory-broth-repository'
import { InMemoryImagesRepository } from 'test/repositories/restaurant/in-memory-image-repository'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { BrothEditUseCase } from './broth-edit.usecase'
import { BrothAlreadyExistsError } from './errors/broth-already-exists-error'

let inMemoryBrothsRepository: InMemoryBrothsRepository
let inMemoryImagesRepository: InMemoryImagesRepository
let sut: BrothEditUseCase // Subject Under Test

describe('Edit Broth Use Case', () => {
  beforeEach(() => {
    inMemoryImagesRepository = new InMemoryImagesRepository()
    inMemoryBrothsRepository = new InMemoryBrothsRepository(
      inMemoryImagesRepository,
    )
    sut = new BrothEditUseCase(
      inMemoryBrothsRepository,
      inMemoryImagesRepository,
    )
  })

  it('should be able to update a broth name', async () => {
    const broth = makeBroth()

    await inMemoryBrothsRepository.create(broth)

    const newName = faker.commerce.productName()

    const result = await sut.execute({
      brothId: broth.id.toString(),
      name: newName,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryBrothsRepository.items[0].name).toEqual(newName)
  })

  it('should be able to update a broth description', async () => {
    const broth = makeBroth()

    await inMemoryBrothsRepository.create(broth)

    const newDescription = faker.commerce.productDescription()

    const result = await sut.execute({
      brothId: broth.id.toString(),
      description: newDescription,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryBrothsRepository.items[0].description).toEqual(
      newDescription,
    )
  })

  it('should be able to update a broth price', async () => {
    const broth = makeBroth()

    await inMemoryBrothsRepository.create(broth)

    const newPrice = 0

    const result = await sut.execute({
      brothId: broth.id.toString(),
      price: newPrice,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryBrothsRepository.items[0].price).toEqual(newPrice)
  })

  it('should be able to update a broth active image', async () => {
    const broth = makeBroth()

    await inMemoryBrothsRepository.create(broth)

    const imageActive = makeImage()

    inMemoryImagesRepository.create(imageActive)

    const result = await sut.execute({
      brothId: broth.id.toString(),
      imageActiveId: imageActive.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryBrothsRepository.items[0].imageActiveId).toEqual(
      imageActive.id.toString(),
    )
  })

  it('should be able to update a broth inactive image', async () => {
    const broth = makeBroth()

    await inMemoryBrothsRepository.create(broth)

    const imageInactive = makeImage()

    inMemoryImagesRepository.create(imageInactive)

    const result = await sut.execute({
      brothId: broth.id.toString(),
      imageInactiveId: imageInactive.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryBrothsRepository.items[0].imageInactiveId).toEqual(
      imageInactive.id.toString(),
    )
  })

  it('should be able to update multiple broth fields', async () => {
    const broth = makeBroth()

    await inMemoryBrothsRepository.create(broth)

    const imageActive = makeImage()

    inMemoryImagesRepository.create(imageActive)

    const imageInactive = makeImage()

    inMemoryImagesRepository.create(imageInactive)

    const newName = faker.commerce.productName()
    const newDescription = faker.commerce.productDescription()
    const newPrice = parseFloat(faker.commerce.price())
    const newImageActiveId = imageActive.id.toString()
    const newImageInactiveId = imageInactive.id.toString()

    const result = await sut.execute({
      brothId: broth.id.toString(),
      name: newName,
      description: newDescription,
      price: newPrice,
      imageActiveId: newImageActiveId,
      imageInactiveId: newImageInactiveId,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryBrothsRepository.items[0]).toEqual(
      expect.objectContaining({
        name: newName,
        description: newDescription,
        price: newPrice,
        imageActiveId: newImageActiveId,
        imageInactiveId: newImageInactiveId,
      }),
    )

    if (result.isRight()) {
      expect(result.value.broth).toEqual(inMemoryBrothsRepository.items[0])
    }
  })

  it('should be able to update a broth description to an empty string', async () => {
    const broth = makeBroth()

    await inMemoryBrothsRepository.create(broth)

    const result = await sut.execute({
      brothId: broth.id.toString(),
      description: '',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryBrothsRepository.items[0].description).toEqual('')
  })

  it('should be able to update a broth with the same name', async () => {
    const broth = makeBroth()

    await inMemoryBrothsRepository.create(broth)

    const result = await sut.execute({
      brothId: broth.id.toString(),
      name: broth.name,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryBrothsRepository.items[0].name).toEqual(broth.name)
  })

  it('should be able to edit a broth without changing any field', async () => {
    const broth = makeBroth()

    await inMemoryBrothsRepository.create(broth)

    const result = await sut.execute({
      brothId: broth.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryBrothsRepository.items[0]).toEqual(broth)
  })

  it('should not be able to update a broth that does not exist', async () => {
    const result = await sut.execute({
      brothId: 'non-existent-id',
      name: 'Non Existent Broth',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to update a broth with a non-existent active image', async () => {
    const broth = makeBroth()

    await inMemoryBrothsRepository.create(broth)

    const result = await sut.execute({
      brothId: broth.id.toString(),
      imageActiveId: 'non-existent-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    expect(inMemoryBrothsRepository.items[0].imageActiveId).toEqual(
      broth.imageActiveId,
    )
  })

  it('should not be able to update a broth with a non-existent inactive image', async () => {
    const broth = makeBroth()

    await inMemoryBrothsRepository.create(broth)

    const result = await sut.execute({
      brothId: broth.id.toString(),
      imageInactiveId: 'non-existent-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    expect(inMemoryBrothsRepository.items[0].imageInactiveId).toEqual(
      broth.imageInactiveId,
    )
  })

  it('should not be able to update a broth with an already existing name', async () => {
    const broth1 = makeBroth()
    const broth2 = makeBroth()

    await inMemoryBrothsRepository.create(broth1)
    await inMemoryBrothsRepository.create(broth2)

    const result = await sut.execute({
      brothId: broth1.id.toString(),
      name: broth2.name,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(BrothAlreadyExistsError)
    expect(inMemoryBrothsRepository.items[0].name).toEqual(broth1.name)
  })
})
