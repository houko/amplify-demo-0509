export interface Todo {
    id: string;
    name: string;
    tag: string;
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




export interface News {
    id: string;
    title: string;
    summary: string;
    author: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

export interface ListNews {
    data: Container;
}


export interface Container {
    listNews: ListNewsData;
}


export interface ListNewsData {
    items: News[];
    nextToken?: string;
}