import ky from "ky/umd"

export type Options = {
  token?: string
}

export interface HttpClient {
  get<T>(url: string, options?: Options): Promise<T>
  post<T, R>(url: string, body?: T, options?: Options): Promise<R>
  put<T, R>(url: string, body: T, options?: Options): Promise<R>
  patch<T, R>(url: string, body: T, options?: Options): Promise<R>
  delete<T>(url: string, options?: Options): Promise<T>
}

type KyOptions = {
  headers?: Record<string, string>
  json?: any
}

export class KyHttpClient implements HttpClient {

  constructor(private baseUrl: string = "") {
  }

  public get<T>(url: string, options?: Options): Promise<T> {
    const request: KyOptions = {
      headers: KyHttpClient.headers(options)
    }
    return ky.get(`${this.baseUrl}${url}`, request).json()
  }

  public post<T, R>(url: string, body?: T, options?: Options): Promise<R> {
    const request: KyOptions = {
      headers: KyHttpClient.headers(options)
    }
    if (body) {
      request.json = body
    }
    return ky.post(`${this.baseUrl}${url}`, request).json()
  }

  public put<T, R>(url: string, body: T, options?: Options): Promise<R> {
    const request: KyOptions = {
      headers: KyHttpClient.headers(options)
    }
    request.json = body
    return ky.put(`${this.baseUrl}${url}`, request).json()
  }

  public patch<T, R>(url: string, body: T, options?: Options): Promise<R> {
    const request: KyOptions = {
      headers: KyHttpClient.headers(options)
    }
    request.json = body
    return ky.patch(`${this.baseUrl}${url}`, request).json()
  }

  public delete<T>(url: string, options?: Options): Promise<T> {
    const request: KyOptions = {
      headers: KyHttpClient.headers(options)
    }
    return ky.delete(`${this.baseUrl}${url}`, request).json()
  }

  private static headers(options?: Options): Record<string, string> {
    if (options?.token) {
      return ({ "Authorization": `Bearer ${options.token}`})
    }
    return {}
  }
}
