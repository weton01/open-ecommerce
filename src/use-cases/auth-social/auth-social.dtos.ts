
type AuthSocialType = 'google' | 'facebook'

export interface AuthSocialDTO {
  token: string
  type: AuthSocialType
}
