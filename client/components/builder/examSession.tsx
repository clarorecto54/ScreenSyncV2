import SchemaHeader from "@/components/builder/schemaHeader";
import { useSchema } from "@/components/hooks/useSchema";
import { Avatar, Box, Card, CardHeader, Chip, Divider, Stack } from "@mui/material";
import Image from "next/image";
import { useState } from "react";

export default function ExamSession()
{
    const { schemaData } = useSchema()
    const [sendingOut, setSendingOut] = useState<boolean>(false)
    return <>
        <SchemaHeader />
        <Box
            width="100%"
            height="100%"
            display="flex"
            flexDirection="column"
            gap="8px"
            alignItems="center"
            overflow="hidden"
        >
            <Card className="h-full w-full Unselectable flex flex-col" variant="elevation" elevation={2} sx={{ overflow: "hidden" }}>
                <Box>
                    <CardHeader
                        className="transition-all duration-300"
                        title={schemaData.title}
                        subheader={
                            <Stack className="Unselectable" flexDirection="row" gap={1} >
                                <Chip
                                    className="bg-red-500"
                                    size="small"
                                    label={sendingOut ? "In Session" : "Waiting..."}
                                    sx={{
                                        padding: "4px",
                                        background: sendingOut ? "#3f6212" : "#ef4444",
                                        color: "white"
                                    }}
                                />
                                |
                                <Chip
                                    size="small"
                                    label={`${schemaData.pages.length - 1} Question`}
                                    sx={{
                                        padding: "4px",
                                        background: "#4b5563",
                                        color: "white"
                                    }}
                                />
                                <Chip
                                    size="small"
                                    label={`${schemaData.timeLimit}s Time`}
                                    sx={{
                                        padding: "4px",
                                        background: "#ea580c",
                                        color: "white"
                                    }}
                                />
                            </Stack>
                        }
                        avatar={<Avatar
                            sx={{
                                height: "24px", width: "24px", background: "none",
                            }}>
                            <Image
                                alt=""
                                src={require("@/public/images/Exam.svg")}
                            />
                        </Avatar>}
                        sx={{ paddingBottom: 0 }}
                    />
                </Box>
            </Card>
        </Box>
    </>
}