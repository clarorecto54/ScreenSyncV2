import { Button, CardHeader, Menu, MenuItem } from "@mui/material"
import { useSchema } from "../hooks/useSchema"
import AddQuestion from "../utils/generateQuestion"
import { QuestionErrors, SchemaPage, SchemaValidableKeys } from "@/types/Schema.types"
import { useEffect, useState } from "react"
import GenerateRandomBytes from "@/components/utils/randomBytes"
import GenerateBaseSchema from "@/components/utils/generateBaseSchema"
import GenerateSchemaErrorList from "@/components/utils/generateSchemaErrorList"
import useCustomHooks from "@/components/utils/customHooks"

export default function SchemaHeader()
{
    const { setBuilderMode, setBuilderPage, builderPage, schemaErrors, setSchemaData, setQuestionId, setSchemaErrors, setSessionMode, setImports } = useSchema()
    const { hasSchemaErrors } = useCustomHooks()
    const [globalError, setGlobalError] = useState<string | undefined>(undefined)
    const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null)
    const AddQuestionHandler = () =>
    {
        const questionId = GenerateRandomBytes()
        setQuestionId(questionId)
        setSchemaData(prev =>
        {
            const updatedPages = prev.pages
            updatedPages.push(AddQuestion(questionId))
            return { ...prev, pages: updatedPages }
        })
        setBuilderPage("Edit Question")
    }
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
                        case "Exam Session":
                            setSchemaData(GenerateBaseSchema())
                            setSessionMode(false)
                            return setBuilderPage("Schema List")
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
                        case "Import Question":
                            setImports({})
                            return setBuilderPage("Questions")
                    }
                }}
            >
                Back
            </Button>
        }
        title={builderPage}
        subheader={globalError}
        action={
            !(["Edit Question", "Exam Session"] as SchemaPage[]).some(page => page === builderPage) && <>
                <Button
                    sx={{ background: "#9333ea" }}
                    variant="contained"
                    size="small"
                    onClick={(element) =>
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
                                return setAnchorElement(element.currentTarget)
                        }
                    }}>
                    {builderPage === "Schema List" && "Add Schema"}
                    {builderPage === "Schema Properties" && "Questions"}
                    {builderPage === "Questions" && "Options"}
                </Button>
                <Menu
                    anchorEl={anchorElement}
                    open={Boolean(anchorElement)}
                    onClose={() => setAnchorElement(null)}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center"
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "center"
                    }}
                >
                    <MenuItem
                        onClick={() =>
                        {
                            setAnchorElement(null)
                            AddQuestionHandler()
                        }}
                        sx={{ fontSize: "11pt", py: "4px", px: "8px" }}>
                        Add Question
                    </MenuItem>
                    <MenuItem
                        onClick={() =>
                        {
                            setAnchorElement(null)
                            setBuilderPage("Import Question")
                        }}
                        sx={{ fontSize: "11pt", py: "4px", px: "8px" }}>
                        Import Question
                    </MenuItem>
                </Menu>
            </>
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