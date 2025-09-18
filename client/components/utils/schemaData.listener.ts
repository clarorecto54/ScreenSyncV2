import { ExamProp, HtmlElement } from "@/types/Exam.types"
import { SchemaErrors, QuestionErrors } from "@/types/Schema.types"
import { Dispatch, SetStateAction } from "react"

export default function SchemaDataListener(schemaData: ExamProp, setSchemaErrors: Dispatch<SetStateAction<SchemaErrors | undefined>>)
{
    const UpdatedSchemaErrors: SchemaErrors = {
        QuestionsError: [],
        SchemaStartingDisplayError: "",
        SchemaTimeLimitError: "",
        SchemaTitleError: ""
    }
    if (!schemaData.title) UpdatedSchemaErrors.SchemaTitleError = "Exam Name must not be empty"
    if (schemaData.timeLimit <= 0) UpdatedSchemaErrors.SchemaTimeLimitError = "Timelimit is invalid"
    if (!(schemaData.pages[0].elements[0] as HtmlElement).html) UpdatedSchemaErrors.SchemaStartingDisplayError = "Please input starting message here"
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
                if (!element.question)
                {
                    questionError.error = "This question has missing fields"
                    questionError.fieldErrors.push({
                        fieldType: element.type,
                        fieldName: "question",
                        fieldError: "This field must not be empty"
                    })
                }
                if (element.choices.length <= 0)
                    questionError.error = "This question don't have choices"
            }
        })
        if (questionError.fieldErrors.length > 0 || questionError.error)
            UpdatedSchemaErrors.QuestionsError.push(questionError)
    })
    setSchemaErrors(UpdatedSchemaErrors)
}