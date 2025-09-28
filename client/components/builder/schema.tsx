import { Box, Button } from "@mui/material"
import SchemaHeader from "./schemaHeader"
import { useSchema } from "../hooks/useSchema"
import SchemaPropBuilder from "./schemaProps"
import SchemaQuestionBuilder from "./question"
import SchemaQuestionList from "./questionList"
import useCustomHooks from "@/components/utils/customHooks"
import { useGlobals } from "@/components/hooks/useGlobals"
import { Socket } from "socket.io-client"
import { ExamSocketMapping } from "@/types/Exam.types"

export default function SchemaBuilder()
{
    const { socket } = useGlobals()
    const { builderPage, setBuilderPage, schemaData } = useSchema()
    const { hasSchemaErrors, hasMissingfields } = useCustomHooks()
    return <Box className="pt-[8px] w-full" display="flex" flexDirection="column" gap="8px" overflow="hidden" height="100%" px={"8px"}>
        <SchemaHeader />
        {builderPage === "Schema Properties" && <SchemaPropBuilder />}
        {builderPage === "Questions" && <SchemaQuestionList />}
        {builderPage === "Edit Question" && <SchemaQuestionBuilder />}
        <Box display={"flex"} alignItems={"center"} justifyContent={"center"} paddingBottom={"4px"}>
            <Button
                disabled={hasSchemaErrors() || hasMissingfields()}
                color="success"
                variant="contained"
                size="medium"
                sx={{ borderRadius: "100px" }}
                onClick={() =>
                {
                    const mappedSocket: Socket<ExamSocketMapping> = socket
                    mappedSocket.emit("SaveSchema", schemaData)
                }}>
                Save Schema
            </Button>
        </Box>
    </Box>
}