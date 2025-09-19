import { Model } from "survey-core"
import { PlainDark } from "survey-core/themes"
import { Survey } from "survey-react-ui"
import { useSchema } from "../hooks/useSchema"
import "survey-core/survey-core.min.css"

export default function SchemaPreview()
{
    const { schemaData, setPreviewMode } = useSchema()
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
        setTimeout(() =>
        {
            setPreviewMode(false)
        }, 3000)
    })
    return <Survey model={survey} />
}