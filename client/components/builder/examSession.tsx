import SchemaHeader from "@/components/builder/schemaHeader";
import { useGlobals } from "@/components/hooks/useGlobals";
import { useSchema } from "@/components/hooks/useSchema";
import { EncryptSchema } from "@/components/utils/crypto";
import { ExamResult, ExamSocketMapping } from "@/types/Exam.types";
import { Avatar, Box, Card, CardHeader, Chip, Button, Stack, List, ListItem, Divider, ListItemButton, IconButton, Typography } from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

export default function ExamSession()
{
    const { socket, meetingCode } = useGlobals()
    const { schemaData } = useSchema()
    const [timer, setTimer] = useState<NodeJS.Timeout>()
    const [countdown, setCountdown] = useState<NodeJS.Timeout>()
    const [mappedSocket] = useState<Socket<ExamSocketMapping>>(socket)
    const [savePath] = useState<string>("../")
    const [sendingOut, setSendingOut] = useState<boolean>(false)
    const [results, setResults] = useState<ExamResult[]>([])
    const [timeRemaining, setTimeRemaining] = useState<number>(0)
    const SendOutExam = () =>
    {
        setSendingOut(true)
        if (timer)
        {
            clearTimeout(timer)
            setTimer(undefined)
        }
        if (countdown)
        {
            clearTimeout(countdown)
            setCountdown(undefined)
        }
        setTimeRemaining(schemaData.timeLimit)
        setTimer(setTimeout(() =>
        {
            StopExam()
            setTimer(undefined)
        }, schemaData.timeLimit * 1000))
        setInterval(() => setTimeRemaining(prev => prev - 1), 1000);
        mappedSocket.emit("SendOutExam", meetingCode, EncryptSchema(schemaData))
    }
    const StopExam = () =>
    {
        setSendingOut(false)
        mappedSocket.emit("StopExam", meetingCode)
    }
    useEffect(() =>
    {
        const ReceiveResult: ExamSocketMapping["ReceiveResult"] = (result) =>
            setResults(prev => [...prev, result])
        mappedSocket.on("ReceiveResult", ReceiveResult)
        return () =>
        {
            mappedSocket.off("ReceiveResult", ReceiveResult)
        }
    }, [])
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
                        sx={{ paddingBottom: "16px" }}
                    />
                </Box>
                <Divider sx={{ fontFamily: "Montserrat", fontWeight: 500, fontSize: "10pt" }}>Results</Divider>
                <Box paddingX="16px" display="flex" flexDirection="column" overflow="scroll">
                    <Stack>
                        {results.map(({ name, score, pdf }, index) => <ListItem key={index}
                            secondaryAction={
                                <IconButton
                                    onClick={() =>
                                    {
                                        const blob = new Blob([pdf], { type: "application/pdf" })
                                        const url = URL.createObjectURL(blob)
                                        window.open(url, "_blank")
                                    }}
                                    edge="end"
                                >
                                    <Image alt="" fill src={require("@/public/images/[Icon] PDF.svg")} />
                                </IconButton>
                            }
                            sx={{ fontFamily: "Montserrat", fontWeight: 500 }}
                        >
                            <Stack flexDirection="row" gap={2}>
                                <Typography width="64px" overflow="hidden" textAlign="center">
                                    {(Math.round(((score / (schemaData.pages.length - 1)) * 100) * 10) / 10)} %
                                </Typography>
                                <Typography>
                                    {name.toUpperCase()}
                                </Typography>
                            </Stack>
                        </ListItem>)}
                        {/* {results.map(({ name, score, encryptedPDF }, index) => <List>

                    </List>)} */}
                    </Stack>
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
                {sendingOut && `Stop Exam [ ${timeRemaining} ]`}
            </Button>
        </Box>
    </>
}