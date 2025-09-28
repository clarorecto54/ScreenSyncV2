import { ExamProp } from "../system/exam/exam.types"

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