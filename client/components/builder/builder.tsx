"use client"
import SchemaBuilder from "./schema"
import SchemaList from "./schemaList"
import { useSchema } from "../hooks/useSchema"
import SchemaPreview from "./preview"
import { Box, createTheme, SxProps, ThemeProvider } from "@mui/material"
import { useState } from "react"
import { Theme } from "@emotion/react"

export default function ExamBuilder()
{
    const { builderMode } = useSchema()
    const [panelStyling] = useState<SxProps<Theme>>({
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        maxWidth: "600px",
        borderRadius: "32px",
        padding: "24px",
        background: "hsl(0,0%,95%)",
        overflowY: "hidden"
    })
    return <ThemeProvider theme={ExamBuilderTheme()}>
        <Box sx={panelStyling}>
            {!builderMode && <SchemaList />}
            {builderMode && <SchemaBuilder />}
        </Box>
        {builderMode && <Box sx={panelStyling} >
            <SchemaPreview />
        </Box>}
    </ThemeProvider>
}

function ExamBuilderTheme()
{
    return createTheme({
        components: {
            MuiButton: {
                styleOverrides: {
                    text: {
                        color: "black",
                        borderColor: "black",
                        fontFamily: "Montserrat, sans-serif"
                    },
                    outlined: {
                        color: "black",
                        borderColor: "black",
                        fontFamily: "Montserrat, sans-serif"
                    }
                }
            },
            MuiCardHeader: {
                styleOverrides: {
                    title: {
                        fontFamily: "Montserrat, sans-serif",
                        fontSize: "12pt",
                        fontWeight: 500
                    },
                    root: {
                        paddingBottom: "0px"
                    }
                }
            }
        }
    })
}