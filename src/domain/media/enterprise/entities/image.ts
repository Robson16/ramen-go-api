import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface ImageProps {
  title: string
  url: string
  createdAt: Date
  updatedAt?: Date | null
}

export class Image extends Entity<ImageProps> {
  get title() {
    return this.props.title
  }

  set title(title: string) {
    this.props.title = title
    this.touch()
  }

  get url() {
    return this.props.url
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(props: Optional<ImageProps, 'createdAt'>, id?: UniqueEntityID) {
    const image = new Image(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return image
  }
}
