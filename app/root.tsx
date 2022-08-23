import type {
    ErrorBoundaryComponent,
    LinkDescriptor,
    LinksFunction,
} from "@remix-run/node"
import {Links, LiveReload, Outlet} from "@remix-run/react"
import type {FC, ReactNode} from "react"

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

type DocumentProps = {
    title?: string
    children?: ReactNode
}

const Document: FC<DocumentProps> = ({
    title = "Remix: So great, it's funny!",
    children,
}) => {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                <title>{title}</title>
                <Links />
            </head>

            <body>
                {children}
                {process.env.NODE_ENV === "development" ? <LiveReload /> : null}
            </body>
        </html>
    )
}

const App = () => {
    return (
        <Document>
            <Outlet />
        </Document>
    )
}

const ErrorBoundary: ErrorBoundaryComponent = ({error}) => {
    return (
        <Document title="Oh no!">
            <div className="error-container">
                <h1>Something went wrong</h1>
                <p>{error.message}</p>
            </div>
        </Document>
    )
}

export default App
export {ErrorBoundary, links}
