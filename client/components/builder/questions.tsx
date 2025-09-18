import { Avatar, Box, Card, CardContent, CardHeader, Chip, Collapse, Divider, FormControl, IconButton, InputAdornment, InputLabel, List, MenuItem, Select, TextField } from "@mui/material";
import Image from "next/image";
import { useSchema } from "../hooks/useSchema";
import { StandardQuestion } from "@/types/Exam.types";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import ChoiceElement from "./choice";

export default function SchemaQuestions({ index }: { index: number })
{
    const { schemaData, setSchemaData } = useSchema()
    const [expanded, setExpanded] = useState<boolean>(true)
    const [questionData, setQuestionData] = useState<StandardQuestion>(schemaData.pages[index].elements[0] as StandardQuestion)
    const [choiceData, setChoiceData] = useState<string>("")
    const [choiceError, setChoiceError] = useState<string>("")
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
        if ((!questionData.choices.includes(questionData.correctAnswer) && questionData.choices.length > 0) ||
            questionData.choices.length <= 0 && questionData.correctAnswer !== "")
        {
            return setQuestionData(prev => ({ ...prev, correctAnswer: "" }))
        }
        setSchemaData(prev =>
        {
            const updatedPages = prev.pages
            const totalTime = prev.timeLimit
            updatedPages[index] = { elements: [questionData] }
            return { ...prev, timeLimitPerPage: totalTime / (updatedPages.length - 1), pages: updatedPages }
        })
    }, [questionData])
    return <Box
        display="flex"
        flexDirection="column"
        gap="16px">
        <Card className="Unselectable" variant="elevation" elevation={2}>
            <Box onClick={() => setExpanded(!expanded)} sx={{ cursor: "pointer" }}>
                <CardHeader
                    className="transition-all duration-300"
                    title={`Question ${index}`}
                    avatar={<Avatar
                        sx={{
                            height: "24px", width: "24px", background: "none",
                        }}>
                        <Image
                            alt=""
                            src={require("@/public/images/Question.svg")}
                        />
                    </Avatar>}
                    action={<IconButton onClick={() => setExpanded(!expanded)}>
                        <Image
                            src={require("@/public/images/Arrow.svg")}
                            alt="back"
                            className={`h-[16px] w-[16px] rotate-${expanded ? 180 : 0} transition-all duration-300`}
                        />
                    </IconButton>}
                    sx={{ paddingBottom: expanded ? 0 : "16px" }}
                />
            </Box>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent className="flex flex-col gap-[16px] px-[16px]">
                    <form autoComplete="off">
                        <TextField
                            variant="outlined"
                            size="small"
                            name="question"
                            label="What is the question?"
                            multiline
                            maxRows={3}
                            value={questionData.question}
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
                    <Divider>
                        <Chip label="CHOICES" variant="outlined" size="small" />
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
                    {questionData.choices.length > 0 && <List
                        dense
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            flex: "flex-shrink",
                            flexFlow:"column",
                            gap: 1,
                        }}
                    >
                        {questionData.choices.map((choice, index) =>
                        {
                            if (questionData.correctAnswer === "" && index === 0) setQuestionData(prev => ({ ...prev, correctAnswer: choice }))
                            return <ChoiceElement
                            key={index}
                            choice={choice}
                            index={index}
                            questionData={questionData}
                            setQuestionData={setQuestionData}
                        />
                        })}
                    </List>}
                </CardContent>
            </Collapse>
        </Card>
    </Box>
}