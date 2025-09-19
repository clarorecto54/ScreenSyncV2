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
    survey.onStarted.add((sender, options) => sender.startTimer())
    survey.onCurrentPageChanged.add((sender, options) => sender.startTimer())
    survey.onShowingPreview.add((sender, options) => sender.stopTimer())
    survey.onCompleting.add((sender, options) => sender.stopTimer())
    survey.onComplete.add((sender, options) =>
    {
        sender.stopTimer()
        sender.showTimerPanel = "none"
        setTimeout(() => survey.clear(), 3000)
    })
    return <Box height="100%" sx={{ borderRadius: "24px", overflow: "hidden" }}>
        <Survey model={survey} />
    </Box>
}