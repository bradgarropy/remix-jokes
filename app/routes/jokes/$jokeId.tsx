import type {Joke} from "@prisma/client"
import type {ErrorBoundaryComponent, LoaderFunction} from "@remix-run/node"
import {json} from "@remix-run/node"
import {Link, useLoaderData} from "@remix-run/react"

import {db} from "~/utils/db.server"

type LoaderData = {
    joke: Pick<Joke, "name" | "content">
}

const loader: LoaderFunction = async ({params}) => {
    const joke = await db.joke.findUnique({
        where: {
            id: params.jokeId,
        },
    })

    if (!joke) {
        throw new Error("Joke not found")
    }

    const data: LoaderData = {joke}
    return json(data)
}

const ErrorBoundary: ErrorBoundaryComponent = () => {
    return <div>Whoops! Something went wrong.</div>
}

const JokeRoute = () => {
    const data = useLoaderData<LoaderData>()

    return (
        <div>
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            <p>Here's your hilarious joke:</p>
            <p>{data.joke.content}</p>
            <Link to=".">{data.joke.name} Permalink</Link>
        </div>
    )
}

export default JokeRoute
export {ErrorBoundary, loader}
