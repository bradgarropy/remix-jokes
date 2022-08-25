import type {Joke} from "@prisma/client"
import type {ErrorBoundaryComponent, LoaderFunction} from "@remix-run/node"
import {json} from "@remix-run/node"
import {Link, useCatch, useLoaderData} from "@remix-run/react"

import {db} from "~/utils/db.server"

type LoaderData = {
    joke: Pick<Joke, "id" | "name" | "content">
}

const loader: LoaderFunction = async () => {
    const count = await db.joke.count()
    const randomIndex = Math.floor(Math.random() * count)

    const [joke] = await db.joke.findMany({
        take: 1,
        skip: randomIndex,
    })

    if (!joke) {
        throw new Response("No random joke found.", {status: 404})
    }

    const data: LoaderData = {
        joke,
    }

    return json(data)
}

const JokesIndexRoute = () => {
    const data = useLoaderData<LoaderData>()

    return (
        <div>
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            <p>Here's a random joke:</p>
            <p>{data.joke.content}</p>

            <Link to={data.joke.id}>{data.joke.name} Permalink</Link>
        </div>
    )
}

const CatchBoundary = () => {
    const caught = useCatch()

    switch (caught.status) {
        case 404: {
            return (
                <div className="error-container">
                    <p>There are no jokes to tell.</p>
                </div>
            )
        }

        default:
            break
    }
}

const ErrorBoundary: ErrorBoundaryComponent = ({error}) => {
    console.log(error)

    return (
        <div className="error-container">
            <p>Something went wrong loading your jokes.</p>
        </div>
    )
}

export default JokesIndexRoute
export {CatchBoundary, ErrorBoundary, loader}
