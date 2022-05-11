export interface Todo {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface ListTodos {
    data: Container;
}


export interface Container {
    listTodos: ListTodosData;
}


export interface ListTodosData {
    items: Todo[];
    nextToken?: string;
}