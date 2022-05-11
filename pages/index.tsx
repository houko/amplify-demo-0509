import type {NextPage} from 'next'
import {useEffect, useState} from "react";
import {ListTodos, Todo} from "../src/types/types";
import {API, graphqlOperation} from "aws-amplify";
import {createTodo, deleteTodo, updateTodo} from "../src/graphql/mutations";
import classNames from "classnames";
import {listTodos} from "../src/graphql/queries";
import {onCreateTodo, onDeleteTodo, onUpdateTodo} from "../src/graphql/subscriptions";
import {Observable} from "zen-observable-ts";

/**
 *               .::::.
 *                  .::::::::.
 *                 :::::::::::
 *              ..:::::::::::'
 *           '::::::::::::'
 *             .::::::::::
 *        '::::::::::::::..
 *             ..::::::::::::.
 *           ``::::::::::::::::
 *            ::::``:::::::::'        .:::.
 *           ::::'   ':::::'       .::::::::.
 *         .::::'      ::::     .:::::::'::::.
 *        .:::'       :::::  .:::::::::' ':::::.
 *       .::'        :::::.:::::::::'      ':::::.
 *      .::'         ::::::::::::::'         ``::::.
 *  ...:::           ::::::::::::'              ``::.
 * ```` ':.          ':::::::::'                  ::::..
 *                    '.:::::'                    ':'````..
 * @constructor
 */
const Home: NextPage = () => {


    useEffect(() => {
        fetchTodos();
        console.log("subscribing");
        const createGraphql = API.graphql(graphqlOperation(onCreateTodo)) as Observable<any>;
        const subscriptionOnCreateTodo = createGraphql.subscribe({
            next: (data: Todo[]) => {
                fetchTodos();
            }
        });

        const updateGraphql = API.graphql(graphqlOperation(onUpdateTodo)) as Observable<any>;
        const subscriptionOnUpdateTodo = updateGraphql.subscribe({
            next: (data: Todo[]) => {
                fetchTodos();
            }
        });

        const deleteGraphql = API.graphql(graphqlOperation(onDeleteTodo)) as Observable<any>;
        const subscriptionOnDeleteTodo = deleteGraphql.subscribe({
            next: (data: Todo[]) => {
                fetchTodos();
            }
        });

        return () => {
            subscriptionOnCreateTodo.unsubscribe();
            subscriptionOnUpdateTodo.unsubscribe();
            subscriptionOnDeleteTodo.unsubscribe();
        }

    }, [])


    const [todos, setTodos] = useState<Todo[]>([]);


    const fetchTodos = async () => {
        try {
            const todoData = await API.graphql(graphqlOperation(listTodos)) as ListTodos;
            const todos = todoData.data.listNews.items.sort((a: Todo, b: Todo) =>
                Date.parse(b.createdAt) - Date.parse(a.createdAt)
            )
            setTodos(todos);
        } catch (e) {
            console.error(e);
        }
    }


    const handleAdd = async () => {
        const suffix = todos.length + 1;
        const todo = {
            name: `todo${suffix}`,
            description: `description${suffix}`,
            tag:`new_tag-${suffix}`,
        }
        try {
            await API.graphql(graphqlOperation(createTodo, {input: todo}));
        } catch (e) {
            console.error(e);
        }
    }

    const btnDelete = async (id: string) => {
        try {
            await API.graphql(graphqlOperation(deleteTodo, {input: {id}}));
        } catch (e) {
            console.error(e);
        }

    }

    const btnUpdate = async (todo: Todo) => {
        const suffix = todo.name.length;
        const todoUpdate = {
            id: todo.id,
            name: `${todo.name} - ${suffix}`,
            description: `${todo.description} - ${suffix}`,
            tag:`updated_tag-${suffix}`,
        }

        try {
            await API.graphql(graphqlOperation(updateTodo, {input: todoUpdate}));
        } catch (e) {
            console.error(e);
        }
    }


    return (
        <div>
            <button
                onClick={handleAdd}
                className={classNames('border', 'px-3', 'py-1', 'm-2')}
            >
                Add
            </button>

            {
                todos && todos.map((todo, index) => {
                        return (
                            <div key={index}
                                 className={classNames('border', 'w-full', 'my-3', 'p-5')}>
                                <h3>{todo.name}</h3>
                                <p>{todo.description}</p>
                                <p>{todo.tag}</p>

                                <button
                                    className={classNames('border', 'px-3', 'py-1', 'm-2')}
                                    onClick={() => {
                                        btnUpdate(todo)
                                    }}>update
                                </button>

                                <button
                                    className={classNames('border', 'px-3', 'py-1', 'm-2')}
                                    onClick={() => {
                                        btnDelete(todo.id)
                                    }}>delete
                                </button>
                            </div>
                        )
                    }
                )}

        </div>
    )
}

export default Home
