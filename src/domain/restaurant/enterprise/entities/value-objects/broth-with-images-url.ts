import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ValueObject } from '@/core/entities/value-object';

export interface BrothWithImagesUrlProps {
  id: UniqueEntityID;
  name: string;
  description: string;
  price: number;
  imageInactiveUrl: string;
  imageActiveUrl: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class BrothWithImagesUrl extends ValueObject<BrothWithImagesUrlProps> {
  get id() {
    return this.props.id;
  }

  get name() {
    return this.props.name;
  }

  get description() {
    return this.props.description;
  }

  get price() {
    return this.props.price;
  }

  get imageInactiveUrl() {
    return this.props.imageInactiveUrl;
  }

  get imageActiveUrl() {
    return this.props.imageActiveUrl;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: BrothWithImagesUrlProps) {
    return new BrothWithImagesUrl(props);
  }
}
