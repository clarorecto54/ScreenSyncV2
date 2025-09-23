import { Button, CardHeader } from "@mui/material"
import { useSchema } from "../hooks/useSchema"
import Image from "next/image"
import AddQuestion from "../utils/generateQuestion"
import { QuestionErrors, SchemaValidableKeys } from "@/types/Schema.types"
import { useEffect, useState } from "react"
import { randomBytes } from "crypto"
import GenerateRandomBytes from "@/components/utils/randomBytes"

export default function SchemaHeader()
{
    const { setBuilderMode, setBuilderPage, builderPage, schemaErrors, setSchemaData, setQuestionId } = useSchema()
    const [globalError, setGlobalError] = useState<string | undefined>(undefined)
    const hasSchemaErrors = () => (
        schemaErrors.password ||
        schemaErrors.title ||
        schemaErrors.description ||
        schemaErrors.SchemaStartingDisplayError ||
        schemaErrors.timeLimitPerPage ||
        schemaErrors.QuestionsError.length > 0
    )
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
                    return `${firstError?.name} : ${firstError?.error}`;
                }
            }
            return undefined;
        })
        .find(Boolean)), [schemaErrors])
    return <CardHeader
        avatar={
            <Button
                size="small"
                variant="contained"
                onClick={() =>
                {
                    switch (builderPage)
                    {
                        case "Questions":
                            return setBuilderPage("Schema Properties")
                        case "Edit Question":
                            return setBuilderPage("Questions")
                        case "Schema Properties":
                            return setBuilderMode(false)
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
                    justifyContent: "space-between",
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
                }
            }
        }}
    />
}