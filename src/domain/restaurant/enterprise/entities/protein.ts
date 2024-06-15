import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export interface ProteinProps {
  name: string;
  description: string;
  price: number;
  imageInactiveId: string;
  imageActiveId: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Protein extends Entity<ProteinProps> {
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

  get imageInactiveId() {
    return this.props.imageInactiveId;
  }

  set imageInactiveId(imageInactiveId: string) {
    this.props.imageInactiveId = imageInactiveId;

    this.touch();
  }

  get imageActiveId() {
    return this.props.imageActiveId;
  }

  set imageActiveId(imageActiveId: string) {
    this.props.imageActiveId = imageActiveId;

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

  static create(
    props: Optional<ProteinProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const protein = new Protein(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return protein;
  }
}
