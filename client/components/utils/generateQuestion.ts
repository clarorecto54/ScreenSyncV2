import { Element, StandardQuestion } from "@/types/Exam.types";

export default function AddQuestion(questionIndex: number): Element
{
    return {
        elements: [{
            name: `Question ${questionIndex}`,
            title: "",
            type: "radiogroup",
            isRequired: false,
            correctAnswer: "",
            titleLocation: "top",
            choicesOrder: "random",
            choices: []
        } satisfies StandardQuestion]
    }
}