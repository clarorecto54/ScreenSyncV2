import { HtmlElement } from "@/types/Exam.types"
import { SchemaErrors, QuestionErrors, SchemaDataListenerTypes, SchemaErrorListenerTypes, SchemaValidableKeys } from "@/types/Schema.types"

export const SchemaDataListener: SchemaDataListenerTypes = (setSchemaData, schemaData, setSchemaErrors) =>
{
    const instanceSchemaData = schemaData
    instanceSchemaData.timeLimit = instanceSchemaData.timeLimitPerPage * (instanceSchemaData.pages.length - 1)
    SchemaErrorListener(schemaData, setSchemaErrors)
    setSchemaData(instanceSchemaData)
}

const SchemaErrorListener: SchemaErrorListenerTypes = (schemaData, setSchemaErrors) =>
{
    const UpdatedSchemaErrors: SchemaErrors = {
        title: "",
        description: "",
        timeLimitPerPage: "",
        SchemaStartingDisplayError: "",
        QuestionsError: [],
    }
    const iterableFields: SchemaValidableKeys[] = ["description", "timeLimitPerPage", "title"]
    for (const key of iterableFields)
    {
        let errorMessage = ""
        switch (key)
        {
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
    }
    if (!(schemaData.pages[0].elements[0] as HtmlElement).html)
        UpdatedSchemaErrors.SchemaStartingDisplayError = "Please input starting message here"
    schemaData.pages.forEach((page, questionIndex) =>
    {
        let questionError: QuestionErrors = {
            name: "",
            index: questionIndex,
            error: "",
            fieldErrors: [],
        }
        page.elements.forEach((element) =>
        {
            if (element.type === "radiogroup")
            {
                const panelName = element.name
                questionError.name = panelName
                if (!element.title)
                {
                    questionError.error = "This question has missing fields"
                    questionError.fieldErrors.push({
                        fieldType: element.type,
                        fieldName: "question",
                        fieldError: "This field must not be empty"
                    })
                }
                if (element.choices.length < 2)
                    questionError.error = "This question don't have choices"
            }
        })
        if (questionError.fieldErrors.length > 0 || questionError.error)
            UpdatedSchemaErrors.QuestionsError.push(questionError)
    })
    const schemaHasError = (Object.keys(UpdatedSchemaErrors) as [keyof SchemaErrors])
        .some((key) => key !== "QuestionsError" && UpdatedSchemaErrors[key]) || UpdatedSchemaErrors.QuestionsError.length !== 0
    if (schemaHasError)
        setSchemaErrors(UpdatedSchemaErrors)
    else
        setSchemaErrors(undefined)
}