import { Element, StandardQuestion } from "@/types/Exam.types";

export default function AddQuestion(id: string): Element
{
    return {
        id,
        type: "panel",
        questionOrder: "initial",
        elements: [{
            name: "Question",
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