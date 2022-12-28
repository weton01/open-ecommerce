import { HttpGetClient } from '@/use-cases/common/packages'
import { AuthFacebookAPI, AuthSocialOutputDTO } from '@/use-cases/common/apis/auth-facebook'

type AppToken = { access_token: string }
type DebugToken = { data: { user_id: string } }
type UserInfo = { id: string, name: string, email: string }

export class FacebookApi implements AuthFacebookAPI {
  private readonly baseUrl = 'https://graph.facebook.com'

  constructor (
    private readonly httpClient: HttpGetClient,
    private readonly clientId: string,
    private readonly clientSecret: string
  ) {}

  async authFacebook (accessToken: string): Promise<AuthSocialOutputDTO | undefined> {
    return this.getUserInfo(accessToken)
      .then(({ id, name, email }) => ({ id: '', name, email, activationCode: '00000', active: true }))
      .catch(() => undefined)
  }

  private async getAppToken (): Promise<AppToken> {
    return this.httpClient.get(
       `${this.baseUrl}/oauth/access_token`,
       {
         client_id: this.clientId,
         client_secret: this.clientSecret,
         grant_type: 'client_credentials'
       }
    )
  }

  private async getDebugToken (clientToken: string): Promise<DebugToken> {
    const appToken = await this.getAppToken()
    return this.httpClient.get(
     `${this.baseUrl}/debug_token`,
     {
       access_token: appToken.access_token,
       input_token: clientToken
     }
    )
  }

  private async getUserInfo (clientToken: string): Promise<UserInfo> {
    const debugToken = await this.getDebugToken(clientToken)
    return this.httpClient.get(
      `${this.baseUrl}/${debugToken.data.user_id}`,
      {
        fields: ['id', 'name', 'email'].join(','),
        access_token: clientToken
      }
    )
  }
}
