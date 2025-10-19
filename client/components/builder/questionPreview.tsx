"use client"
import { Element, ImageQuestion, Question, StandardQuestion } from "@/types/Exam.types"
import { Card, CardHeader, Avatar, Collapse, CardContent, CardActions, Button, RadioGroup, FormControlLabel, Radio, Typography, Divider, Stack, ButtonPropsColorOverrides, ButtonOwnProps } from "@mui/material"
import { useSchema } from "../hooks/useSchema"
import Image from "next/image"
import { useEffect, useState } from "react"
import AddQuestion from "@/components/utils/generateQuestion"
import GenerateRandomBytes from "@/components/utils/randomBytes"
import { useExam } from "@/components/hooks/useExam"

export default function SchemaQuestionPreview({
    id, elements, index, isImport = false
}: {
    id: string
    elements: Question[]
    index: number
    isImport?: boolean
})
{
    const { schemaList } = useExam()
    const { schemaErrors, setSchemaData, setBuilderPage, setQuestionId, setSchemaErrors, imports, setImports } = useSchema()
    const [hover, setHover] = useState<boolean>(false)
    const [sourceSchema, setSourceSchema] = useState<string>("")
    const [sourceSubject, setSourceSubject] = useState<string>("")
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
    const DuplicateQuestion = () => setSchemaData(prev =>
    {
        const updatedPages = prev.pages
        const duplicatedQuestion: Element = AddQuestion(GenerateRandomBytes())
        duplicatedQuestion.elements = elements
        updatedPages.push(duplicatedQuestion)
        return { ...prev, pages: updatedPages }
    })
    const EditQuestion = () => setQuestionId(() =>
    {
        setBuilderPage("Edit Question")
        return id
    })
    const GetSourceSchema = () =>
    {
        const target = schemaList.find(schema => schema.pages.find(page => page.id === id))!
        setSourceSchema(target.title)
        setSourceSubject(target.description)
    }
    useEffect(() =>
    {
        if (!isImport) return
        GetSourceSchema()
    }, [isImport])
    return <Card
        key={index}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        sx={{ display: "flex", flexDirection: "column" }}
    >
        <CardHeader
            className="transition-all duration-300"
            title={element.title || "Question"}
            subheader={(isImport ? `${sourceSchema} -> ${sourceSubject}` : questionError?.error)}
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
                    {!isImport && <RadioGroup sx={{
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
                    }
                    {isImport && <Stack
                        display="flex"
                        flexDirection="column"
                        gap={1}
                    >
                        {element.choices.map((choice, index) => <label
                            key={index}
                        >
                            {element.correctAnswer === choice && "✔"} {choice}
                        </label>)}
                    </Stack>}
                </CardContent>}
                <CardActions sx={{ paddingTop: "16px" }}>
                    {!isImport && ["Edit", "Duplicate", "Delete"].map((value, index) =>
                    {
                        let buttonColor: ButtonOwnProps["color"] = undefined
                        let buttonIcon: string = ""
                        let onClickHandler: () => void = () => { }
                        switch (value)
                        {
                            case "Edit":
                                buttonColor = "primary"
                                buttonIcon = "Paint"
                                onClickHandler = EditQuestion
                                break
                            case "Duplicate":
                                buttonColor = "secondary"
                                buttonIcon = "Copy"
                                onClickHandler = DuplicateQuestion
                                break
                            case "Delete":
                                buttonColor = "error"
                                buttonIcon = "Close 2"
                                onClickHandler = DeleteQuestion
                                break
                        }
                        return <Button
                            key={index}
                            size="small"
                            color={buttonColor}
                            onClick={onClickHandler}
                            startIcon={<div className="aspect-square h-[12px] relative whiteOverlay">
                                <Image alt="" fill src={require(`@/public/images/${buttonIcon}.svg`)} />
                            </div>}
                            variant="contained"
                            sx={{ borderRadius: "100px", paddingX: "16px", paddingY: "4px" }}
                        >
                            {value}
                        </Button>
                    })}
                    {
                        isImport && ["Import", "Remove"].map((value, index) =>
                        {
                            let buttonColor: ButtonOwnProps["color"] = undefined
                            let buttonIcon: string = ""
                            let onClickHandler: () => void = () => { }
                            const imported = Object.keys(imports)
                            switch (value)
                            {
                                case "Import":
                                    if (imported.some(importId => importId === id)) return
                                    buttonColor = "primary"
                                    buttonIcon = "Check"
                                    onClickHandler = () =>
                                        setImports(prev =>
                                        {
                                            const updatedImports = { ...prev }
                                            const question = AddQuestion(GenerateRandomBytes())
                                            question.elements = elements
                                            setSchemaData(prevSchema =>
                                            {
                                                const updatedSchema = prevSchema
                                                updatedSchema.pages.push(question)
                                                return updatedSchema
                                            })
                                            updatedImports[id] = question
                                            return updatedImports
                                        })
                                    break
                                case "Remove":
                                    if (!imported.some(importId => importId === id)) return
                                    buttonColor = "error"
                                    buttonIcon = "Close 2"
                                    onClickHandler = () => setImports(prev =>
                                    {
                                        const updatedImports = { ...prev }
                                        setSchemaData(prevSchema =>
                                        {
                                            const updatedSchema = prevSchema
                                            updatedSchema.pages = updatedSchema.pages.filter(page => page.id !== updatedImports[id].id)
                                            return updatedSchema
                                        })
                                        delete updatedImports[id]
                                        return updatedImports
                                    })
                                    break
                            }
                            return <Button
                                key={index}
                                size="small"
                                color={buttonColor}
                                onClick={onClickHandler}
                                startIcon={<div className="aspect-square h-[12px] relative whiteOverlay">
                                    <Image alt="" fill src={require(`@/public/images/${buttonIcon}.svg`)} />
                                </div>}
                                variant="contained"
                                sx={{ borderRadius: "100px", paddingX: "16px", paddingY: "4px" }}
                            >
                                {value}
                            </Button>
                        })
                    }
                </CardActions>
            </CardContent>
        </Collapse>
    </Card>
}