import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export interface OrderProps {
  brothId: UniqueEntityID;
  proteinId: UniqueEntityID;
  description: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Order extends Entity<OrderProps> {
  get brothId() {
    return this.props.brothId;
  }

  get proteinId() {
    return this.props.proteinId;
  }

  get description() {
    return this.props.description;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(props: Optional<OrderProps, 'createdAt'>, id?: UniqueEntityID) {
    const order = new Order(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return order;
  }
}
