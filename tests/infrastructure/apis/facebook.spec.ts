import { FacebookApi } from '@/infrastructure/apis/facebook'
import { HttpGetClient } from '@/use-cases/common/packages'
import { mock, MockProxy } from 'jest-mock-extended'

describe('FacebookApi', () => {
  let clientId: string
  let clientSecret: string
  let sut: FacebookApi
  let httpClient: MockProxy<HttpGetClient>

  beforeAll(() => {
    clientId = 'any_client_id'
    clientSecret = 'any_client_secret'
    httpClient = mock()
  })

  beforeEach(() => {
    httpClient.get
      .mockResolvedValueOnce({ access_token: 'any_app_token' })
      .mockResolvedValueOnce({ data: { user_id: 'any_user_id' } })
      .mockResolvedValueOnce({ id: 'any_fb_id', name: 'any_fb_name', email: 'any_fb_email' })
    sut = new FacebookApi(httpClient, clientId, clientSecret)
  })

  it('should get app token', async () => {
    await sut.authFacebook('any_client_token')

    expect(httpClient.get).toHaveBeenCalledWith(
      'https://graph.facebook.com/oauth/access_token',
      {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials'
      }
    )
  })

  it('should get debug token', async () => {
    await sut.authFacebook('any_client_token')

    expect(httpClient.get).toHaveBeenCalledWith(
      'https://graph.facebook.com/debug_token',
      {
        access_token: 'any_app_token',
        input_token: 'any_client_token'
      }
    )
  })

  it('should get user info', async () => {
    await sut.authFacebook('any_client_token')

    expect(httpClient.get).toHaveBeenCalledWith(
      'https://graph.facebook.com/any_user_id',
      {
        fields: 'id,name,email',
        access_token: 'any_client_token'
      }
    )
  })

  it('should return facebook user', async () => {
    const fbUser = await sut.authFacebook('any_client_token')

    expect(fbUser).toEqual({
      id: '',
      name: 'any_fb_name',
      email: 'any_fb_email',
      activationCode: '00000',
      active: true
    })
  })

  it('should return undefined if HttpGetClient throws', async () => {
    httpClient.get.mockReset().mockRejectedValueOnce(new Error('fb_error'))

    const fbUser = await sut.authFacebook('any_client_token')

    expect(fbUser).toBeUndefined()
  })
})
