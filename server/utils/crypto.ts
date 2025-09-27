export function Encrypt(data: unknown)
{
    const text = JSON.stringify(data)
    return Buffer.from(text, "utf-8").toString("base64")
}

export function Decrypt(text: string)
{
    const data = Buffer.from(text, "base64").toString("utf-8")
    return JSON.parse(data)
}