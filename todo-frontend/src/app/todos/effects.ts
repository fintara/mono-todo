import { Api, Todo, TodoCreate, TodoId } from "./types"
import { HttpClient, KyHttpClient } from "../common/http"

export const api: Api = new class implements Api {
  private http: HttpClient = new KyHttpClient(process.env.REACT_APP_API_URL)

  getAll(): Promise<Todo[]> {
    return this.http.get("/todos")
  }

  create(todo: TodoCreate): Promise<Todo> {
    return this.http.post("/todos", todo)
  }

  update(id: TodoId, patch: Partial<Omit<Todo, "id">>): Promise<Todo> {
    return this.http.patch(`/todos/${id}`, patch)
  }

  delete(id: TodoId): Promise<void> {
    return this.http.delete(`/todos/${id}`)
  }

  authenticate(token: string | null): void {
    this.http.authenticate(token)
  }
}()
