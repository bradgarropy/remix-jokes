import type {Joke} from "@prisma/client"
import type {ErrorBoundaryComponent, LoaderFunction} from "@remix-run/node"
import {json} from "@remix-run/node"
import {Link, useCatch, useLoaderData, useParams} from "@remix-run/react"

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
        throw new Response("Joke not found.", {status: 404})
    }

    const data: LoaderData = {joke}
    return json(data)
}

const CatchBoundary = () => {
    const caught = useCatch()

    switch (caught.status) {
        case 404: {
            return (
                <div className="error-container">
                    <p>Joke not found.</p>
                </div>
            )
        }

        default:
            break
    }
}

const ErrorBoundary: ErrorBoundaryComponent = () => {
    const {jokeId} = useParams()

    return (
        <div className="error-container">
            <p>{`Whoops! Something went wrong loading ${jokeId}`}</p>
        </div>
    )
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
export {CatchBoundary, ErrorBoundary, loader}
