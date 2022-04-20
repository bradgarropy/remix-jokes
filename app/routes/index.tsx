import type {LinkDescriptor, LinksFunction} from "@remix-run/node"
import {Link} from "@remix-run/react"

import stylesUrl from "~/styles/index.css"

const links: LinksFunction = () => {
    const links: LinkDescriptor[] = [
        {
            href: stylesUrl,
            rel: "stylesheet",
        },
    ]

    return links
}

const IndexRoute = () => {
    return (
        <div className="container">
            <div className="content">
                <h1>
                    Remix <span>Jokes!</span>
                </h1>
                <nav>
                    <ul>
                        <li>
                            <Link to="jokes">Read Jokes</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    )
}

export default IndexRoute
export {links}
