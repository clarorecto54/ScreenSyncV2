import { Button } from "@mui/material"
import { Dispatch, SetStateAction } from "react"
import { useExam } from "../hooks/useExam"
import SchemaBuilder from "./schema"
import { useSchema } from "../hooks/useSchema"
import { HtmlElement, StandardQuestion } from "@/types/Exam.types"

export default function SchemaList()
{
    const { schemaList } = useExam()
    const { schemaBuilder, setSchemaBuilder, setSchemaData } = useSchema()
    return <>
        <label className="font-[Montserrat] text-[16pt] font-[600] Unselectable"
        >Quiz Schema</label>
        <div className="w-full h-full text-[Montserrat]
    flex flex-col gap-[8px] items-center">
            {(schemaList.length === 0 && !schemaBuilder) && "No quiz schema found. Create a new one?"}
            <Button color="success" variant="contained" sx={{ borderRadius: "100px" }}
                onClick={() =>
                {
                    setSchemaBuilder(true)
                    setSchemaData({
                        title: "",
                        timeLimit: 60,
                        startSurveyText: "Start Quiz",
                        pages: [
                            {
                                elements: [
                                    {
                                        type: "html",
                                        html: "Please input any starting message here"
                                    } satisfies HtmlElement
                                ]
                            },
                            {
                                elements: [{
                                    name: "Question 1",
                                    question: "",
                                    type: "radiogroup",
                                    isRequired: true,
                                    correctAnswer: "",
                                    titleLocation: "top",
                                    choicesOrder: "random",
                                    choices: []
                                } satisfies StandardQuestion]
                            }
                        ],
                    })
                }}>
                Create Schema
            </Button>
        </div>
    </>
}