export type Registration = {
  email: string;
  password: string;
  name: string | null;
}

export type Credentials = {
  email: string;
  password: string;
}

export type Authentication = {
  token: string
}

export type User = {
  name: string
}
