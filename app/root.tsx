import type {LinkDescriptor, LinksFunction} from "@remix-run/node"
import {Links, LiveReload, Outlet} from "@remix-run/react"

import globalStylesUrl from "~/styles/global.css"
import globalLargeStylesUrl from "~/styles/global-large.css"
import globalMediumStylesUrl from "~/styles/global-medium.css"

const links: LinksFunction = () => {
    const links: LinkDescriptor[] = [
        {
            href: globalStylesUrl,
            rel: "stylesheet",
        },
        {
            href: globalLargeStylesUrl,
            rel: "stylesheet",
            media: "print, (min-width: 640px)",
        },
        {
            href: globalMediumStylesUrl,
            rel: "stylesheet",
            media: "screen, (min-width: 1024px)",
        },
    ]

    return links
}

const App = () => {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                <title>Remix: So great, it's funny!</title>
                <Links />
            </head>

            <body>
                <Outlet />
                <LiveReload />
            </body>
        </html>
    )
}

export default App
export {links}
