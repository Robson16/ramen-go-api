import { UsersRepository } from '@/domain/account/application/repositories/user-repository'
import { BrothsRepository } from '@/domain/restaurant/application/repositories/broth-repository'
import { OrdersRepository } from '@/domain/restaurant/application/repositories/order-repository'
import { ProteinsRepository } from '@/domain/restaurant/application/repositories/protein-repository'
import { Order } from '@/domain/restaurant/enterprise/entities/order'
import { OrderWithDetails } from '@/domain/restaurant/enterprise/entities/value-objects/order-with-details'

export class InMemoryOrdersRepository implements OrdersRepository {
  public items: Order[] = []

  constructor(
    private brothsRepository?: BrothsRepository,
    private proteinsRepository?: ProteinsRepository,
    private usersRepository?: UsersRepository,
  ) {}

  async findById(id: string) {
    const order = this.items.find((item) => item.id.toString() === id)

    if (!order) {
      return null
    }

    return order
  }

  async findMany(): Promise<Order[]> {
    return this.items
  }

  async findManyByUserId(userId: string): Promise<Order[]> {
    return this.items.filter((item) => item.userId.toString() === userId)
  }

  async findByIdWithDetails(id: string): Promise<OrderWithDetails | null> {
    const order = await this.findById(id)

    if (!order) {
      return null
    }

    return this.toOrderWithDetails(order)
  }

  async findManyWithDetails(): Promise<OrderWithDetails[]> {
    return Promise.all(
      this.items.map((order) => this.toOrderWithDetails(order)),
    )
  }

  async findManyByUserIdWithDetails(
    userId: string,
  ): Promise<OrderWithDetails[]> {
    const orders = await this.findManyByUserId(userId)

    return Promise.all(orders.map((order) => this.toOrderWithDetails(order)))
  }

  async create(order: Order) {
    this.items.push(order)
  }

  async save(order: Order): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === order.id)

    this.items[itemIndex] = order
  }

  private async toOrderWithDetails(order: Order): Promise<OrderWithDetails> {
    if (!this.brothsRepository || !this.proteinsRepository) {
      throw new Error(
        'BrothsRepository and ProteinsRepository are required for order details.',
      )
    }

    const [broth, protein, user] = await Promise.all([
      this.brothsRepository.findById(order.brothId.toString()),
      this.proteinsRepository.findById(order.proteinId.toString()),
      this.usersRepository?.findById(order.userId.toString()),
    ])

    if (!broth) {
      throw new Error(
        `Broth for order "${order.id.toString()}" does not exist.`,
      )
    }

    if (!protein) {
      throw new Error(
        `Protein for order "${order.id.toString()}" does not exist.`,
      )
    }

    return OrderWithDetails.create({
      id: order.id,
      userId: order.userId,
      brothId: order.brothId,
      proteinId: order.proteinId,
      description: order.description,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      broth: { name: broth.name },
      protein: { name: protein.name },
      user: user ? { name: user.name } : null,
    })
  }
}
