import type {Joke} from "@prisma/client"
import type {
    ActionFunction,
    ErrorBoundaryComponent,
    LoaderFunction,
} from "@remix-run/node"
import {redirect} from "@remix-run/node"
import {json} from "@remix-run/node"
import {Link, useCatch, useLoaderData, useParams} from "@remix-run/react"

import {getUserId, requireUserId} from "~/utils/auth.server"
import {db} from "~/utils/db.server"

type LoaderData = {
    joke: Pick<Joke, "name" | "content">
    isOwner: boolean
}

const loader: LoaderFunction = async ({request, params}) => {
    const userId = await getUserId(request)

    const joke = await db.joke.findUnique({
        where: {
            id: params.jokeId,
        },
    })

    const isOwner = joke?.userId === userId

    if (!joke) {
        throw new Response("Joke not found.", {status: 404})
    }

    const data: LoaderData = {joke, isOwner}
    return json(data)
}

const action: ActionFunction = async ({request, params}) => {
    const form = await request.formData()

    if (form.get("_method") !== "delete") {
        throw new Response(
            `The ${form.get("_method")} method is not supported.`,
            {status: 400},
        )
    }

    const userId = await requireUserId(request)
    const joke = await db.joke.findUnique({where: {id: params.jokeId}})

    if (!joke) {
        throw new Response("Can't delete a joke that does not exist.", {
            status: 404,
        })
    }

    if (joke?.userId !== userId) {
        throw new Response("Can't delete a joke that doesn't belong to you.", {
            status: 401,
        })
    }

    await db.joke.delete({where: {id: params.jokeId}})
    return redirect("/jokes")
}

const JokeRoute = () => {
    const {joke, isOwner} = useLoaderData<LoaderData>()

    return (
        <div>
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            <p>Here's your hilarious joke:</p>
            <p>{joke.content}</p>
            <Link to=".">{joke.name} Permalink</Link>

            {isOwner ? (
                <form method="post">
                    <input type="hidden" name="_method" value="delete" />

                    <button type="submit" className="button">
                        Delete
                    </button>
                </form>
            ) : null}
        </div>
    )
}

const CatchBoundary = () => {
    const caught = useCatch()
    const params = useParams()

    switch (caught.status) {
        case 400: {
            return (
                <div className="error-container">
                    What you&apos;re trying to do is not allowed.
                </div>
            )
        }

        case 401: {
            return (
                <div className="error-container">
                    Sorry, but {params.jokeId} is not your joke.
                </div>
            )
        }

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

export default JokeRoute
export {action, CatchBoundary, ErrorBoundary, loader}
