"use client"
import { ImageQuestion, Question, StandardQuestion } from "@/types/Exam.types"
import { Card, CardHeader, Avatar, Collapse, CardContent, CardActions, Button, RadioGroup, FormControlLabel, Radio, Typography, Divider, Stack } from "@mui/material"
import { useSchema } from "../hooks/useSchema"
import Image from "next/image"
import { useState } from "react"

export default function SchemaQuestionPreview({ id, elements, index }: { id: string, elements: Question[], index: number })
{
    const { schemaErrors, setSchemaData, setBuilderPage, setQuestionId, setSchemaErrors } = useSchema()
    const [hover, setHover] = useState<boolean>(false)
    const [imgElement] = useState<ImageQuestion>(elements.find(element => element.type === "image")! as ImageQuestion)
    const [element] = useState<StandardQuestion>(elements.find(element => element.type === "radiogroup")! as StandardQuestion)
    const [questionError] = useState(schemaErrors.QuestionsError.find(question => question.id === id))
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
            title={element.title || "Question"}
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
                title: {
                    noWrap: false,
                    style: { whiteSpace: "normal", wordBreak: "break-word" }
                },
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
            <CardContent
                sx={{ paddingY: 0 }}
                style={{ paddingTop: 0, paddingBottom: "8px" }}
            >
                {imgElement && <Stack gap={2} sx={{ paddingTop: "8px" }}>
                    <Divider sx={{ fontWeight: 500, fontSize: "10pt" }}>
                        <Typography color="textPrimary" fontSize="14px">
                            IMAGE
                        </Typography>
                    </Divider>
                    <div className="aspect-video w-full max-h-[240px] relative">
                        <Image alt="" fill src={imgElement.imageLink} style={{ objectFit: "contain" }} />
                    </div>
                </Stack>}
                {element.choices.length > 0 && <CardContent sx={{ paddingY: 0, paddingTop: "16px" }}>
                    <Divider sx={{ fontWeight: 500, fontSize: "10pt" }}>
                        <Typography color="textPrimary" fontSize="14px">
                            CHOICES
                        </Typography>
                    </Divider>
                    <RadioGroup sx={{
                        paddingLeft: "8px",
                        maxHeight: "128px",
                        display: "flex",
                        flexDirection: "row",
                        overflowY: "scroll"
                    }}>
                        {element.choices.map((choice, index) =>
                            <FormControlLabel
                                key={index}
                                label={choice}
                                slotProps={{
                                    typography: {
                                        noWrap: false,
                                        style: { whiteSpace: "normal", wordBreak: "break-word" }
                                    }
                                }}
                                sx={{ width: "100%" }}
                                control={
                                    <Radio
                                        checked={element.correctAnswer === choice}
                                        disableRipple
                                        color="default"
                                        onClick={() => setSchemaData(prev =>
                                        {
                                            const updatedPages = [...prev.pages]
                                            const element = updatedPages.find(page => page.id === id)!
                                            const question = element.elements.find(question => question.type === "radiogroup")! as StandardQuestion
                                            question.correctAnswer = choice
                                            return { ...prev, pages: updatedPages }
                                        })}
                                    />
                                } />)}
                    </RadioGroup>
                </CardContent>}
                <CardActions sx={{ paddingTop: "16px" }}>
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