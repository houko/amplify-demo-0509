import type {NextPage} from 'next'
import {useEffect, useState} from "react";
import {ListNews, News, Todo} from "../src/types/types";
import {API, graphqlOperation} from "aws-amplify";
import {createNews, createTodo, deleteNews, deleteTodo, updateNews, updateTodo} from "../src/graphql/mutations";
import classNames from "classnames";
import {listNews} from "../src/graphql/queries";
import {
    onCreateNews,
    onDeleteNews,
    onUpdateNews,
} from "../src/graphql/subscriptions";
import {Observable} from "zen-observable-ts";

const NewsPage: NextPage = () => {


    useEffect(() => {
        fetchNews();
        console.log("subscribing");
        const createGraphql = API.graphql(graphqlOperation(onCreateNews)) as Observable<any>;
        const subscriptionOnCreate = createGraphql.subscribe({
            next: (data: News[]) => {
                fetchNews();
            }
        });

        const updateGraphql = API.graphql(graphqlOperation(onUpdateNews)) as Observable<any>;
        const subscriptionOnUpdate = updateGraphql.subscribe({
            next: (data: News[]) => {
                fetchNews();
            }
        });

        const deleteGraphql = API.graphql(graphqlOperation(onDeleteNews)) as Observable<any>;
        const subscriptionOnDelete = deleteGraphql.subscribe({
            next: (data: News[]) => {
                fetchNews();
            }
        });

        return () => {
            subscriptionOnCreate.unsubscribe();
            subscriptionOnUpdate.unsubscribe();
            subscriptionOnDelete.unsubscribe();
        }

    }, [])


    const [news, setNews] = useState<News[]>([]);


    const fetchNews = async () => {
        try {
            const todoData = await API.graphql(graphqlOperation(listNews)) as ListNews;
            const newsList = todoData.data.listNews.items.sort((a: News, b: News) =>
                Date.parse(b.createdAt) - Date.parse(a.createdAt)
            )
            setNews(newsList);
        } catch (e) {
            console.error(e);
        }
    }


    const handleAdd = async () => {
        const suffix = news.length + 1;
        const newNews = {
            id: `newsId-${suffix}`,
            title: `newsTitle${suffix}`,
            summary: `summary${suffix}`,
            author: `xiaomo-${suffix}`,
            content:`content-${suffix}`,
        }
        try {
            await API.graphql(graphqlOperation(createNews, {input: newNews}));
        } catch (e) {
            console.error(e);
        }
    }

    const btnDelete = async (id: string) => {
        try {
            await API.graphql(graphqlOperation(deleteNews, {input: {id}}));
        } catch (e) {
            console.error(e);
        }

    }

    const btnUpdate = async (newsEntity: News) => {
        const suffix = newsEntity.title.length;
        const todoUpdate = {
            id: newsEntity.id,
            title: `${newsEntity.title} - ${suffix}`,
            summary: `${newsEntity.summary} - ${suffix}`,
            author: `${newsEntity.author} - ${suffix}`,
            content:`updated_tag-${suffix}`,
        }

        try {
            await API.graphql(graphqlOperation(updateNews, {input: todoUpdate}));
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
                Add news
            </button>

            {
                news && news.map((news, index) => {
                        return (
                            <div key={index}
                                 className={classNames('border', 'w-full', 'my-3', 'p-5')}>
                                <h3>{news.title}</h3>
                                <p>{news.summary}</p>
                                <p>{news.author}</p>
                                <p>{news.content}</p>

                                <button
                                    className={classNames('border', 'px-3', 'py-1', 'm-2')}
                                    onClick={() => {
                                        btnUpdate(news)
                                    }}>update
                                </button>

                                <button
                                    className={classNames('border', 'px-3', 'py-1', 'm-2')}
                                    onClick={() => {
                                        btnDelete(news.id)
                                    }}>delete
                                </button>
                            </div>
                        )
                    }
                )}

        </div>
    )
}

export default NewsPage
