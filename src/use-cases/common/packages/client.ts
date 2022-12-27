export interface HttpGetClient {
  get: <T = any> (url: string, params: Object) => Promise<T>
}
