import { Box, Button } from "@mui/material";
import { useSchema } from "../hooks/useSchema";
import AddQuestion from "../utils/generateQuestion";
import { useEffect, useState } from "react";
import { Element } from "@/types/Exam.types";
import SchemaQuestionPreview from "./questionPreview";

export default function SchemaQuestionList()
{
    const { schemaData, setBuilderPage, setSchemaData, schemaErrors } = useSchema()
    const [questionList, setQuestionList] = useState<Element[]>([])
    useEffect(() => setQuestionList(schemaData.pages.filter(page => page.elements.some(element => element.type === "radiogroup"))), [schemaData])
    return <Box height="100%" display="flex" gap="16px" flexDirection="column">
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
                    setSchemaData(prev =>
                    {
                        const updatedPages = prev.pages
                        updatedPages.push(AddQuestion(prev.pages.length))
                        return { ...prev, pages: updatedPages }
                    })
                    setBuilderPage("Edit Question")
                }}>
                Add Question
            </Button>
        </Box>}
        {schemaData.pages.length > 1 && questionList.map(({ elements }, index) => SchemaQuestionPreview(elements, index))}
    </Box>
}