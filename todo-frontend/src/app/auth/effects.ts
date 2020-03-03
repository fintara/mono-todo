import { Api } from "./types"
import { HttpClient, KyHttpClient } from "../common/http"
import { Credentials, Registration } from "../../kt2ts"


export const api: Api = new class implements Api {
  private http: HttpClient = new KyHttpClient(process.env.REACT_APP_API_URL)

  login(credentials: Credentials): Promise<string> {
    return this.http.post("/auth/login", credentials)
  }

  register(form: Registration): Promise<void> {
    return this.http.post("/auth/register", form)
  }
}()
