import "survey-core/survey-core.min.css"
import { useSchema } from "@/components/hooks/useSchema";
import { Model } from "survey-core";
import { PlainDark } from "survey-core/themes";
import { Box } from "@mui/material";
import { Survey } from "survey-react-ui";
import { useExam } from "@/components/hooks/useExam";
import jsPDF from "jspdf";
import WrapLongText from "@/components/utils/pdfTextWrapper";
import { useGlobals } from "@/components/hooks/useGlobals";
import { Socket } from "socket.io-client";
import { ExamSocketMapping } from "@/types/Exam.types";
import { useState } from "react";

export default function SchemaConsumer()
{
    const { socket, meetingCode, myInfo } = useGlobals()
    const { schemaData } = useSchema()
    const { setConsumerMode } = useExam()
    const [mappedSocket] = useState<Socket<ExamSocketMapping>>(socket)
    const survey = new Model(JSON.stringify(schemaData))
    survey.applyTheme(PlainDark)
    survey.timerInfoMode = "combined"
    survey.css.clockTimerRoot = "sd-timer my-sd-timer"
    survey.css.clockTimerMinorText = "sd-timer__text--minor myclockTimerMinorText"
    survey.onStarted.add((sender) => sender.startTimer())
    survey.onCurrentPageChanged.add((sender) => sender.startTimer())
    survey.onShowingPreview.add((sender) => sender.stopTimer())
    survey.onCompleting.add((sender) => sender.stopTimer())
    survey.onComplete.add((sender) =>
    {
        sender.stopTimer()
        let points: number = 0
        let totalPoints: number = 0
        const output: Record<string, {
            answer: string
            correct: string
            score: boolean
        }> = {}
        sender.showTimerPanel = "none"
        sender.pages.forEach(page =>
            page.questions.forEach(question =>
            {
                if (question.getType() !== "radiogroup") return
                const q = question.title
                const answer = question.value
                const correct = question.correctAnswer
                const score = question.correctAnswer === answer
                output[q] = {
                    answer,
                    correct,
                    score
                }
                points += score ? 1 : 0
                totalPoints++
            })
        )

        const doc = new jsPDF();
        let y = 10;

        doc.setFontSize(16);
        doc.text(`Name: ${myInfo.name}`, 10, y);
        y += 8;

        doc.text("Exam: " + schemaData.title, 10, y)
        y += 8

        doc.text("Subject / Description: " + schemaData.description, 10, y)
        y += 8

        doc.text("Date: " + new Date().toLocaleString(), 10, y)
        y += 8

        let percentage = (Math.round(((points / totalPoints) * 100) * 10) / 10)
        doc.text(`Total points: ${points} / ${totalPoints}      [ ${percentage}% ]`, 10, y);
        y += 10;

        doc.setFontSize(14);
        Object.entries(output).forEach(([question, info], index) =>
        {
            doc.setFontSize(14)
            doc.text(`Question ${index + 1} : ${info.score ? "CORRECT" : "WRONG"}`, 10, y)
            y += 8

            doc.setFontSize(12);
            doc.text("Question:", 15, y)
            y += 5
            WrapLongText(doc, question, 20, y)
            y += 10

            doc.text("Answer:", 15, y)
            y += 5
            WrapLongText(doc, info.answer, 20, y)
            y += 10

            if (!info.score)
            {
                doc.text("Correct Answer:", 15, y)
                y += 5
                WrapLongText(doc, info.correct, 20, y)
                y += 10
            }
        });
        const raw = doc.output("arraybuffer")
        mappedSocket.emit("SendResult", meetingCode, {
            id: mappedSocket.id!,
            name: myInfo.name,
            score: points,
            examName: schemaData.title,
            subDesc: schemaData.description,
            pdf: raw
        })
        setConsumerMode(false)
    })
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