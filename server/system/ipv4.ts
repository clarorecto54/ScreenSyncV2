import { networkInterfaces } from "os";
export default function GETIP()
{
    var IP = "localhost" //? Default IP
    try
   
    {
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
    return IP
}