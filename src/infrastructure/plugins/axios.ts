import axios from 'axios'
import { HttpGetClient } from '@/use-cases/common/packages'

export class AxiosHttpClient implements HttpGetClient {
  async get (url: string, params: Object): Promise<any> {
    const result = await axios.get(url, { params })
    return result.data
  }
}
