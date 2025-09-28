import ExamBuilder from "@/components/builder/builder";
import { useExam } from "@/components/hooks/useExam";
import { SchemaContextProvider } from "@/components/hooks/useSchema";
import { Box } from "@mui/material";

export default function ExamDisplay()
{
    const { builderMode } = useExam()
    return <Box className={`
    h-full w-full p-[32px] absolute backdrop-blur-md backdrop-brightness-50
    flex gap-[16px] justify-center items-center
    ${builderMode ? "opacity-100" : "opacity-0"}
    transition-[opacity] duration-1000`}>
        <SchemaContextProvider>
            <ExamBuilder />
        </SchemaContextProvider>
    </Box>
}