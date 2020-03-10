import ky from "ky/umd"

type Options = {
  headers?: Record<string, string>
  json?: any
}

export interface WithAuthentication {
  authenticate(token: string | null): void
}

export interface HttpClient extends WithAuthentication {
  get<T>(url: string): Promise<T>
  post<T, R>(url: string, body?: T): Promise<R>
  put<T, R>(url: string, body: T): Promise<R>
  patch<T, R>(url: string, body: T): Promise<R>
  delete<T>(url: string): Promise<T>
}

export class KyHttpClient implements HttpClient {
  private headers: Record<string, string> = {}

  constructor(private baseUrl: string = "") {
  }

  public get<T>(url: string): Promise<T> {
    const options: Options = {
      headers: this.headers
    }
    return ky.get(`${this.baseUrl}${url}`, options).json()
  }

  public post<T, R>(url: string, body?: T): Promise<R> {
    const options: Options = {
      headers: this.headers
    }
    if (body) {
      options.json = body
    }
    return ky.post(`${this.baseUrl}${url}`, options).json()
  }

  public put<T, R>(url: string, body: T): Promise<R> {
    const options: Options = {
      headers: this.headers
    }
    options.json = body
    return ky.put(`${this.baseUrl}${url}`, options).json()
  }

  public patch<T, R>(url: string, body: T): Promise<R> {
    const options: Options = {
      headers: this.headers
    }
    options.json = body
    return ky.patch(`${this.baseUrl}${url}`, options).json()
  }

  public delete<T>(url: string): Promise<T> {
    const options: Options = {
      headers: this.headers
    }
    return ky.delete(`${this.baseUrl}${url}`, options).json()
  }

  public authenticate(token: string | null): void {
    const key = "Authorization"
    const value = (v: string) => `Bearer ${v}`

    if (token) {
      this.headers[key] = value(token)
    } else {
      delete this.headers[key]
    }
  }
}
