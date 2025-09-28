import { Model } from "survey-core"
import { PlainDark } from "survey-core/themes"
import { Survey } from "survey-react-ui"
import { useSchema } from "../hooks/useSchema"
import "survey-core/survey-core.min.css"
import { Box } from "@mui/material"
import { jsPDF } from 'jspdf'

export default function SchemaPreview()
{
    const { schemaData } = useSchema()
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
        doc.text(`Name: HOST`, 10, y);
        y += 10;

        doc.setFontSize(14);
        doc.text(`Total points: ${points} / ${totalPoints}      [ ${((points / totalPoints) * 100)}% ]`, 10, y);
        y += 10;

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

        doc.save("test-exam-results.pdf");
    })
    return <Box height="100%" sx={{ borderRadius: "24px", overflow: "hidden" }}>
        <Survey model={survey} />
    </Box>
}

function WrapLongText(doc: jsPDF, text: string, x: number = 10, y: number)
{
    const pageHeight = doc.internal.pageSize.height || 297; // A4 height in mm
    const lineHeight = 7;
    const pageMargin = 10;
    const lines: string[] = doc.splitTextToSize(text, 180);
    lines.forEach(line =>
    {
        if (y + lineHeight > pageHeight - pageMargin)
        {
            doc.addPage();
            y = pageMargin;
        }
        doc.text(line, x, y);
        y += lineHeight;
    });
}