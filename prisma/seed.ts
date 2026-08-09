import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // 1. Delete dependent records first (Orders)
  await prisma.order.deleteMany()

  // 2. Delete ingredients next (Broths and Proteins)
  await prisma.broth.deleteMany()
  await prisma.protein.deleteMany()

  // 3. Delete images last (top of the relationship chain)
  await prisma.image.deleteMany()

  // Seed Images
  const imagesData = [
    {
      id: '0a7cbf2a-f2d1-4b10-9e1a-9634c05600d1',
      title: 'salt-inactive.svg',
    },
    {
      id: '13e9db9a-0924-4ed2-b26e-42212a01ea04',
      title: 'chicken-inactive.svg',
    },
    {
      id: '1d9e4bc9-8af2-47e1-a108-60ebb6e5f55d',
      title: 'pork-inactive.svg',
    },
    {
      id: '2fb9fc17-67c5-4451-9c09-cff02a24431e',
      title: 'yasai-active.svg',
    },
    {
      id: '35d3036a-fa15-4df8-a01d-6d4b18645733',
      title: 'miso-active.svg',
    },
    {
      id: '3bc17e09-56f8-4969-b5b2-87f44ebc6189',
      title: 'salt-active.svg',
    },
    {
      id: '51a0c2b2-ee95-4cf4-b1f6-faf72cb11a4c',
      title: 'shoyu-inactive.svg',
    },
    {
      id: '9453719c-9d02-4f2c-993e-fa873453c041',
      title: 'pork-active.svg',
    },
    {
      id: 'a67584d7-a6d6-4f65-a5cf-8315beef5edc',
      title: 'miso-inactive.svg',
    },
    {
      id: 'b2d097f8-f130-4ac6-afb5-fed9f3450813',
      title: 'yasai-inactive.svg',
    },
    {
      id: 'c158080d-3733-4ca5-9332-f8b6ef34f2cb',
      title: 'shoyu-active.svg',
    },
    {
      id: 'eefb10b8-6c5d-4712-88f3-cadf41e7cf17',
      title: 'chicken-active.svg',
    },
  ]

  const images = await Promise.all(
    imagesData.map((img) =>
      prisma.image.create({
        data: {
          id: img.id,
          title: img.title,
          url: `${img.id}-${img.title}`,
        },
      }),
    ),
  )
  console.log(`Seeded ${images.length} images.`)

  // Seed Broths
  const broths = await prisma.broth.createMany({
    data: [
      {
        id: 'b8e0b0e0-0e0e-4e0e-8e0e-0e0e0e0e0e0e',
        name: 'Salt Broth',
        description: 'Light and refreshing salt-based broth.',
        price: 10.0,
        imageActiveId: '3bc17e09-56f8-4969-b5b2-87f44ebc6189', // salt-active.svg
        imageInactiveId: '0a7cbf2a-f2d1-4b10-9e1a-9634c05600d1', // salt-inactive.svg
      },
      {
        id: 'c9f1c1f1-1f1f-4f1f-9f1f-1f1f1f1f1f1f',
        name: 'Miso Broth',
        description: 'Rich and savory miso-flavored broth.',
        price: 12.0,
        imageActiveId: '35d3036a-fa15-4df8-a01d-6d4b18645733', // miso-active.svg
        imageInactiveId: 'a67584d7-a6d6-4f65-a5cf-8315beef5edc', // miso-inactive.svg
      },
      {
        id: 'd0a2d2a2-2a2a-4a2a-0a2a-2a2a2a2a2a2a',
        name: 'Shoyu Broth',
        description: 'Classic soy sauce-based broth.',
        price: 11.0,
        imageActiveId: 'c158080d-3733-4ca5-9332-f8b6ef34f2cb', // shoyu-active.svg
        imageInactiveId: '51a0c2b2-ee95-4cf4-b1f6-faf72cb11a4c', // shoyu-inactive.svg
      },
    ],
  })
  console.log(`Seeded ${broths.count} broths.`)

  // Seed Proteins
  const proteins = await prisma.protein.createMany({
    data: [
      {
        id: 'e1a3e3b3-3b3b-4b3b-8b3b-3b3b3b3b3b3b',
        name: 'Chasu Pork',
        description: 'Tender slices of slow-cooked pork belly.',
        price: 15.0,
        imageActiveId: '9453719c-9d02-4f2c-993e-fa873453c041', // pork-active.svg
        imageInactiveId: '1d9e4bc9-8af2-47e1-a108-60ebb6e5f55d', // pork-inactive.svg
      },
      {
        id: 'f2c4f4d4-4d4d-4d4d-9d4d-4d4d4d4d4d4d',
        name: 'Chicken',
        description: 'Grilled chicken breast slices.',
        price: 13.0,
        imageActiveId: 'eefb10b8-6c5d-4712-88f3-cadf41e7cf17', // chicken-active.svg
        imageInactiveId: '13e9db9a-0924-4ed2-b26e-42212a01ea04', // chicken-inactive.svg
      },
      {
        id: 'a3b5c5d5-5d5d-4d5d-3d5d-5d5d5d5d5d5d',
        name: 'Yasai (Vegetables)',
        description: 'A mix of fresh seasonal vegetables.',
        price: 10.0,
        imageActiveId: '2fb9fc17-67c5-4451-9c09-cff02a24431e', // yasai-active.svg
        imageInactiveId: 'b2d097f8-f130-4ac6-afb5-fed9f3450813', // yasai-inactive.svg
      },
    ],
  })
  console.log(`Seeded ${proteins.count} proteins.`)

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
