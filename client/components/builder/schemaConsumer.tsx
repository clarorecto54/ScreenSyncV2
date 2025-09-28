import "survey-core/survey-core.min.css"
import { useSchema } from "@/components/hooks/useSchema";
import { Model } from "survey-core";
import { PlainDark } from "survey-core/themes";
import { Box } from "@mui/material";
import { Survey } from "survey-react-ui";
import { useExam } from "@/components/hooks/useExam";

export default function SchemaConsumer()
{
    const { schemaData } = useSchema()
    const { setConsumerMode } = useExam()
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