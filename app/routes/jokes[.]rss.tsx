import type {LoaderFunction} from "@remix-run/node"

import {db} from "~/utils/db.server"

const loader: LoaderFunction = async ({request}) => {
    const jokes = await db.joke.findMany({
        take: 100,
        orderBy: {createdAt: "desc"},
        include: {
            User: {
                select: {
                    username: true,
                },
            },
        },
    })

    const host =
        request.headers.get("X-Forwarded-Host") ?? request.headers.get("host")

    if (!host) {
        throw new Error("Could not determine domain URL.")
    }

    const protocol = host.includes("localhost") ? "http" : "https"
    const domain = `${protocol}://${host}`
    const jokesUrl = `${domain}/jokes`

    const rss = `
    <rss xmlns:blogChannel="${jokesUrl}" version="2.0">
      <channel>
        <title>Remix Jokes</title>
        <link>${jokesUrl}</link>
        <description>Some funny jokes</description>
        <language>en-us</language>
        <generator>Kody the Koala</generator>
        <ttl>40</ttl>
        ${jokes
            .map(joke =>
                `
            <item>
              <title>${joke.name}</title>
              <description>A funny joke called ${joke.name}.</description>
              <author>${joke.User.username}</author>
              <pubDate>${joke.createdAt.toUTCString()}</pubDate>
              <link>${jokesUrl}/${joke.id}</link>
              <guid>${jokesUrl}/${joke.id}</guid>
            </item>
          `.trim(),
            )
            .join("\n")}
      </channel>
    </rss>
  `.trim()

    return new Response(rss, {
        headers: {
            "Cache-Control": `public, max-age=${60 * 10}, s-maxage=${
                60 * 60 * 24
            }`,
            "Content-Type": "application/xml",
            "Content-Length": String(Buffer.byteLength(rss)),
        },
    })
}

export {loader}
