import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'
import { Image } from '@/domain/media/enterprise/entities/image'

export interface ProteinWithImagesUrlProps {
  id: UniqueEntityID
  name: string
  description: string
  price: number
  imageInactive: Image
  imageActive: Image
  createdAt: Date
  updatedAt?: Date | null
}

export class ProteinWithImagesUrl extends ValueObject<ProteinWithImagesUrlProps> {
  get id() {
    return this.props.id
  }

  get name() {
    return this.props.name
  }

  get description() {
    return this.props.description
  }

  get price() {
    return this.props.price
  }

  get imageInactive() {
    return this.props.imageInactive
  }

  get imageActive() {
    return this.props.imageActive
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(props: ProteinWithImagesUrlProps) {
    return new ProteinWithImagesUrl(props)
  }
}
