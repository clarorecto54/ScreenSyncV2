import { ExamProp } from "@/types/Exam.types";
import { createHash } from "crypto";

export default function HashData(data: string)
{
    return createHash("SHA512", { outputLength: 64 })
        .update(data)
        .digest("base64");
}

export function EncryptSchema(data: ExamProp): string
{
    const text = JSON.stringify(data)
    return Buffer.from(text, "utf-8").toString("base64")
}

export function DecryptSchema(text: string): ExamProp
{
    const data = Buffer.from(text, "base64").toString("utf-8")
    return JSON.parse(data)
}