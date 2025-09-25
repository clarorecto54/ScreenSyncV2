import { Avatar, Box, Button, Card, CardContent, CardHeader, Chip, Divider, FormControl, InputAdornment, InputLabel, List, MenuItem, Select, Stack, TextField, Tooltip, Typography } from "@mui/material";
import Image from "next/image";
import { useSchema } from "../hooks/useSchema";
import { ImageQuestion, Question, StandardQuestion } from "@/types/Exam.types";
import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import ChoiceElement from "./choice";
import { QuestionErrors } from "@/types/Schema.types";
import useCustomHooks from "@/components/utils/customHooks";

export default function SchemaQuestionBuilder()
{
    const { schemaData, setSchemaData, questionId } = useSchema()
    const imgPicker = useRef<HTMLInputElement>(null)
    const [imgBlob, setImgBlob] = useState<string>("")
    const [imgRatio, setImgRatio] = useState<number>(1)
    const { UpdateQuestionErrorMessage } = useCustomHooks()
    const [imageElement, setImageElement] = useState<ImageQuestion>()
    const [questionData, setQuestionData] = useState<StandardQuestion>(
        schemaData.pages.find(page => page.id === questionId)!
            .elements.find(element => element.type === "radiogroup")! as StandardQuestion
    )
    const [choiceData, setChoiceData] = useState<string>("")
    const [choiceError, setChoiceError] = useState<string>("")
    const [questionError, setQuestionError] = useState<QuestionErrors>({
        id: questionId,
        name: questionData.name,
        error: "",
        fieldErrors: []
    })
    function HandleTextFieldChange(element: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) 
    {
        const thisElement = element.target
        setQuestionData(prev => ({ ...prev, [thisElement.name]: thisElement.value }))
    }
    function HandleAddChoice(element: FormEvent)
    {
        if (choiceData.length <= 0) return;
        element.preventDefault()
        setQuestionData(prev => ({ ...prev, choices: [...prev.choices, choiceData] }))
        setChoiceData("")
    }
    useEffect(() =>
    {
        setQuestionError(UpdateQuestionErrorMessage(questionData, questionError))
        if ((!questionData.choices.includes(questionData.correctAnswer) && questionData.choices.length > 0) ||
            questionData.choices.length <= 0 && questionData.correctAnswer !== "")
        {
            return setQuestionData(prev => ({ ...prev, correctAnswer: "" }))
        }
        setSchemaData(prev =>
        {
            const totalTime = prev.timeLimit
            const updatedData = prev.pages.map(page =>
            {
                if (page.id !== questionId) return page
                const dataIndex = page.elements.findIndex(element => element.type === "radiogroup")
                const updatedElements = [...page.elements]
                updatedElements[dataIndex] = questionData
                let finalElements: Question[] = updatedElements.filter(element => element.type !== "image")
                if (imageElement) finalElements = [imageElement, ...finalElements]
                return { ...page, elements: finalElements }
            })
            return { ...prev, timeLimitPerPage: totalTime / (updatedData.length - 1), pages: updatedData }
        })
    }, [questionData, imageElement])
    useEffect(() =>
    {
        if (questionData.correctAnswer === "" && questionData.choices.length > 0)
            setQuestionData(prev => ({ ...prev, correctAnswer: prev.choices[0] }))
    }, [questionData.correctAnswer, questionData.choices])
    useEffect(() =>
    {
        if (!imgBlob) return
        const img = document.createElement("img")
        img.src = imgBlob
        img.onload = () => setImgRatio(img.naturalWidth / img.naturalHeight)
        img.remove()
    }, [imgBlob])
    return <Box
        display="flex"
        flexDirection="column"
        gap="16px"
        padding="8px"
        height="100%"
        overflow="hidden">
        <Card className="h-full Unselectable flex flex-col" variant="elevation" elevation={2} sx={{ overflow: "hidden" }}>
            <Box >
                <CardHeader
                    className="transition-all duration-300"
                    title={questionData.name}
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
                    sx={{ paddingBottom: 0 }}
                />
            </Box>
            <Box height="100%" sx={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <CardContent className="flex flex-col gap-[16px] px-[16px]">
                    <form autoComplete="off">
                        <TextField
                            variant="outlined"
                            size="small"
                            name="title"
                            label="What is the question?"
                            multiline
                            maxRows={3}
                            error={questionError.fieldErrors && questionError.fieldErrors.find(({ fieldName }) => fieldName === "title") ? questionError.fieldErrors.find(({ fieldName }) => fieldName === "title")!.fieldError !== "" : false}
                            helperText={questionError.fieldErrors.find(({ fieldName }) => fieldName === "title")?.fieldError ?? ""}
                            value={questionData.title}
                            onChange={HandleTextFieldChange}
                            fullWidth
                            required
                            slotProps={{ htmlInput: { maxLength: 256 } }}
                        />
                    </form>
                    <Box display="flex" flexDirection="row" gap="16px">
                        <FormControl size="small" fullWidth>
                            <InputLabel id="sortChoicesLabel">Sort Choices by</InputLabel>
                            <Select<StandardQuestion["choicesOrder"]>
                                labelId="sortChoicesLabel"
                                label="Sort Choices by"
                                value={questionData.choicesOrder}
                                onChange={(element) => setQuestionData(prev => ({ ...prev, choicesOrder: element.target.value }))}
                            >
                                {(["asc", "desc", "none", "random"] as StandardQuestion["choicesOrder"][]).map(
                                    (value, index) => <MenuItem key={index} value={value}>{value.toUpperCase()}</MenuItem>
                                )}
                            </Select>
                        </FormControl>
                        <FormControl size="small" fullWidth>
                            <InputLabel id="isRequiredLabel">This question is required?</InputLabel>
                            <Select
                                labelId="isRequiredLabel"
                                label="This question is required?"
                                value={questionData.isRequired ? "true" : "false"}
                                onChange={(element) => setQuestionData(prev => ({ ...prev, isRequired: element.target.value === "true" }))}
                            >
                                <MenuItem key={0} value="true">TRUE</MenuItem>
                                <MenuItem key={1} value="false">FALSE</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Stack display="flex" direction="row" justifyContent="center" alignItems="center" gap={2}>
                        <Button
                            variant="contained"
                            size="small"
                            color="primary"
                            onClick={() =>
                            {
                                if (imgPicker !== undefined || imgPicker !== null)
                                    imgPicker.current!.click()
                            }}
                            startIcon={<div className="aspect-square relative h-[16px] whiteOverlay">
                                <Image alt="" fill src={require("@/public/images/Upload.svg")} />
                            </div>}
                            sx={{ minWidth: "max-content" }}
                        >
                            <input ref={imgPicker} hidden type="file" accept="image/*" onChange={(element) =>
                            {
                                const img = element.target.files
                                if (!img || img.length < 1) return
                                const reader = new FileReader()
                                reader.onloadend = () =>
                                {
                                    const blob = reader.result! as string
                                    setImageElement({
                                        type: "image",
                                        name: "ImagePanel",
                                        imageLink: blob,
                                        imageHeight: 320,
                                        imageWidth: "auto",
                                        imageFit: "contain"
                                    })
                                    setImgBlob(blob)
                                }
                                reader.readAsDataURL(img[0])
                            }} />
                            Upload
                        </Button>
                        {imgBlob && <Tooltip placement="top"
                            title={<div className="relative h-[240px] p-[16px] overflow-hidden" style={{ aspectRatio: imgRatio }}>
                                <Image alt="" fill src={imgBlob} />
                            </div>}
                            slotProps={{
                                tooltip: {
                                    sx: {
                                        aspectRatio: imgRatio,
                                        padding: "8px",
                                        maxWidth: "none"
                                    }
                                }
                            }}
                        >
                            <Chip
                                label="Preview"
                                size="small"
                                icon={<div className="aspect-square relative h-[12px]">
                                    <Image alt="" fill src={require("@/public/images/Search.svg")} />
                                </div>}
                                sx={{ paddingX: "8px", cursor: "help" }}
                            />
                        </Tooltip>}
                        {imgBlob && <Button
                            variant="contained"
                            size="small"
                            color="error"
                            onClick={() =>
                            {
                                if (imgPicker)
                                    imgPicker.current!.value = ""
                                setImageElement(undefined)
                                setImgBlob("")
                            }}
                            startIcon={<div className="aspect-square relative h-[12px] whiteOverlay">
                                <Image alt="" fill src={require("@/public/images/Close 2.svg")} />
                            </div>}
                            sx={{ minWidth: "max-content" }}
                        >
                            Remove
                        </Button>}
                    </Stack>
                    <Divider>
                        CHOICES
                    </Divider>
                    <form autoComplete="off" onSubmit={HandleAddChoice}>
                        <TextField
                            variant="outlined"
                            size="small"
                            name="choiceGenerator"
                            label="Type your choice/s here"
                            value={choiceData}
                            onChange={(element) =>
                            {
                                const thisElement = element.target
                                if (questionData.choices.includes(thisElement.value)) setChoiceError("The choice is already existing")
                                else setChoiceError("")
                                setChoiceData(element.target.value)
                            }}
                            fullWidth
                            multiline
                            maxRows={3}
                            error={choiceError !== "" ? true : false}
                            helperText={choiceError !== "" ? choiceError : ""}
                            slotProps={{
                                htmlInput: { maxLength: 128 },
                                input: {
                                    endAdornment: (choiceData.length > 0 && choiceError === "") && <InputAdornment position="end">
                                        <Chip label="Add Choice" type="submit" component="button" onClick={() => { }} />
                                    </InputAdornment>
                                }
                            }}
                        />
                    </form>
                </CardContent>
                <CardContent sx={{ height: "100%", paddingTop: 0, display: "flex", overflow: "hidden" }}>
                    {questionData.choices.length > 0 && <List
                        dense
                        sx={{
                            height: "100%",
                            width: "100%",
                            overflowY: "auto",
                            display: "flex",
                            flexWrap: "wrap",
                            flex: "flex-shrink",
                            flexFlow: "column",
                            gap: 1,
                        }}
                    >
                        {questionData.choices.map((choice, index) =>
                            <ChoiceElement
                                key={index}
                                choice={choice}
                                index={index}
                                questionData={questionData}
                                setQuestionData={setQuestionData}
                            />
                        )}
                    </List>}
                </CardContent>
            </Box>
        </Card>
    </Box>
}