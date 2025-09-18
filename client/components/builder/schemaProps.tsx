import { CardContent, TextField, CardHeader, Card, Avatar, Box, IconButton, Collapse, Button } from "@mui/material";
import { useSchema } from "../hooks/useSchema";
import { ChangeEvent, useState } from "react";
import Image from "next/image";
import { HtmlElement, StandardQuestion } from "@/types/Exam.types";

export default function SchemaProperties()
{
    const { schemaData, setSchemaData, schemaErrors } = useSchema()
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
                    subheader={schemaErrors?.SchemaTitleError || schemaErrors?.SchemaTimeLimitError || schemaErrors?.SchemaStartingDisplayError}
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
                        },
                        subheader: {
                            color: schemaErrors?.SchemaTitleError || schemaErrors?.SchemaTimeLimitError || schemaErrors?.SchemaStartingDisplayError ? "error" : "textSecondary"
                        }
                    }}
                    sx={{ paddingBottom: 0 }}
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
                            error={schemaErrors && schemaErrors.SchemaTitleError !== ""}
                            helperText={schemaErrors?.SchemaTitleError ?? ""}
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
                            error={schemaErrors && schemaErrors.SchemaStartingDisplayError !== ""}
                            helperText={schemaErrors?.SchemaStartingDisplayError ?? ""}
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
                            error={schemaErrors && schemaErrors.SchemaTimeLimitError !== ""}
                            helperText={schemaErrors?.SchemaTimeLimitError ?? ""}
                            onChange={HandleTextField}
                            fullWidth
                            required
                            slotProps={{
                                htmlInput: { min: 30 }
                            }}
                        />
                    </CardContent>
                </form>
            </Collapse>
            <CardContent sx={{ paddingY: 0, paddingTop: !expanded ? "16px" : 0 }}>
                <Box>
                    <Button
                        disabled={schemaErrors !== undefined}
                        color="success"
                        variant="contained"
                        size="small"
                        sx={{ borderRadius: "100px", maxWidth: "fit-content" }}
                        onClick={() => setSchemaData(prev =>
                        {
                            const updatedPages = prev.pages
                            updatedPages.push({
                                elements: [{
                                    name: `Question ${updatedPages.length}`,
                                    question: "",
                                    type: "radiogroup",
                                    isRequired: true,
                                    correctAnswer: "",
                                    titleLocation: "top",
                                    choicesOrder: "random",
                                    choices: []
                                } satisfies StandardQuestion]
                            })
                            return { ...prev, pages: updatedPages }
                        })}>
                        Add Question
                    </Button>
                </Box>
            </CardContent>
        </Card>
    </Box>
}