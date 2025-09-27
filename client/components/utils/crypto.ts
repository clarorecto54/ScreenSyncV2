import { createHash } from "crypto";

export default function HashData(data: string)
{
    return createHash("SHA512", { outputLength: 64 })
        .update(data)
        .digest("base64");
}