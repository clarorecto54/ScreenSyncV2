"use client"
import ExamBuilder from "@/components/builder/builder";
import { ExamContextProvider } from "@/components/hooks/useExam";
import { SchemaContextProvider } from "@/components/hooks/useSchema";
import { createTheme, ThemeProvider } from "@mui/material";

export default function Workbench()
{
    const theme = createTheme({
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
            }
        }
    })
    return <div className={`
    h-full w-full bg-black
    flex justify-center items-center
    `}>
        <ThemeProvider theme={theme}>
            <ExamContextProvider>
                <SchemaContextProvider>
                    <ExamBuilder />
                </SchemaContextProvider>
            </ExamContextProvider>
        </ThemeProvider>
    </div>
}