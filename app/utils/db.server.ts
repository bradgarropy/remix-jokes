import {PrismaClient} from "@prisma/client"

let db: PrismaClient

declare global {
    const __db: PrismaClient | undefined
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
if (process.env.NODE_ENV === "production") {
    console.log("PRODUCTION")
    db = new PrismaClient()
} else {
    console.log("DEVELOPMENT")
    if (!global.__db) {
        console.log("NEW CLIENT")
        global.__db = new PrismaClient()
    }

    db = global.__db
}

export {db}
