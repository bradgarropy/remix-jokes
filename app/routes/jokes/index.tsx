import type {Joke} from "@prisma/client"
import type {LoaderFunction} from "@remix-run/node"
import {json} from "@remix-run/node"
import {Link, useLoaderData} from "@remix-run/react"

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

export default JokesIndexRoute
export {loader}
