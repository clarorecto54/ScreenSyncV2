import { Box } from "@mui/material"
import SchemaHeader from "./schemaHeader"
import SchemaProperties from "./schemaProps"
import SchemaQuestions from "./questions"
import { useSchema } from "../hooks/useSchema"

export default function SchemaBuilder()
{
    const { schemaData } = useSchema()
    return <Box className="pt-[16px] w-full" display="flex" flexDirection="column" gap="16px" overflow="hidden" height="100%">
        <SchemaHeader />
        <Box display="flex" flexDirection="column" gap="16px" overflow="auto" height="100%" paddingX="8px">
            <SchemaProperties />
            {(schemaData.pages.length - 1) > 0 && schemaData.pages.slice(1).map((_, index) => <SchemaQuestions key={index} index={index + 1} />)}
        </Box>
    </Box>
}