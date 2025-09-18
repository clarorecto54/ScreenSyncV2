import { ExamProp, HtmlElement, StandardQuestion } from "@/types/Exam.types";

export default function GenerateBaseSchema(): ExamProp
{
    return {
        title: "",
        timeLimit: 30,
        startSurveyText: "Start Quiz",
        pages: [
            {
                elements: [
                    {
                        type: "html",
                        html: ""
                    } satisfies HtmlElement
                ]
            },
            {
                elements: [{
                    name: "Question 1",
                    question: "",
                    type: "radiogroup",
                    isRequired: true,
                    correctAnswer: "",
                    titleLocation: "top",
                    choicesOrder: "random",
                    choices: []
                } satisfies StandardQuestion]
            }
        ],
    }
}