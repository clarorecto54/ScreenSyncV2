"use client"
import SchemaBuilder from "./schema"
import SchemaList from "./schemaList"
import { useSchema } from "../hooks/useSchema"
import SchemaPreview from "./preview"
import { Box, SxProps } from "@mui/material"
import { useState } from "react"
import { Theme } from "@emotion/react"

export default function ExamBuilder()
{
    const { builderMode } = useSchema()
    const [panelStyling] = useState<SxProps<Theme>>({
        height: "100%",
        width: "100%",
        maxWidth: "600px",
        borderRadius: "32px",
        padding: "24px",
        background: "hsl(0,0%,95%)"
    })
    return <Box display="flex" gap="32px" justifyContent="center" alignItems="center"
        sx={{
            height: "670px",
            width: "1600px",
            padding: "32px",
            borderRadius: "24px",
            backgroundColor: "#242424",
        }}>
        <Box sx={panelStyling}>
            {!builderMode && <SchemaList />}
            {builderMode && <SchemaBuilder />}
        </Box>
        {builderMode && <Box sx={panelStyling} >
            <SchemaPreview />
        </Box>}
    </Box>
}