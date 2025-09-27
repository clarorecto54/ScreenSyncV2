import { randomBytes } from "crypto";

export default function GenerateRandomBytes()
{
    return randomBytes(16).toString("base64")
}