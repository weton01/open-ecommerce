export interface Encrypter {
  encrypt: (value: any, key: string) => string
}
