import { Todo, TodoCreate, TodoId, TodoPatch } from "./types"
import { HttpClient, KyHttpClient } from "../common/http"
import { ApiInitialize } from "../common/types"

export const api = new class {
  private http: HttpClient = undefined as unknown as HttpClient
  private getToken: () => string = undefined as unknown as () => string

  initialize(config: ApiInitialize) {
    this.getToken = config.getToken
    this.http = new KyHttpClient(config.baseUrl)
  }

  getAll(): Promise<Todo[]> {
    return this.http.get("/todos", { token: this.getToken() })
  }

  create(todo: TodoCreate): Promise<Todo> {
    return this.http.post("/todos", todo, { token: this.getToken() })
  }

  update(id: TodoId, patch: TodoPatch): Promise<Todo> {
    return this.http.patch(`/todos/${id}`, patch, { token: this.getToken() })
  }

  delete(id: TodoId): Promise<void> {
    return this.http.delete(`/todos/${id}`, { token: this.getToken() })
  }
}()
