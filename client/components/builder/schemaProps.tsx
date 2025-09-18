import { CardContent, TextField, CardHeader, Card, Avatar, Box, IconButton, Collapse } from "@mui/material";
import { useSchema } from "../hooks/useSchema";
import { ChangeEvent, useState } from "react";
import Image from "next/image";
import { HtmlElement } from "@/types/Exam.types";

export default function SchemaProperties()
{
    const { schemaData, setSchemaData } = useSchema()
    const [expanded, setExpanded] = useState<boolean>(true)
    function HandleTextField(element: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)
    {
        const { name, value } = element.target
        setSchemaData(prev => ({ ...prev, [name]: name === "timeLimit" ? Number(value) : value }))
    }
    return <Box>
        <Card className="Unselectable" variant="elevation" elevation={2}>
            <Box onClick={() => setExpanded(!expanded)} sx={{ cursor: "pointer" }}>
                <CardHeader
                    className="transition-all duration-300"
                    title="Exam Properties"
                    avatar={<Avatar
                        sx={{
                            height: "24px", width: "24px", background: "none",
                        }}>
                        <Image
                            alt=""
                            src={require("@/public/images/Settings.svg")}
                        />
                    </Avatar>}
                    action={<IconButton onClick={() => setExpanded(!expanded)}>
                        <Image
                            src={require("@/public/images/Arrow.svg")}
                            alt="back"
                            className={`h-[16px] w-[16px] rotate-${expanded ? 180 : 0} transition-all duration-300`}
                        />
                    </IconButton>}
                    slotProps={{
                        title: {
                            fontFamily: "Montserrat, sans-serif",
                            fontSize: "12pt",
                            fontWeight: 500
                        }
                    }}
                    sx={{ paddingBottom: expanded ? 0 : "16px" }}
                />
            </Box>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <form autoComplete="off" onSubmit={(element) => element.preventDefault()}>
                    <CardContent className="flex flex-col gap-[16px] px-[16px]">
                        <TextField
                            variant="outlined"
                            size="small"
                            name="title"
                            label="Exam Name"
                            value={schemaData.title}
                            onChange={HandleTextField}
                            fullWidth
                            required
                            slotProps={{ htmlInput: { maxLength: 64 } }}
                        />
                        <TextField
                            variant="outlined"
                            size="small"
                            name="startSurveyText"
                            label="Survey Starting Text"
                            value={(schemaData.pages[0].elements[0] as HtmlElement).html}
                            onChange={(element) =>
                            {
                                setSchemaData(prev =>
                                {
                                    const updated = { ...prev }
                                    const startingDisplay = updated.pages[0].elements[0] as HtmlElement
                                    startingDisplay.html = element.target.value
                                    return updated
                                })
                            }}
                            fullWidth
                            required
                            slotProps={{ htmlInput: { maxLength: 128 } }}
                        />
                        <TextField
                            variant="outlined"
                            size="small"
                            name="timeLimit"
                            label="Time Limit of Exam (in seconds)"
                            type="number"
                            value={schemaData.timeLimit}
                            onChange={HandleTextField}
                            fullWidth
                            required
                        />
                    </CardContent>
                </form>
            </Collapse>
        </Card>
    </Box>
}