"use client"
import { Question } from "@/types/Exam.types"
import { Card, CardHeader, Avatar } from "@mui/material"
import { useSchema } from "../hooks/useSchema"
import Image from "next/image"

export default function SchemaQuestionPreview(elements: Question[], index: number)
{
    const { schemaErrors } = useSchema()
    const element = elements.find(element => element.type === "radiogroup")!
    const questionError = schemaErrors?.QuestionsError.find(question => question.name === element.name)
    return <Card key={index} sx={{ display: "flex", flexDirection: "column" }}>
        <CardHeader
            className="transition-all duration-300"
            title={element.name}
            subheader={questionError?.error}
            avatar={<Avatar
                sx={{
                    height: "24px", width: "24px", background: "none",
                }}>
                <Image
                    alt=""
                    src={require("@/public/images/Question.svg")}
                />
            </Avatar>}
            slotProps={{
                subheader: {
                    color: questionError ? "error" : "textSecondary"
                }
            }}
            sx={{
                paddingBottom: "16px",
                cursor: "pointer"
            }}
        />
    </Card>
}