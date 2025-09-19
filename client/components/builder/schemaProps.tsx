import { TextField, CardHeader, Card, Avatar, Box, FormGroup, FormControlLabel, Switch } from "@mui/material";
import { useSchema } from "../hooks/useSchema";
import { ChangeEvent } from "react";
import Image from "next/image";
import { ExamProp, HtmlElement } from "@/types/Exam.types";
import { SchemaValidableKeys } from "@/types/Schema.types";
import HashData from "../utils/crypto";

export default function SchemaPropBuilder()
{
    const { schemaData, setSchemaData, schemaErrors, schemaKey, setschemaKey } = useSchema()
    const HandleSwitch = ({ target }: ChangeEvent<HTMLInputElement>) =>
        setSchemaData(prev =>
        {
            const key = target.name as "showTimer" | "showProgressBar" | "showPreviewBeforeComplete" | "questionOrder"
            const value = target.checked
            return { ...prev, [key]: key !== "questionOrder" ? value : value ? "random" : "initial" }
        })
    function HandleTextField(element: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)
    {
        const { name, value } = element.target
        const key = name as keyof ExamProp
        const transformValue = () =>
        {
            switch (key)
            {
                case "timeLimitPerPage":
                    return Number(value)
                case "password":
                    setschemaKey(value)
                    const final = value.length < 4 ? "" : HashData(value)
                    return final
                default:
                    return value
            }
        }
        setSchemaData(prev => ({
            ...prev,
            [key]: transformValue()
        }))
    }
    return <Box height="100%" padding="8px" paddingTop={0} overflow={"hidden"}>
        <Card className="h-full flex flex-col Unselectable" variant="elevation" elevation={2}>
            <Box>
                <CardHeader
                    className="transition-all duration-300"
                    title="Properties"
                    subheader={
                        (Object.keys(schemaErrors ?? {}) as SchemaValidableKeys[])
                            .map(key => schemaErrors?.[key])
                            .find(errorMsg => !!errorMsg)
                    }
                    avatar={<Avatar
                        sx={{
                            height: "24px", width: "24px", background: "none",
                        }}>
                        <Image
                            alt=""
                            src={require("@/public/images/Settings.svg")}
                        />
                    </Avatar>}
                    action={<FormControlLabel
                        label="Lock"
                        labelPlacement="top"
                        control={<Switch
                            size="small"
                            name="lock"
                            onChange={HandleSwitch}
                            checked={schemaData.lock} />}
                        slotProps={{ typography: { fontSize: "10pt" } }} />}
                    slotProps={{
                        title: {
                            fontFamily: "Montserrat, sans-serif",
                            fontSize: "12pt",
                            fontWeight: 500
                        },
                        subheader: {
                            color: (Object.keys(schemaErrors ?? {}) as SchemaValidableKeys[])
                                .map(key => schemaErrors?.[key])
                                .find(errorMsg => !!errorMsg) ? "error" : "textSecondary"
                        }
                    }}
                    sx={{ paddingBottom: "8px" }}
                />
            </Box>
            <Box sx={{ overflowY: "auto" }}>
                <form
                    autoComplete="off"
                    className="p-[16px] flex flex-col gap-[16px]"
                    onSubmit={(element) => element.preventDefault()}>
                    {(["password", "title", "description"] as Array<"title" | "description" | "password">)
                        .filter(key => !(!schemaData.lock && key === "password")).map((key) => (
                            <TextField
                                key={key}
                                variant="outlined"
                                size="small"
                                name={key}
                                type={schemaData.lock ? "password" : "text"}
                                label={{ title: "Name", description: "Subject", password: "Lock Key" }[key]}
                                value={key !== "password" ? schemaData[key] : schemaKey}
                                onChange={HandleTextField}
                                error={!!schemaErrors?.[key]}
                                helperText={schemaErrors?.[key]}
                                fullWidth
                                required
                                slotProps={{ htmlInput: { maxLength: 64 } }}
                            />
                        ))}
                    <TextField
                        variant="outlined"
                        size="small"
                        name="startSurveyText"
                        label="Starting Message"
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
                    <FormGroup row sx={{ gap: 2 }}>
                        {(["timeLimitPerPage", "timeLimit"] as Array<"timeLimitPerPage" | "timeLimit">).map(key => <TextField
                            key={key}
                            sx={{ flex: 1 }}
                            disabled={key === "timeLimit"}
                            fullWidth
                            variant="outlined"
                            size="small"
                            name={key}
                            label={{
                                timeLimit: "Time for each questions (in seconds)",
                                timeLimitPerPage: "Total Time Limit (in seconds)"
                            }[key]}
                            type="number"
                            value={schemaData[key]}
                            error={key === "timeLimitPerPage" && !!schemaErrors?.timeLimitPerPage}
                            helperText={key === "timeLimitPerPage" && schemaErrors?.timeLimitPerPage}
                            onChange={HandleTextField}
                            required
                            slotProps={{
                                htmlInput: { min: 10 }
                            }}
                        />)}
                    </FormGroup>
                    <FormGroup row sx={{ justifyContent: "space-around" }}>
                        {(["showTimer", "showProgressBar", "showPreviewBeforeComplete", "questionOrder"] as Array<"showTimer" | "showProgressBar" | "showPreviewBeforeComplete" | "questionOrder">)
                            .map(key => <FormControlLabel
                                sx={{ flex: 1, margin: 0 }}
                                key={key}
                                label={{
                                    showTimer: "Show Timer",
                                    showProgressBar: "Show Progress",
                                    showPreviewBeforeComplete: "Review Answer",
                                    questionOrder: "Shuffle questions"
                                }[key]}
                                labelPlacement="top"
                                control={<Switch
                                    size="small"
                                    name={key}
                                    onChange={HandleSwitch}
                                    checked={key !== "questionOrder" ? schemaData[key] : schemaData[key] === "random" ? true : false} />}
                                slotProps={{ typography: { fontSize: "10pt" } }} />)}
                    </FormGroup>
                </form>
            </Box>
        </Card>
    </Box>
}