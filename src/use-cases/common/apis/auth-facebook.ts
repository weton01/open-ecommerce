
export interface AuthSocialOutputDTO {
  id: string
  email: string
  name: string
  active: boolean
  activationCode: string
}

export interface AuthFacebookAPI {
  authFacebook: (accessToken: string,) => Promise<AuthSocialOutputDTO | undefined>
}
