import { NextApiRequest, NextApiResponse } from "next"
import { networkInterfaces } from "os"

const os = require("os")
export default function Handler(req: NextApiRequest, res: NextApiResponse) {
    var IP: string = "127.0.0.1" //? Default IP
    try {
        const networks = networkInterfaces()
        for (const [name, descs] of Object.entries(networks))
        {
            if (!descs) continue
            for (const desc of descs)
            {
                if (desc.family === "IPv4" && !desc.internal) IP = desc.address
            }
        }
    } catch (error) { console.log("No LAN Detected running on localhost") }
    res.status(200).send(IP)
    res.status(200).end()
}