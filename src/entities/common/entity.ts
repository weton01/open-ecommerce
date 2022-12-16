import { DomainError } from './domain-error'

export class EntityError extends DomainError {
  constructor (entity: string, errors: string[] | string) {
    super(`Failed while manipulating ${entity} entity`, errors)
  }
}

export abstract class Entity<T> {
  protected props: T

  constructor (props: T) {
    this.props = props
  }
}
