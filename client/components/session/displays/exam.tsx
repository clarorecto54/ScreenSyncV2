import ExamBuilder from "@/components/builder/builder";
import SchemaConsumer from "@/components/builder/schemaConsumer";
import { useExam } from "@/components/hooks/useExam";
import { SchemaContextProvider } from "@/components/hooks/useSchema";
import { Box } from "@mui/material";

export default function ExamDisplay()
{
    const { builderMode, consumerMode } = useExam()
    return <Box className={`
    h-full w-full p-[32px] absolute backdrop-blur-md backdrop-brightness-50
    flex gap-[16px] justify-center items-center
    ${builderMode || consumerMode ? "opacity-100" : "opacity-0"}
    transition-[opacity] duration-1000`}>
        <SchemaContextProvider>
            {builderMode && <ExamBuilder />}
            {consumerMode && <SchemaConsumer />}
        </SchemaContextProvider>
    </Box>
}