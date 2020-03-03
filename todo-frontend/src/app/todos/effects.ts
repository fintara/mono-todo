import { Api, Todo } from "./types"
import { HttpClient, KyHttpClient } from "../common/http"

export const api: Api = new class implements Api {
  private http: HttpClient = new KyHttpClient(process.env.REACT_APP_API_URL)

  getTodos(): Promise<Todo[]> {
    // return this.http.get("/todos")
    const list: Todo[] = [
      {id: "uuid1", content: "Do something cat", done: false},
      {id: "uuid2", content: "Do something dog", done: true},
      {id: "uuid3", content: "Do something automobile", done: false},
      {id: "uuid4", content: "Do something computer", done: false},
      {id: "uuid5", content: "Do something paper", done: true},
      ]
    return new Promise(resolve => setTimeout(() => resolve(list), 1000))
  }
}()
