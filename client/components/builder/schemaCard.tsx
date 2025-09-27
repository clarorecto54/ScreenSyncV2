import { SchemaCardType } from "@/types/Schema.types";
import { Button, Card, CardActions, CardContent, CardHeader, Collapse, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useSchema } from "@/components/hooks/useSchema";
import { useExam } from "@/components/hooks/useExam";
import GenerateSchemaErrorList from "@/components/utils/generateSchemaErrorList";
import { ExamProp, ExamSocketMapping } from "@/types/Exam.types";
import { useGlobals } from "@/components/hooks/useGlobals";
import { Socket } from "socket.io-client";

const SchemaCard: SchemaCardType = ({ lock, id, title, description, password }) =>
{
    const { socket } = useGlobals()
    const { schemaList } = useExam()
    const { setBuilderMode, setBuilderPage, setSchemaErrors, setSchemaData } = useSchema()
    const [schema, setSchema] = useState<ExamProp>({} as ExamProp)
    const [hover, setHover] = useState<boolean>(false)
    useEffect(() => setSchema(schemaList.find(schema => schema.id === id)! as ExamProp), [schemaList])
    const EditSchema = () =>
    {
        setBuilderMode(true)
        setBuilderPage("Schema Properties")
        setSchemaErrors(GenerateSchemaErrorList())
        setSchemaData(schema)
    }
    const DeleteSchema = () =>
    {
        const mappedSocket: Socket<ExamSocketMapping> = socket
        mappedSocket.emit("DeleteSchema", schema)
    }
    return <Card
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        sx={{ display: "flex", flexDirection: "column" }}
    >
        <CardHeader
            className="transition-all duration-300"
            title={<Stack flexDirection="row" gap={1} alignItems="center" >
                {lock && <div className="relative aspect-square h-[14px] flex">
                    <Image alt="" fill src={require("@/public/images/Lock.svg")} />
                </div>}
                {title}
            </Stack>}
            subheader={description}
            slotProps={{
                title: {
                    noWrap: false,
                    style: { whiteSpace: "normal", wordBreak: "break-word" }
                },
                subheader: {
                    fontSize: "10pt"
                }
            }}
            sx={{
                paddingBottom: hover ? 0 : "16px",
                cursor: "pointer"
            }}
        />
        <Collapse in={hover} timeout="auto" unmountOnExit>
            <CardContent
                sx={{ paddingY: 0 }}
                style={{ paddingTop: 0, paddingBottom: "8px" }}
            >
                <CardActions sx={{ paddingTop: "8px" }}>
                    {(["Edit", "Delete"] as ("Edit" | "Delete")[]).map((value, index) => <Button
                        key={index}
                        size="small"
                        color={value === "Edit" ? "primary" : "error"}
                        onClick={() =>
                        {
                            switch (value)
                            {
                                case "Edit":
                                    return EditSchema()
                                case "Delete":
                                    return DeleteSchema()
                                default:
                                    break
                            }
                        }}
                        startIcon={<div className="aspect-square h-[12px] relative whiteOverlay">
                            <Image alt="" fill src={require(`@/public/images/${value === "Edit" ? "Paint" : "Close 2"}.svg`)} />
                        </div>}
                        variant="contained"
                        sx={{ borderRadius: "100px", paddingX: "16px", paddingY: "4px" }}
                    >
                        {value}
                    </Button>)}
                </CardActions>
            </CardContent>

        </Collapse>
    </Card>
}

export default SchemaCard