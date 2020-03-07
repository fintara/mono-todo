export interface TodoCreate {
    content: string;
}

export interface UUID {
}

export interface TodoDTO {
    id: UUID;
    content: string;
    done: boolean;
}

export interface TodoPatch {
    content: string;
    done: boolean;
}

export interface Registration {
    email: string;
    password: string;
    name: string;
}

export interface Credentials {
    email: string;
    password: string;
}