import { useSchema } from "@/components/hooks/useSchema"
import { StandardQuestion } from "@/types/Exam.types"
import { QuestionErrors } from "@/types/Schema.types"

export default function useCustomHooks()
{
    const { setSchemaErrors } = useSchema()
    const UpdateSchemaErrorMessage = (key: string, condition: boolean, message: string | null = null) =>
    {
        if (condition) setSchemaErrors(prev => ({ ...prev, [key]: message ?? `${key.toUpperCase()} is invalid/empty` }))
        else setSchemaErrors(prev => ({ ...prev, [key]: "" }))
    }
    const UpdateQuestionErrorMessage = (data: StandardQuestion, errors: QuestionErrors) =>
    {
        const updatedErrors: QuestionErrors = {
            ...errors,
            fieldErrors: [...errors.fieldErrors]
        }
        updatedErrors.error = ""
        if (!data.title)
        {
            updatedErrors.error ||= "A question has missing fields"
            updatedErrors.fieldErrors.push({
                fieldType: data.type,
                fieldName: "title",
                fieldError: "Question must not be empty",
            })
        }
        else
            updatedErrors.fieldErrors = updatedErrors.fieldErrors.filter(error => error.fieldName !== "title")
        if (data.choices.length < 2)
            updatedErrors.error ||= "A question don't have enough choices"
        setSchemaErrors(prev =>
        {
            let updatedQuestionErrors = [...prev.QuestionsError]
            const existing = updatedQuestionErrors.find(question => question.id === errors.id)
            if (hasQuestionError(updatedErrors))
            {
                if (!existing)
                    updatedQuestionErrors.push(updatedErrors)
                else
                    updatedQuestionErrors[updatedQuestionErrors.findIndex(question => question.id === errors.id)] = updatedErrors
            }
            else
                updatedQuestionErrors = updatedQuestionErrors.filter(question => question.id !== errors.id)
            return { ...prev, QuestionsError: updatedQuestionErrors }
        })
        return updatedErrors
    }
    return { UpdateSchemaErrorMessage, UpdateQuestionErrorMessage }
}

const hasQuestionError = (errors: QuestionErrors) => (errors.error || errors.fieldErrors.length > 0)