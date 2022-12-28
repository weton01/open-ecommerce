import { AuthSocialOutputDTO } from './auth-facebook'

export interface AuthGoogleAPI {
  authGoogle: (accessToken: string) => Promise<AuthSocialOutputDTO | undefined>
}
