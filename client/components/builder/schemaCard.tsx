import { SchemaCardType } from "@/types/Schema.types";
import { Button, Card, CardActions, CardContent, CardHeader, Chip, Collapse, InputAdornment, Stack, TextField } from "@mui/material";
import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { useSchema } from "@/components/hooks/useSchema";
import { useExam } from "@/components/hooks/useExam";
import GenerateSchemaErrorList from "@/components/utils/generateSchemaErrorList";
import { ExamProp, ExamSocketMapping } from "@/types/Exam.types";
import { useGlobals } from "@/components/hooks/useGlobals";
import { Socket } from "socket.io-client";
import HashData from "@/components/utils/crypto";

const SchemaCard: SchemaCardType = ({ createdOn, lock, id, title, description, password, questions, timeLimit }) =>
{
    const { socket } = useGlobals()
    const { schemaList } = useExam()
    const { setBuilderMode, setBuilderPage, setSchemaErrors, setSchemaData } = useSchema()
    const [unlock, setUnlock] = useState<boolean>(false)
    const [key, setKey] = useState<string>("")
    const [wrongKey, setWrongKey] = useState<boolean>(false)
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
    const HandleSubmit = (element: FormEvent<HTMLFormElement>) =>
    {
        element.preventDefault()
        if (!(HashData(key) === password)) return setWrongKey(true)
        setKey("")
        setWrongKey(false)
        setUnlock(false)
        EditSchema()
    }
    return <Card
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        sx={{ display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}
    >
        {unlock && <div className={`
            h-full w-full absolute z-[99] backdrop-blur-md backdrop-brightness-75
            flex gap-[16px] justify-center items-center rounded-[4px]
            ${unlock ? "opacity-100" : "opacity-0"}
            transition-[opacity] duration-1000
            `}>
            <Stack display="flex" flexDirection="row" gap={1} justifyContent="center" alignItems="center" sx={{ background: "white", padding: "12px", borderRadius: "8px" }}>
                <form autoComplete="off" onSubmit={HandleSubmit}>
                    <TextField
                        variant="outlined"
                        size="small"
                        name="unlock"
                        label="Type the key here"
                        value={key}
                        onChange={(element) =>
                        {
                            const thisElement = element.target
                            setKey(thisElement.value)
                        }}
                        error={wrongKey}
                        slotProps={{
                            htmlInput: { maxLength: 128 },
                            input: {
                                endAdornment: key.length > 3 && <InputAdornment position="end" sx={{ cursor: "pointer" }}>
                                    <button className="aspect-square h-[16px] relative" type="submit">
                                        <Image alt="" fill src={require("@/public/images/Key.svg")} />
                                    </button>
                                </InputAdornment>
                            }
                        }}
                    />
                </form>
                <Button
                    size="small"
                    variant="contained"
                    color="error"
                    onClick={() =>
                    {
                        setKey("")
                        setWrongKey(false)
                        setUnlock(false)
                    }}
                    sx={{ maxHeight: "fit-content" }}
                >
                    Cancel
                </Button>
            </Stack>
        </div>}
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
                paddingBottom: hover || unlock ? 0 : "16px",
                cursor: "pointer"
            }}
        />
        <Collapse in={hover || unlock} timeout="auto" unmountOnExit>
            <CardContent
                sx={{ paddingY: 0 }}
                style={{ paddingTop: 0, paddingBottom: "8px" }}
            >
                <Collapse in={hover} timeout="auto" unmountOnExit sx={{ paddingY: "4px" }}>
                    <Stack className="Unselectable" flexDirection="row" gap={1} >
                        <Chip
                            className="bg-lime-800"
                            size="small"
                            label={new Date(createdOn).toLocaleString()}
                            sx={{
                                padding: "4px",
                                background: "#3f6212",
                                color: "white"
                            }}
                        />
                        <Chip
                            className="bg-gray-200"
                            size="small"
                            label={`${questions} Question`}
                            sx={{
                                padding: "4px",
                                background: "#4b5563",
                                color: "white"
                            }}
                        />
                        <Chip
                            className="bg-orange-600"
                            size="small"
                            label={`${timeLimit}s Time`}
                            sx={{
                                padding: "4px",
                                background: "#ea580c",
                                color: "white"
                            }}
                        />
                    </Stack>
                </Collapse>
                <CardActions sx={{ paddingTop: "8px", paddingX: 0 }}>
                    {(["Edit", "Delete"] as ("Edit" | "Delete")[]).map((value, index) => <Button
                        key={index}
                        size="small"
                        color={value === "Edit" ? "primary" : "error"}
                        onClick={() =>
                        {
                            switch (value)
                            {
                                case "Edit":
                                    if (lock)
                                        return setUnlock(true)
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