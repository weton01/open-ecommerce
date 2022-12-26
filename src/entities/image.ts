import { Entity, EntityError } from '@/entities/common/entity'

export interface ImageProps {
  id: string
  path: string
  address: string
}

interface BuildImageProps {
  url: string
}

export class ImageError extends EntityError {
  constructor (errors: string[], statusCode?: number) {
    super('Image', errors, statusCode)
  }
}

export class Image extends Entity<ImageProps> {
  get id (): string {
    return this.props.id
  }

  get path (): string {
    return this.props.path
  }

  get address (): string {
    return this.props.address
  }

  static build (props: BuildImageProps): Image {
    const errors: string[] = []
    if (!/^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(props.url)) { errors.push('Invalid URL') }
    const id = props.url.split('/')[props.url.split('/').length - 1]
    const path = props.url.split('/').slice(0, -1).join('/')
    const address = props.url
    if (errors.length > 0) { throw new ImageError(errors) }
    return new Image({ id, path, address })
  }
}
