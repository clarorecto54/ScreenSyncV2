import { Box, Button } from "@mui/material"
import SchemaHeader from "./schemaHeader"
import { useSchema } from "../hooks/useSchema"
import SchemaPropBuilder from "./schemaProps"
import SchemaQuestionBuilder from "./questions"
import SchemaPreview from "./preview"
import { StandardQuestion } from "@/types/Exam.types"

export default function SchemaBuilder()
{
    const { schemaData, setSchemaData, schemaErrors, previewMode, setPreviewMode, builderMode, builderPage } = useSchema()
    return <Box className="pt-[16px] w-full" display="flex" flexDirection="column" gap="8px" overflow="hidden" height="100%" px={"8px"}>
        <SchemaHeader />
        {(builderMode && builderPage === "Schema Properties") && <SchemaPropBuilder />}
        {(builderMode && builderPage === "Edit Question") && <SchemaQuestionBuilder index={schemaData.pages.length} />}
        {previewMode && <SchemaPreview />}
        <Box display={"flex"} alignItems={"center"} justifyContent={"space-around"}>
            <Button
                disabled={schemaErrors !== undefined}
                color="success"
                variant="outlined"
                size="small"
                sx={{ borderRadius: "100px" }}
                onClick={() => setSchemaData(prev =>
                {
                    const updatedPages = prev.pages
                    updatedPages.push({
                        elements: [{
                            name: `Question ${updatedPages.length}`,
                            title: "",
                            type: "radiogroup",
                            isRequired: true,
                            correctAnswer: "",
                            titleLocation: "top",
                            choicesOrder: "random",
                            choices: []
                        } satisfies StandardQuestion]
                    })
                    return { ...prev, pages: updatedPages }
                })}>
                Add Question
            </Button>
            <Button
                disabled={schemaErrors !== undefined}
                color="success"
                variant="outlined"
                size="small"
                sx={{ borderRadius: "100px" }}
                onClick={() => setPreviewMode(true)}>
                Preview Schema
            </Button>
            <Button
                disabled={schemaErrors !== undefined}
                color="success"
                variant="contained"
                size="small"
                sx={{ borderRadius: "100px" }}
                onClick={() => { }}>
                Save Schema
            </Button>
        </Box>
    </Box>
}