import type {LinkDescriptor, LinksFunction} from "@remix-run/node"
import {Link, Outlet} from "@remix-run/react"

import jokesStylesUrl from "~/styles/jokes.css"

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
                            <li>
                                <Link to="some-joke-id">Hippo</Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="jokes-outlet">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}

export default JokesRoute
export {links}
