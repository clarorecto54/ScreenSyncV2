import { HtmlElement } from "@/types/Exam.types"
import { SchemaErrors, QuestionErrors, SchemaDataListenerTypes, SchemaErrorListenerTypes, SchemaValidableKeys } from "@/types/Schema.types"

export const SchemaDataListener: SchemaDataListenerTypes = (setSchemaData, schemaData, schemaKey, setSchemaErrors) =>
{
    const instanceSchemaData = schemaData
    instanceSchemaData.timeLimit = instanceSchemaData.timeLimitPerPage * (instanceSchemaData.pages.length - 1)
    SchemaErrorListener(schemaData, schemaKey, setSchemaErrors)
    setSchemaData(instanceSchemaData)
}

const SchemaErrorListener: SchemaErrorListenerTypes = (schemaData, schemaKey, setSchemaErrors) =>
{
    const UpdatedSchemaErrors: SchemaErrors = {
        password: "",
        title: "",
        description: "",
        timeLimitPerPage: "",
        SchemaStartingDisplayError: "",
        QuestionsError: [],
    }
    const iterableFields: SchemaValidableKeys[] = ["description", "timeLimitPerPage", "title", schemaData.lock && "password"]
        .filter((key): key is SchemaValidableKeys => key !== false)
    for (const key of iterableFields)
    {
        let errorMessage = ""
        switch (key)
        {
            case "password":
                errorMessage = "Key must not be empty"
                break
            case "title":
                errorMessage = "Name must not be empty"
                break
            case "description":
                errorMessage = "Subject must not be empty"
                break
            case "timeLimitPerPage":
                errorMessage = "Timelimit is invalid"
                break
            default:
                errorMessage = "This field must not be empty"
                break
        }
        const schemaValue = schemaData[key]
        if (!schemaValue) UpdatedSchemaErrors[key] = errorMessage
        if (key === "password" && schemaKey.length < 4) UpdatedSchemaErrors[key] = "Key must have a minimum of 4 characters"
    }
    if (!(schemaData.pages[0].elements[0] as HtmlElement).html)
        UpdatedSchemaErrors.SchemaStartingDisplayError = "Please input starting message here"
    schemaData.pages.forEach((page, questionIndex) =>
    {
        let questionError: QuestionErrors | null = null
        const questionElement = page.elements.find(element => element.type === "radiogroup")
        if (questionElement && (!questionElement.title || questionElement.choices.length < 2))
            questionError = {
                name: questionElement.name,
                id: page.id,
                error: !questionElement.title ? "This question has missing fields" : "This question don't have choices",
                fieldErrors: !questionElement.title ? [{
                    fieldType: questionElement.type,
                    fieldName: "question",
                    fieldError: "This field must not be empty"
                }
                ] : [],
            }
        if (questionError && (questionError.fieldErrors.length > 0 || questionError.error))
            UpdatedSchemaErrors.QuestionsError.push(questionError)
    })
    const schemaHasError = (Object.keys(UpdatedSchemaErrors) as [keyof SchemaErrors])
        .some((key) => key !== "QuestionsError" && UpdatedSchemaErrors[key]) || UpdatedSchemaErrors.QuestionsError.length !== 0
    if (schemaHasError)
        setSchemaErrors(UpdatedSchemaErrors)
    else
        setSchemaErrors(undefined)
}