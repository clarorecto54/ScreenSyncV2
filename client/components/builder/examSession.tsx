import SchemaHeader from "@/components/builder/schemaHeader";
import { useGlobals } from "@/components/hooks/useGlobals";
import { useSchema } from "@/components/hooks/useSchema";
import { Encrypt } from "@/components/utils/crypto";
import { ExamSocketMapping } from "@/types/Exam.types";
import { Avatar, Box, Card, CardHeader, Chip, Button, Stack } from "@mui/material";
import Image from "next/image";
import { useState } from "react";
import { Socket } from "socket.io-client";

export default function ExamSession()
{
    const { socket, meetingCode } = useGlobals()
    const { schemaData } = useSchema()
    const [mappedSocket] = useState<Socket<ExamSocketMapping>>(socket)
    const [sendingOut, setSendingOut] = useState<boolean>(false)
    const SendOutExam = () =>
    {
        setSendingOut(true)
        setTimeout(() => StopExam(), schemaData.timeLimit * 1000)
        mappedSocket.emit("SendOutExam", meetingCode, Encrypt(schemaData))
    }
    const StopExam = () =>
    {
        setSendingOut(false)
        mappedSocket.emit("StopExam", meetingCode)
    }
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
        <Box display={"flex"} alignItems={"center"} justifyContent={"center"} paddingTop={"16px"}>
            <Button
                color={!sendingOut ? "success" : "error"}
                variant="contained"
                size="medium"
                startIcon={<div className="aspect-square h-[12px] relative whiteOverlay">
                    <Image alt="" fill src={require(`@/public/images/Exam.svg`)} />
                </div>}
                sx={{ borderRadius: "100px" }}
                onClick={!sendingOut ? SendOutExam : StopExam}>
                {!sendingOut && "Start Exam"}
                {sendingOut && "Stop Exam"}
            </Button>
        </Box>
    </>
}