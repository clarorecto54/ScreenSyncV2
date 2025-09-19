import { Box } from "@mui/material"
import SchemaHeader from "./schemaHeader"
import { useSchema } from "../hooks/useSchema"
import SchemaPropBuilder from "./schemaProps"
import SchemaQuestionBuilder from "./questions"
import SchemaPreview from "./preview"

export default function SchemaBuilder()
{
    const { schemaData, previewMode, builderMode, builderPage } = useSchema()
    return <Box className="pt-[16px] w-full" display="flex" flexDirection="column" gap="16px" overflow="hidden" height="100%" px={"8px"}>
        <SchemaHeader />
        {(builderMode && builderPage === "Schema Properties") && <SchemaPropBuilder />}
        {(builderMode && builderPage === "Edit Question") && <SchemaQuestionBuilder index={schemaData.pages.length} />}
        {previewMode && <SchemaPreview />}
    </Box>
}