import { useExam } from "@/components/hooks/useExam";

export default function ExamDisplay()
{
    const { builderMode, setBuilderMode } = useExam()
    return <div className={`
    h-full w-full absolute backdrop-blur-md backdrop-brightness-50
    flex flex-col gap-[16px] justify-center align-middle
    ${!builderMode ? "opacity-0" : "opacity-100"}
    transition-[opacity] duration-1000`}>

    </div>
}