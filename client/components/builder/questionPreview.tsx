"use client"
import { Question } from "@/types/Exam.types"
import { Card, CardHeader, Avatar, Collapse, CardContent, CardActions, Button, RadioGroup, FormControlLabel, Radio } from "@mui/material"
import { useSchema } from "../hooks/useSchema"
import Image from "next/image"
import { useState } from "react"

export default function SchemaQuestionPreview({ id, elements, index }: { id: string, elements: Question[], index: number })
{
    const { schemaErrors, setSchemaData, setBuilderPage, setQuestionId, setSchemaErrors } = useSchema()
    const [hover, setHover] = useState<boolean>(false)
    const element = elements.find(element => element.type === "radiogroup")!
    const questionError = schemaErrors.QuestionsError.find(question => question.id === id)
    const DeleteQuestion = () => setSchemaData(
        prev =>
        {
            setSchemaErrors(prev => ({ ...prev, QuestionsError: prev.QuestionsError.filter(question => question.id !== id) }))
            return { ...prev, pages: prev.pages.filter(question => question.id !== id) }
        }
    )
    const EditQuestion = () => setQuestionId(() =>
    {
        setBuilderPage("Edit Question")
        return id
    })
    return <Card
        key={index}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        sx={{ display: "flex", flexDirection: "column" }}
    >
        <CardHeader
            className="transition-all duration-300"
            title={element.title || element.name}
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
                paddingBottom: hover ? 0 : "16px",
                cursor: "pointer"
            }}
        />
        <Collapse
            in={hover} timeout="auto" unmountOnExit
        >
            <CardContent>
                {element.choices.length > 0 && <CardContent>
                    <RadioGroup>
                        {element.choices.map((choice, index) =>
                            <FormControlLabel key={index} control={
                                <Radio
                                    checked={element.correctAnswer === choice}
                                    disableRipple
                                    color="default"
                                    onClick={() => setSchemaData(prev =>
                                    {
                                        const updatedPages = [...prev.pages]
                                        const element = updatedPages.find(page => page.id === id)!
                                        const question = element.elements.find(question => question.type === "radiogroup")!
                                        question.correctAnswer = choice
                                        return { ...prev, pages: updatedPages }
                                    })}
                                />
                            } label={choice} />)}
                    </RadioGroup>
                </CardContent>}
                <CardActions >
                    {["Edit", "Delete"].map((value, index) => <Button
                        key={index}
                        size="small"
                        color={value === "Edit" ? "primary" : "error"}
                        onClick={() => value === "Edit" ? EditQuestion() : DeleteQuestion()}
                        startIcon={<div className="aspect-square h-[12px] relative whiteOverlay">
                            <Image alt="" fill src={require(`@/public/images/${value === "Edit" ? "Paint" : "Close 2"}.svg`)} />
                        </div>}
                        variant="contained"
                        sx={{ borderRadius: "100px", paddingX: "16px", paddingY: "4px" }}
                    >
                        {value}
                    </Button>)}
                </CardActions>
            </CardContent>
        </Collapse>
    </Card>
}