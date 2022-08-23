import type {ActionFunction, LoaderFunction} from "@remix-run/node"
import {redirect} from "@remix-run/node"

import {logout} from "~/utils/auth.server"

const action: ActionFunction = ({request}) => {
    return logout(request)
}

const loader: LoaderFunction = () => {
    return redirect("/jokes")
}

export {action, loader}
