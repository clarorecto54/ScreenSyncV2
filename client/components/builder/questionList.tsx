import { Box, Button, Stack } from "@mui/material";
import { useSchema } from "../hooks/useSchema";
import AddQuestion from "../utils/generateQuestion";
import { useEffect, useState } from "react";
import { Element } from "@/types/Exam.types";
import SchemaQuestionPreview from "./questionPreview";
import GenerateRandomBytes from "@/components/utils/randomBytes";

export default function SchemaQuestionList()
{
    const { schemaData, setSchemaData, setQuestionId, setBuilderPage } = useSchema()
    const [questionList, setQuestionList] = useState<Element[]>([])
    useEffect(() => setQuestionList(schemaData.pages.filter(page => page.elements.some(element => element.type === "radiogroup"))), [schemaData])
    return <Box height="100%" display="flex" gap="16px" flexDirection="column" overflow="auto">
        {schemaData.pages.length < 2 && <Box
            height="100%"
            display="flex"
            flexDirection="column"
            gap="8px"
            justifyContent="center"
            alignItems="center">
            No questions found on this schema
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
                {questionList.map(
                    ({ id, elements }, index) => <SchemaQuestionPreview key={index} id={id} elements={elements} index={index} />
                )}
            </Stack>
        </Box>}
    </Box>
}