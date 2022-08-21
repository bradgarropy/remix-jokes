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

export {login}
