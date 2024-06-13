import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export interface BrothProps {
  name: string;
  description: string;
  price: number;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Broth extends Entity<BrothProps> {
  get name() {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;

    this.touch();
  }

  get description() {
    return this.props.description;
  }

  set description(description: string) {
    this.props.description = description;

    this.touch();
  }

  get price() {
    return this.props.price;
  }

  set price(price: number) {
    this.props.price = price;

    this.touch();
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

  static create(props: Optional<BrothProps, 'createdAt'>, id?: UniqueEntityID) {
    const broth = new Broth(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return broth;
  }
}
