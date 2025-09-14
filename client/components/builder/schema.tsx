import { Box, Card } from "@mui/material"
import SchemaHeader from "./schemaHeader"
import SchemaProperties from "./schemaProps"

export default function SchemaBuilder()
{
    return <Box className="pt-[16px] w-full" display="flex" flexDirection="column" gap="16px">
        <SchemaHeader />
        <SchemaProperties />
    </Box>
}