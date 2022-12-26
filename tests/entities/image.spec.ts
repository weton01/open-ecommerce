import { Image, ImageError } from '@/entities/image'

describe('Image', () => {
  it('should success creating Account Entity', () => {
    const imageProps = {
      url: 'https://any_image.com/any_id'
    }
    const account = Image.build(imageProps)

    expect(account.id).toBe('any_id')
    expect(account.path).toBe('https://any_image.com')
    expect(account.address).toBe('https://any_image.com/any_id')
  })

  it('should fail when give an invalid e-mail', () => {
    const imageProps = { url: '://any_image.com/any_id' }

    expect(() => { Image.build(imageProps) }).toThrow(new ImageError(['Invalid URL']))
  })
})
