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
        const output: Record<string, {
            answer: string
            correct: boolean
        }> = {}
        sender.showTimerPanel = "none"
        sender.pages.forEach(page =>
            page.questions.forEach(question =>
            {
                if (question.getType() !== "radiogroup") return
                const q = question.title
                const answer = question.value
                const correct = question.correctAnswer === answer
                output[q] = {
                    answer,
                    correct
                }
                points += correct ? 1 : 0
            })
        )

        const doc = new jsPDF();
        const pageHeight = doc.internal.pageSize.height || 297; // A4 height in mm
        let y = 10;

        doc.setFontSize(16);
        doc.text("Survey Results", 10, y);
        y += 10;

        doc.text(`Total points: ${points}`, 10, y);
        y += 10;

        const lineHeight = 7;
        const pageMargin = 10;

        Object.entries(output).forEach(([question, info]) =>
        {
            doc.setFontSize(12);
            const text = `${question} (${info.correct ? "Correct" : "Wrong"}): ${info.answer}`;

            const lines: string[] = doc.splitTextToSize(text, 180);
            lines.forEach(line =>
            {
                if (y + lineHeight > pageHeight - pageMargin)
                {
                    doc.addPage();
                    y = pageMargin;
                }
                doc.text(line, 10, y);
                y += lineHeight;
            });
        });

        doc.save("survey-results.pdf");
        setTimeout(() => survey.clear(), 3000)
    })
    return <Box height="100%" sx={{ borderRadius: "24px", overflow: "hidden" }}>
        <Survey model={survey} />
    </Box>
}