import { useSchema } from "@/components/hooks/useSchema"

export default function useCustomHooks()
{
    const { setSchemaErrors } = useSchema()
    const UpdateSchemaErrorMessage = (key: string, condition: boolean, message: string | null = null) =>
    {
        if (condition) setSchemaErrors(prev => ({ ...prev, [key]: message ?? `${key.toUpperCase()} is invalid/empty` }))
        else setSchemaErrors(prev => ({ ...prev, [key]: "" }))
    }
    return { UpdateSchemaErrorMessage }
}