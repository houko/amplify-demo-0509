import type {NextPage} from 'next'
import {useEffect, useState} from "react";
import {Todo} from "../src/types/types";

const Home: NextPage = () => {

    const [todos, setTodos] = useState<Todo[]>([]);
    const [count, setCount] = useState(0)


    useEffect(() => {


    }, [count])



    // const fetchTodos = async () => {
    //     const todoData = await API.graphql(graphqlOperation(listTodos))
    // }


    return (
        <div>

        </div>
    )
}

export default Home
