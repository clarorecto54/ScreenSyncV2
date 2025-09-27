import { Box, Button, Stack, Typography } from "@mui/material"
import { useExam } from "../hooks/useExam"
import { useSchema } from "../hooks/useSchema"
import SchemaHeader from "@/components/builder/schemaHeader"
import GenerateBaseSchema from "@/components/utils/generateBaseSchema"
import GenerateSchemaErrorList from "@/components/utils/generateSchemaErrorList"
import SchemaCard from "@/components/builder/schemaCard"

export default function SchemaList()
{
    const { schemaList } = useExam()
    const { builderMode, setBuilderMode, setBuilderPage, setSchemaData, setSchemaErrors } = useSchema()
    return <>
        <SchemaHeader />
        <Box
            width="100%"
            height="100%"
            display="flex"
            flexDirection="column"
            gap="8px"
            alignItems="center"
            justifyContent={schemaList.length > 0 ? "start" : "center"}
        >
            {(schemaList.length === 0 && !builderMode) && <Typography color="textPrimary">
                No quiz schema found. Create a new one?
            </Typography>}
            {(schemaList.length === 0 && !builderMode) && <Button color="success" variant="contained" sx={{ borderRadius: "100px" }}
                onClick={() =>
                {
                    setBuilderPage("Schema Properties")
                    setBuilderMode(true)
                    setSchemaErrors(GenerateSchemaErrorList())
                    setSchemaData(GenerateBaseSchema())
                }}>
                Create Schema
            </Button>}
            {schemaList.length > 0 && <Box height="100%" width="100%" display="flex">
                <Stack
                    height="100%"
                    width="100%"
                    padding={0.5}
                    spacing={2}
                >
                    {schemaList.map(
                        ({ id, lock, title, description, password }, index) =>
                            <SchemaCard
                                key={index}
                                lock={lock}
                                id={id}
                                title={title}
                                description={description}
                                password={password}
                            />
                    )}
                </Stack>
            </Box>}
        </Box>
    </>
}