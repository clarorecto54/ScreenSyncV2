import { BuilderPageListenerTypes, SchemaDataListenerTypes } from "@/types/Schema.types"

export const SchemaDataListener: SchemaDataListenerTypes = (setSchemaData, schemaData) =>
{
    const instanceSchemaData = schemaData
    instanceSchemaData.timeLimit = instanceSchemaData.timeLimitPerPage * (instanceSchemaData.pages.length - 1)
    setSchemaData(instanceSchemaData)
}

export const BuilderPageListener: BuilderPageListenerTypes = (builderPage, setSchemaKey) =>
{
    if (builderPage === "Schema List")
        setSchemaKey("")
}