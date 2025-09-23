import { Box, Button } from "@mui/material"
import SchemaHeader from "./schemaHeader"
import { useSchema } from "../hooks/useSchema"
import SchemaPropBuilder from "./schemaProps"
import SchemaQuestionBuilder from "./question"
import SchemaQuestionList from "./questionList"

export default function SchemaBuilder()
{
    const { schemaErrors, builderPage } = useSchema()
    return <Box className="pt-[8px] w-full" display="flex" flexDirection="column" gap="8px" overflow="hidden" height="100%" px={"8px"}>
        <SchemaHeader />
        {builderPage === "Schema Properties" && <SchemaPropBuilder />}
        {builderPage === "Questions" && <SchemaQuestionList />}
        {builderPage === "Edit Question" && <SchemaQuestionBuilder />}
        <Box display={"flex"} alignItems={"center"} justifyContent={"center"} paddingBottom={"4px"}>
            <Button
                disabled={schemaErrors !== undefined}
                color="success"
                variant="contained"
                size="medium"
                sx={{ borderRadius: "100px" }}
                onClick={() => { }}>
                Save Schema
            </Button>
        </Box>
    </Box>
}