import "survey-core/survey-core.min.css"
import { useSchema } from "@/components/hooks/useSchema";
import { Model } from "survey-core";
import { PlainDark } from "survey-core/themes";
import { Box } from "@mui/material";
import { Survey } from "survey-react-ui";
import { useExam } from "@/components/hooks/useExam";
import { useGlobals } from "@/components/hooks/useGlobals";
import { Socket } from "socket.io-client";
import { ExamSocketMapping } from "@/types/Exam.types";
import { useEffect, useMemo, useState } from "react";
import GeneratePDFResult from "@/components/utils/generatePDFResult";
import GenerateBaseSchema from "@/components/utils/generateBaseSchema";

export default function SchemaConsumer()
{
    const { socket, meetingCode, myInfo } = useGlobals()
    const { schemaData, output, setOutput, setSchemaData } = useSchema()
    const { setConsumerMode } = useExam()
    const [done, setDone] = useState<boolean>(false)
    const [mappedSocket] = useState<Socket<ExamSocketMapping>>(socket)
    const [points, setPoints] = useState<number>(0)
    const [totalPoints, setTotalPoints] = useState<number>(0)
    const [autoScrollTimeout, setAutoScrollTimeout] = useState<NodeJS.Timeout>()
    const survey = useMemo(() => new Model(JSON.stringify(schemaData)), [schemaData])
    survey.applyTheme(PlainDark)
    survey.timerInfoMode = "combined"
    survey.css.clockTimerRoot = "sd-timer my-sd-timer"
    survey.css.clockTimerMinorText = "sd-timer__text--minor myclockTimerMinorText"
    survey.onStarted.add((sender) => sender.startTimer())
    survey.onCurrentPageChanged.add((sender) => sender.startTimer())
    survey.onShowingPreview.add((sender) =>
    {
        sender.stopTimer()
        setAutoScrollTimeout(
            setTimeout(() =>
            {
                const container = document.querySelector(".sv-scroll__scroller")
                if (container)
                {
                    container.scrollTo({
                        top: container.scrollHeight,
                        behavior: "smooth"
                    })
                }
            }, 500)
        )
    })
    survey.onCompleting.add((sender) => sender.stopTimer())
    survey.onValueChanged.add((options) =>
    {
        options.pages.forEach(page =>
        {
            page.questions.forEach(question =>
            {
                if (question.getType() !== "radiogroup") return
                const q = question.title
                const answer = question.value
                const correct = question.correctAnswer
                const score = question.correctAnswer === answer
                setOutput(prev => ({
                    ...prev, [q]: {
                        answer,
                        correct,
                        score
                    }
                }))
            })
        })
    })
    survey.onComplete.add((sender) =>
    {
        sender.stopTimer()
        sender.showTimerPanel = "none"
        clearTimeout(autoScrollTimeout)
        setAutoScrollTimeout(undefined)
        setDone(true)
    })
    useEffect(() =>
    {
        const keys = Object.keys(output)
        setTotalPoints(keys.length)
        let instancePoint = 0
        for (const key of keys)
            if (output[key].score)
                instancePoint++
        setPoints(instancePoint)
    }, [output])
    useEffect(() =>
    {
        if (!done) return
        mappedSocket.emit("SendResult", meetingCode, {
            id: mappedSocket.id!,
            examId: schemaData.id,
            name: myInfo.name,
            score: points,
            examName: schemaData.title,
            subDesc: schemaData.description,
            pdf: GeneratePDFResult({
                name: myInfo.name,
                output,
                points,
                schemaData,
                totalPoints
            })
        })
        setSchemaData(GenerateBaseSchema())
        setOutput({})
        setConsumerMode(false)
    }, [done])
    return <Box sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        maxWidth: "600px",
        borderRadius: "16px",
        background: "hsl(0,0%,95%)",
        overflowY: "hidden"
    }}>
        <Survey model={survey} />
    </Box>
}