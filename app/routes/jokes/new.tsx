import type {Joke} from "@prisma/client"
import type {
    ActionFunction,
    ErrorBoundaryComponent,
    LoaderFunction,
} from "@remix-run/node"
import {json} from "@remix-run/node"
import {redirect} from "@remix-run/node"
import {Form, Link, useActionData, useCatch} from "@remix-run/react"

import {getUserId, requireUserId} from "~/utils/auth.server"
import {db} from "~/utils/db.server"

type ActionData = {
    formError?: string
    fieldErrors?: {
        name?: string
        content?: string
    }
    fields?: Pick<Joke, "name" | "content">
}

const validateJokeName = (name: string) => {
    if (name.length < 3) {
        return "That joke's name is too short"
    }
}

const validateJokeContent = (content: string) => {
    if (content.length < 10) {
        return "That joke is too short"
    }
}

// use this to prevent loading a page where authentication is required
// const loader: LoaderFunction = async ({request}) => {
//     await requireUserId(request)
//     return {}
// }

const loader: LoaderFunction = async ({request}) => {
    const userId = await getUserId(request)

    if (!userId) {
        throw new Response("Please login.", {status: 401})
    }

    return {}
}

const action: ActionFunction = async ({request}) => {
    const userId = await requireUserId(request)

    const form = await request.formData()
    const name = form.get("name")
    const content = form.get("content")

    if (typeof name !== "string" || typeof content !== "string") {
        return json<ActionData>(
            {formError: "Form not submitted correctly"},
            {status: 400},
        )
    }

    const fieldErrors: ActionData["fieldErrors"] = {
        name: validateJokeName(name),
        content: validateJokeContent(content),
    }

    if (Object.values(fieldErrors).some(Boolean)) {
        return json<ActionData>(
            {
                fieldErrors,
                fields: {
                    name,
                    content,
                },
            },
            {status: 400},
        )
    }

    const joke = await db.joke.create({
        data: {
            name,
            content,
            userId,
        },
    })

    return redirect(`/jokes/${joke.id}`)
}

const NewJokeRoute = () => {
    const actionData = useActionData<ActionData>()

    return (
        <div>
            <p>Add your own hilarious joke</p>

            <Form method="post">
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        defaultValue={actionData?.fields?.name}
                    />

                    {actionData?.fieldErrors?.name ? (
                        <p className="form-validation-error">
                            {actionData.fieldErrors.name}
                        </p>
                    ) : null}
                </div>

                <div>
                    <label htmlFor="content">Content:</label>

                    <textarea
                        name="content"
                        id="content"
                        defaultValue={actionData?.fields?.content}
                    />

                    {actionData?.fieldErrors?.content ? (
                        <p className="form-validation-error">
                            {actionData.fieldErrors.content}
                        </p>
                    ) : null}
                </div>

                <div>
                    {actionData?.formError ? (
                        <p className="form-validation-error">
                            {actionData.formError}
                        </p>
                    ) : null}

                    <button type="submit" className="button">
                        Add
                    </button>
                </div>
            </Form>
        </div>
    )
}

const CatchBoundary = () => {
    const caught = useCatch()

    switch (caught.status) {
        case 401: {
            return (
                <div className="error-container">
                    <p>You must login to create a joke.</p>
                    <Link to="/login">Login</Link>
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
            <p>Something went wrong creating your joke.</p>
        </div>
    )
}

export default NewJokeRoute
export {action, CatchBoundary, ErrorBoundary, loader}
