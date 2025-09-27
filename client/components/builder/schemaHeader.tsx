import { Button, CardHeader } from "@mui/material"
import { useSchema } from "../hooks/useSchema"
import AddQuestion from "../utils/generateQuestion"
import { QuestionErrors, SchemaValidableKeys } from "@/types/Schema.types"
import { useEffect, useState } from "react"
import GenerateRandomBytes from "@/components/utils/randomBytes"
import GenerateBaseSchema from "@/components/utils/generateBaseSchema"
import GenerateSchemaErrorList from "@/components/utils/generateSchemaErrorList"
import useCustomHooks from "@/components/utils/customHooks"

export default function SchemaHeader()
{
    const { setBuilderMode, setBuilderPage, builderPage, schemaErrors, setSchemaData, setQuestionId, setSchemaErrors } = useSchema()
    const { hasSchemaErrors } = useCustomHooks()
    const [globalError, setGlobalError] = useState<string | undefined>(undefined)
    useEffect(() => setGlobalError((Object.keys(schemaErrors ?? {}) as SchemaValidableKeys[])
        .map(key =>
        {
            if (hasSchemaErrors())
            {
                const value = schemaErrors[key];
                if (typeof value === "string")
                    return value;
                if (typeof value === "object")
                {
                    const firstError = (value as QuestionErrors[]).find(err => !!err.name);
                    return `${firstError?.name ?? "Question"} : ${firstError?.error}`;
                }
            }
            return undefined;
        })
        .find(Boolean)), [schemaErrors])
    return <CardHeader
        avatar={
            builderPage !== "Schema List" && <Button
                size="small"
                variant="contained"
                onClick={() =>
                {
                    switch (builderPage)
                    {
                        case "Questions":
                            return setBuilderPage("Schema Properties")
                        case "Edit Question":
                            setQuestionId("")
                            return setBuilderPage("Questions")
                        case "Schema Properties":
                            setBuilderPage("Schema List")
                            setBuilderMode(false)
                            setSchemaErrors(GenerateSchemaErrorList())
                            return setSchemaData(GenerateBaseSchema())
                    }
                }}
            >
                Back
            </Button>
        }
        title={builderPage}
        subheader={globalError}
        action={
            builderPage !== "Edit Question" && <Button
                sx={{ background: "#9333ea" }}
                variant="contained"
                size="small"
                onClick={() =>
                {
                    switch (builderPage)
                    {
                        case "Schema List":
                            setBuilderMode(true)
                            setBuilderPage("Schema Properties")
                            setSchemaErrors(GenerateSchemaErrorList())
                            return setSchemaData(GenerateBaseSchema())
                        case "Schema Properties": return setBuilderPage("Questions")
                        case "Questions":
                            const questionId = GenerateRandomBytes()
                            setQuestionId(questionId)
                            setSchemaData(prev =>
                            {
                                const updatedPages = prev.pages
                                updatedPages.push(AddQuestion(questionId))
                                return { ...prev, pages: updatedPages }
                            })
                            return setBuilderPage("Edit Question")
                    }
                }}>
                {builderPage === "Schema List" && "Add Schema"}
                {builderPage === "Schema Properties" && "Questions"}
                {builderPage === "Questions" && "Add Question"}
            </Button>
        }
        slotProps={{
            avatar: {
                style: {
                    zIndex: 1,
                    margin: 0,
                }
            },
            action: {
                style: {
                    zIndex: 1,
                    margin: 0,
                }
            },
            root: {
                style: {
                    justifyContent: builderPage !== "Schema List" ? "space-between" : "end",
                    position: "relative",
                    margin: 0,
                    padding: 0,
                    paddingBottom: "8px",
                }
            },
            content: {
                style: {
                    width: "100%",
                    position: "absolute",
                }
            },
            subheader: {
                className: "Unselectable",
                color: globalError ? "error" : "textSecondary",
                style: { textAlign: "center" }
            },
            title: {
                className: "Unselectable",
                style: {
                    fontSize: "16pt",
                    textAlign: "center",
                    fontWeight: 600,
                    color: "black"
                }
            }
        }}
    />
}