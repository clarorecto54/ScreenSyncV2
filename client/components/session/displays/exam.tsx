import { useExam } from "@/components/hooks/useExam";

export default function ExamDisplay()
{
    const { builderMode, setBuilderMode } = useExam()
    return <div className={`
    h-full w-full p-[32px] absolute backdrop-blur-md backdrop-brightness-50
    flex flex-col gap-[16px] justify-center items-center
    ${!builderMode ? "opacity-0" : "opacity-100"}
    transition-[opacity] duration-1000`}>
        <div className={`
            h-full w-full max-w-[600px] rounded-[32px] p-[16px] bg-[hsl(0,0%,95%)]`} >
            <label className="text-black"
            >Exam Templates</label>
        </div>
    </div>
}