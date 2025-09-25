import { Model } from "survey-core"
import { PlainDark } from "survey-core/themes"
import { Survey } from "survey-react-ui"
import { useSchema } from "../hooks/useSchema"
import "survey-core/survey-core.min.css"
import { Box } from "@mui/material"

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
        const output: Record<string, string | number> = {
            points: 0
        }
        sender.pages.forEach(page =>
            page.questions.forEach(question =>
            {
                if (question.getType() !== "radiogroup") return
                const q = question.title
                const a = question.value
                const correct = question.correctAnswer === a
                output[`${correct ? '✔️' : '❌'} ${q}`] = a
                output["points"] = (output["points"] as number) + (correct ? 1 : 0);
            })
        )
        sender.stopTimer()
        sender.showTimerPanel = "none"
        setTimeout(() => survey.clear(), 3000)
    })
    return <Box height="100%" sx={{ borderRadius: "24px", overflow: "hidden" }}>
        <Survey model={survey} />
    </Box>
}