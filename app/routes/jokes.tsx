import type {Joke} from "@prisma/client"
import type {
    LinkDescriptor,
    LinksFunction,
    LoaderFunction,
} from "@remix-run/node"
import {json} from "@remix-run/node"
import {Link, Outlet, useLoaderData} from "@remix-run/react"

import jokesStylesUrl from "~/styles/jokes.css"
import {db} from "~/utils/db.server"

type LoaderData = {
    jokes: Pick<Joke, "id" | "name">[]
}

const loader: LoaderFunction = async () => {
    const jokes = await db.joke.findMany({
        take: 5,
        select: {
            id: true,
            name: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    })

    const data: LoaderData = {
        jokes,
    }

    return json(data)
}

const links: LinksFunction = () => {
    const links: LinkDescriptor[] = [
        {
            href: jokesStylesUrl,
            rel: "stylesheet",
        },
    ]

    return links
}

const JokesRoute = () => {
    const data = useLoaderData<LoaderData>()

    return (
        <div className="jokes-layout">
            <header className="jokes-header">
                <div className="container">
                    <h1 className="home-link">
                        <Link
                            to="/"
                            title="remix Jokes"
                            aria-label="Remix Jokes"
                        >
                            <span className="logo">🤪</span>
                            <span className="logo-medium">J🤪KES</span>
                        </Link>
                    </h1>
                </div>
            </header>

            <main className="jokes-main">
                <div className="container">
                    <div className="jokes-list">
                        <Link to=".">Get a random joke</Link>

                        <p>Here are a few more jokes to check out:</p>

                        <ul>
                            {data.jokes.map(joke => {
                                return (
                                    <li key={joke.id}>
                                        <Link to={joke.id}>{joke.name}</Link>
                                    </li>
                                )
                            })}
                        </ul>

                        <Link to="new" className="button">
                            Add your own
                        </Link>
                    </div>

                    <div className="jokes-outlet">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    )
}

export default JokesRoute
export {links, loader}
