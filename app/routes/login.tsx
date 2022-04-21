import type {
    ActionFunction,
    LinkDescriptor,
    LinksFunction,
} from "@remix-run/node"
import {json} from "@remix-run/node"
import {Link, useActionData, useSearchParams} from "@remix-run/react"

import loginStylesUrl from "~/styles/login.css"

const links: LinksFunction = () => {
    const links: LinkDescriptor[] = [
        {
            href: loginStylesUrl,
            rel: "stylesheet",
        },
    ]

    return links
}

type ActionData = {
    formError?: string
    fieldErrors?: {
        username?: string
        password?: string
    }
    fields?: {
        loginType?: string
        username?: string
        password?: string
    }
}

const validateUsername = (username: string) => {
    if (username.length < 3) {
        return "Usernames must be at least 3 characters long"
    }
}

const validatePassword = (password: string) => {
    if (password.length < 6) {
        return "Passwords must be at least 6 characters long"
    }
}

const action: ActionFunction = async ({request}) => {
    const form = await request.formData()

    const redirectTo = form.get("redirectTo")
    const loginType = form.get("loginType")
    const username = form.get("username")
    const password = form.get("password")

    if (
        typeof redirectTo !== "string" ||
        typeof loginType !== "string" ||
        typeof username !== "string" ||
        typeof password !== "string"
    ) {
        return json<ActionData>(
            {formError: "Form not submitted correctly"},
            {status: 400},
        )
    }

    const fields = {
        loginType,
        username,
        password,
    }

    const fieldErrors: ActionData["fieldErrors"] = {
        username: validateUsername(username),
        password: validatePassword(password),
    }

    if (Object.values(fieldErrors).some(Boolean)) {
        return json(
            {
                fieldErrors,
                fields,
            },
            {status: 400},
        )
    }

    switch (loginType) {
        case "login": {
            return json({formError: "login not implemented", fields})
        }

        case "register": {
            return json({formError: "register not implemented", fields})
        }

        default: {
            return json({fields}, {status: 400})
        }
    }
}

const LoginRoute = () => {
    const [searchParams] = useSearchParams()
    const actionData = useActionData<ActionData>()

    return (
        <div className="container">
            <div className="content" data-light="">
                <h1>Login</h1>

                <form method="post">
                    <input
                        type="hidden"
                        name="redirectTo"
                        value={searchParams.get("redirectTo") ?? "/jokes"}
                    />

                    <fieldset>
                        <div>
                            <input
                                type="radio"
                                name="loginType"
                                value="login"
                                defaultChecked={
                                    actionData?.fields?.loginType === "login"
                                }
                            />

                            <label htmlFor="loginType"> Login</label>
                        </div>

                        <div>
                            <input
                                type="radio"
                                name="loginType"
                                value="register"
                                defaultChecked={
                                    actionData?.fields?.loginType === "register"
                                }
                            />

                            <label htmlFor="loginType"> Register</label>
                        </div>
                    </fieldset>

                    <div>
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            defaultValue={actionData?.fields?.username}
                        />

                        {actionData?.fieldErrors?.username ? (
                            <p className="form-validation-error">
                                {actionData.fieldErrors.username}
                            </p>
                        ) : null}
                    </div>

                    <div>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            defaultValue={actionData?.fields?.password}
                        />

                        {actionData?.fieldErrors?.password ? (
                            <p className="form-validation-error">
                                {actionData.fieldErrors.password}
                            </p>
                        ) : null}
                    </div>

                    {actionData?.formError ? (
                        <p className="form-validation-error">
                            {actionData.formError}
                        </p>
                    ) : null}

                    <button type="submit" className="button">
                        Submit
                    </button>
                </form>
            </div>

            <div className="links">
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>

                    <li>
                        <Link to="/jokes">Jokes</Link>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default LoginRoute
export {action, links}
