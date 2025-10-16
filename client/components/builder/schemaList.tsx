import { Box, Button, Stack, TextField, Typography } from "@mui/material"
import { useExam } from "../hooks/useExam"
import { useSchema } from "../hooks/useSchema"
import SchemaHeader from "@/components/builder/schemaHeader"
import GenerateBaseSchema from "@/components/utils/generateBaseSchema"
import GenerateSchemaErrorList from "@/components/utils/generateSchemaErrorList"
import SchemaCard from "@/components/builder/schemaCard"
import { useEffect, useState } from "react"
import { ExamProp } from "@/types/Exam.types"

export default function SchemaList()
{
    const { schemaList } = useExam()
    const { builderMode, setBuilderMode, setBuilderPage, setSchemaData, setSchemaErrors } = useSchema()
    const [filteredList, setFilteredList] = useState<ExamProp[]>([])
    const [filter, setFilter] = useState<string>("")
    useEffect(() =>
    {
        if (!filter) return setFilteredList([])
        setFilteredList(schemaList.filter(schema =>
        {
            const words = filter.split(" ").filter(Boolean)
            const target = schema.title.toLowerCase()
            if (!target) return false
            return words.every(word => target.includes(word.toLowerCase()))
        }))
    }, [filter, schemaList])
    return <>
        <SchemaHeader />
        <form
            autoComplete="off"
            onSubmit={(element) => element.preventDefault()}
        >
            <TextField
                variant="filled"
                size="small"
                name="filter"
                label="Find schema here..."
                value={filter}
                onChange={(element) => setFilter(element.target.value)}
                fullWidth
                slotProps={{ htmlInput: { maxLength: 256 } }}
            />
        </form>
        <Box
            width="100%"
            height="100%"
            display="flex"
            flexDirection="column"
            gap="8px"
            alignItems="center"
            overflow="hidden"
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
            {schemaList.length > 0 && <Box height="100%" width="100%" sx={{ overflowY: "scroll" }}>
                <Box display="flex">
                    <Stack
                        height="100%"
                        width="100%"
                        padding={0.5}
                        spacing={2}
                    >
                        {(filter ? filteredList : schemaList).map(
                            ({ createdOn, lock, id, title, description, password, pages, timeLimit }, index) =>
                                <SchemaCard
                                    createdOn={createdOn}
                                    key={id}
                                    lock={lock}
                                    id={id}
                                    title={title}
                                    description={description}
                                    password={password}
                                    questions={pages.length - 1}
                                    timeLimit={timeLimit}
                                />
                        )}
                    </Stack>
                </Box>
            </Box>}
        </Box>
    </>
}