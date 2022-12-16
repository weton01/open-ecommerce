import { Entity, EntityError } from '@/entities/common/entity'

export class AnyError extends EntityError {
  constructor (errors: string[]) {
    super('Any', errors)
  }
}

interface AnyProps {
  id: string
}

describe('Entity', () => {
  describe('Entity Object', () => {
    it('Should success creating new Entity', () => {
      class EntityStub extends Entity<AnyProps> {
        get id (): string {
          return this.props.id
        }

        static build (props: AnyProps): EntityStub {
          const errs: string[] = []
          if (errs.length > 0) throw new AnyError(errs)

          return new EntityStub(props)
        }
      }

      const anyData: AnyProps = {
        id: 'any_id'
      }

      const anyResponse = EntityStub.build(anyData)

      expect(anyResponse.id).toEqual('any_id')
    })
  })

  describe('Entity Error', () => {
    it('Should success return entity error', () => {
      const newError = new EntityError('AnyEntity', ['error'])
      expect(newError.errors).toEqual(['error'])
      expect(newError.message).toEqual('Failed while manipulating AnyEntity entity')
    })
  })
})
