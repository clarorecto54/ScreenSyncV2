import { SchemaErrors } from "@/types/Schema.types";

export default function GenerateSchemaErrorList(): SchemaErrors
{
    return {
        password: "",
        title: "",
        description: "",
        SchemaStartingDisplayError: "",
        timeLimitPerPage: "",
        QuestionsError: []
    }
}