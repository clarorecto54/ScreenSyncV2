const { createServer } = require('https')
const { parse } = require('url')
const os = require("os")
const next = require('next')
const fs = require("fs")
const dev = process.env.NODE_ENV !== 'production'
process.env.TUBOPACK = "1"
const port = 3000
let IP = ""
try {
    for (let index = 0; index < 4; index++) {
        let data = os.networkInterfaces()[Object.keys(os.networkInterfaces())[index]][0].address
        if ((data.split(".").length - 1) === 3) {
            IP = data
            break
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