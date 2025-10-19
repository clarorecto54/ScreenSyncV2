import SchemaQuestionPreview from "@/components/builder/questionPreview"
import { useExam } from "@/components/hooks/useExam"
import { useSchema } from "@/components/hooks/useSchema"
import { Element, StandardQuestion } from "@/types/Exam.types"
import { Box, TextField, Typography, Button, Stack } from "@mui/material"
import { useEffect, useState } from "react"

export default function SchemaImporter({ confirmation = false }: { confirmation?: boolean })
{
    const { schemaList } = useExam()
    const { schemaData, imports } = useSchema()
    const [questionList, setQuestionList] = useState<Element[]>([])
    const [filteredList, setFilteredList] = useState<Element[]>([])
    const [filter, setFilter] = useState<string>("")
    const GetAllQuestions = () =>
    {
        if (confirmation) return
        let allQuestions: Element[] = []
        schemaList.forEach(schema =>
        {
            if (schema.id === schemaData.id) return
            allQuestions = allQuestions.concat(schema.pages.slice(1))
        })
        setQuestionList(allQuestions)
    }
    const ImportQuestions = () =>
    {
        if (!confirmation) return
        const importedIds: string[] = Object.keys(imports)
        let allQuestions: Element[] = []
        schemaList.forEach(schema =>
        {
            const importedQuestion = schema.pages.find(page => importedIds.includes(page.id))
            if (importedQuestion) allQuestions.push(importedQuestion)
        })
        setQuestionList(allQuestions)
    }
    useEffect(() =>
    {
        GetAllQuestions()
    }, [])
    useEffect(() => ImportQuestions(), [imports])
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
            {(filter ? filteredList : questionList).length < 1 && <Box
                height="100%"
                display="flex"
                flexDirection="column"
                gap="8px"
                justifyContent="center"
                alignItems="center">
                <Typography color="textPrimary">
                    No specific question has been found
                </Typography>
            </Box>}
            {(filter ? filteredList : questionList).length > 0 && <Box display="flex">
                <Stack
                    height="100%"
                    width="100%"
                    padding={0.5}
                    spacing={2}
                >
                    {(filter ? filteredList : questionList).map(
                        ({ id, elements }, index) => <SchemaQuestionPreview key={id} id={id} elements={elements} index={index} isImport />
                    )}
                </Stack>
            </Box>}
        </Box>
    </Box>
}