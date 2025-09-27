import { Box, Button, Typography } from "@mui/material"
import { useExam } from "../hooks/useExam"
import { useSchema } from "../hooks/useSchema"
import SchemaHeader from "@/components/builder/schemaHeader"

export default function SchemaList()
{
    const { schemaList } = useExam()
    const { builderMode, setBuilderMode, setBuilderPage } = useSchema()
    return <>
        <SchemaHeader />
        <Box
            width="100%"
            height="100%"
            display="flex"
            flexDirection="column"
            gap="8px"
            alignItems="center"
            justifyContent="center"
        >
            {(schemaList.length === 0 && !builderMode) && <Typography color="textPrimary">
                No quiz schema found. Create a new one?
            </Typography>}
            <Button color="success" variant="contained" sx={{ borderRadius: "100px" }}
                onClick={() =>
                {
                    setBuilderPage("Schema Properties")
                    setBuilderMode(true)
                }}>
                Create Schema
            </Button>
        </Box>
    </>
}