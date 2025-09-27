import { Button } from "@mui/material"
import { useExam } from "../hooks/useExam"
import { useSchema } from "../hooks/useSchema"

export default function SchemaList()
{
    const { schemaList } = useExam()
    const { builderMode, setBuilderMode } = useSchema()
    return <>
        <label className="font-[Montserrat] text-[16pt] font-[600] Unselectable"
        >Quiz Schema</label>
        <div className="w-full h-full text-[Montserrat]
    flex flex-col gap-[8px] items-center">
            {(schemaList.length === 0 && !builderMode) && "No quiz schema found. Create a new one?"}
            <Button color="success" variant="contained" sx={{ borderRadius: "100px" }}
                onClick={() => setBuilderMode(true)}>
                Create Schema
            </Button>
        </div>
    </>
}