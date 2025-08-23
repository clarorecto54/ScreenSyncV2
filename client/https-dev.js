import next from "next"
import { networkInterfaces } from "os"
import { createServer } from "https"
import { parse } from "url"
import fs from "fs"
const dev = process.env.NODE_ENV !== 'production'
process.env.TUBOPACK = "1"
const port = 3000
let IP = ""
try {
    const networks = networkInterfaces()
    for (const [name, descs] of Object.entries(networks)) {
        if (!descs) continue
        for (const desc of descs) {
            if (desc.family === "IPv4" && !desc.internal) IP = desc.address
        }
    }
} catch { console.log("No LAN Detected running on localhost") }
const app = next({ dev, IP, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
    createServer({
        key: fs.readFileSync("../SSL/server.key"),
        cert: fs.readFileSync("../SSL/server.crt")
    }, async (req, res) => {
        try {
            const parsedUrl = parse(req.url, true)
            const { pathname, query } = parsedUrl
            if (pathname === '/a') {
                await app.render(req, res, '/a', query)
            } else if (pathname === '/b') {
                await app.render(req, res, '/b', query)
            } else {
                await handle(req, res, parsedUrl)
            }
        } catch (err) {
            console.error('Error occurred handling', req.url, err)
            res.statusCode = 500
            res.end('internal server error')
        }
    })
        .once('error', (err) => {
            console.error(err)
            process.exit(1)
        })
        .listen(port, () => {
            console.log(`> Ready on https://${IP}:${port}`)
        })
})