import { NextApiRequest, NextApiResponse } from "next"

const os = require("os")
export default function Handler(req: NextApiRequest, res: NextApiResponse) {
    var IP: string = "127.0.0.1" //? Default IP
    try {
        for (var index = 0; index < 4; index++) { //? Find a valid IP
            const data: string = os.networkInterfaces()[Object.keys(os.networkInterfaces())[index]][0].address
            if ((data.split(".").length - 1) === 3) {
                IP = data //? If valid IP found it will return it
                break
            }
        }
    } catch (error) { console.log("No LAN Detected running on localhost") }
    res.status(200).send(IP)
    res.status(200).end()
}