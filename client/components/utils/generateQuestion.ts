import { Element, StandardQuestion } from "@/types/Exam.types";
import { randomBytes } from "crypto";

export default function AddQuestion(): Element
{
    return {
        id: randomBytes(16).toString("base64"),
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