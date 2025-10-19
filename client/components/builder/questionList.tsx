import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useSchema } from "../hooks/useSchema";
import AddQuestion from "../utils/generateQuestion";
import { useEffect, useState } from "react";
import { Element, StandardQuestion } from "@/types/Exam.types";
import SchemaQuestionPreview from "./questionPreview";
import GenerateRandomBytes from "@/components/utils/randomBytes";

export default function SchemaQuestionList()
{
    const { schemaData, setSchemaData, setQuestionId, setBuilderPage } = useSchema()
    const [questionList, setQuestionList] = useState<Element[]>([])
    const [filteredList, setFilteredList] = useState<Element[]>([])
    const [filter, setFilter] = useState<string>("")
    useEffect(() => setQuestionList(schemaData.pages.filter(page => page.elements.some(element => element.type === "radiogroup"))), [schemaData])
    useEffect(() =>
    {
        if (!filter) return setFilteredList([])
        setFilteredList(questionList.filter(question =>
        {
            const words = filter.split(" ").filter(Boolean)
            const target = question.elements.find(element => element.type === "radiogroup")! as StandardQuestion
            const quest = target.title
            if (!quest) return false
            return words.every(word => quest.includes(word))
        }))
    }, [filter, questionList])
    return <Box height="100%" display="flex" gap="8px" flexDirection="column" overflow="auto">
        <form
            autoComplete="off"
            onSubmit={(element) => element.preventDefault()}
        >
            <TextField
                variant="filled"
                size="small"
                name="filter"
                label="Find question here..."
                value={filter}
                onChange={(element) => setFilter(element.target.value)}
                fullWidth
                slotProps={{ htmlInput: { maxLength: 256 } }}
            />
        </form>
        <Box height="100%" display="flex" gap="16px" flexDirection="column" overflow="auto">
            {schemaData.pages.length < 2 && <Box
                height="100%"
                display="flex"
                flexDirection="column"
                gap="8px"
                justifyContent="center"
                alignItems="center">
                <Typography color="textPrimary">
                    No questions found on this schema
                </Typography>
                <Button
                    sx={{ background: "#9333ea" }}
                    variant="contained"
                    size="small"
                    onClick={() =>
                    {
                        const questionId = GenerateRandomBytes()
                        setQuestionId(questionId)
                        setSchemaData(prev =>
                        {
                            const updatedPages = prev.pages
                            updatedPages.push(AddQuestion(questionId))
                            return { ...prev, pages: updatedPages }
                        })
                        setBuilderPage("Edit Question")
                    }}>
                    Add Question
                </Button>
            </Box>}
            {schemaData.pages.length > 1 && <Box display="flex">
                <Stack
                    height="100%"
                    width="100%"
                    padding={0.5}
                    spacing={2}
                >
                    {(filter ? filteredList : questionList).map(
                        ({ id, elements }, index) => <SchemaQuestionPreview key={id} id={id} elements={elements} index={index} />
                    )}
                </Stack>
            </Box>}
        </Box>
    </Box>
}