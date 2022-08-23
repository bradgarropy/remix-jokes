import {createCookieSessionStorage, redirect} from "@remix-run/node"
import {compare} from "bcryptjs"

import {db} from "./db.server"

type Credentials = {
    username: string
    password: string
}

const login = async ({username, password}: Credentials) => {
    const user = await db.user.findFirst({where: {username}})

    if (!user) {
        return null
    }

    const match = await compare(password, user.passwordHash)

    if (!match) {
        return null
    }

    return user
}

const sessionSecret = process.env.SESSION_SECRET

if (!sessionSecret) {
    throw new Error("Must set SESSION_SECRET environment variable.")
}

const storage = createCookieSessionStorage({
    cookie: {
        secure: true,
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
        name: "remix-jokes-session",
        secrets: [sessionSecret],
    },
})

const createSession = async (userId: string, redirectTo: string) => {
    const session = await storage.getSession()
    session.set("userId", userId)

    return redirect(redirectTo, {
        headers: {
            "Set-Cookie": await storage.commitSession(session),
        },
    })
}

const getSession = (request: Request) => {
    return storage.getSession(request.headers.get("Cookie"))
}

const getUserId = async (request: Request) => {
    const session = await getSession(request)
    const userId = session.get("userId")

    if (typeof userId !== "string") {
        return null
    }

    return userId
}

// use this for protected routes
const requireUserId = async (
    request: Request,
    redirectTo: string = new URL(request.url).pathname,
) => {
    const userId = await getUserId(request)

    if (!userId) {
        const params = new URLSearchParams([["redirectTo", redirectTo]])
        throw redirect(`/login?${params}`)
    }

    return userId
}

export {createSession, getUserId, login, requireUserId}
