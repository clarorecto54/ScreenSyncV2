"use client"
import SchemaBuilder from "./schema"
import SchemaList from "./schemaList"
import { useSchema } from "../hooks/useSchema"
import SchemaPreview from "./preview"

export default function ExamBuilder()
{
    const { schemaBuilder, previewMode } = useSchema()
    return <div className="
    h-[670px] w-[1600px] p-[32px] rounded-3xl bg-[#242424]
    flex justify-center items-center
    ">
        <div className={`
        h-full w-full max-w-[600px] rounded-[32px] p-[24px] bg-[hsl(0,0%,95%)]
        flex flex-col items-center gap-[16px]`} >
            {!schemaBuilder && !previewMode && <SchemaList />}
            {schemaBuilder && !previewMode && <SchemaBuilder />}
            {previewMode && <SchemaPreview />}
        </div>
    </div>
}