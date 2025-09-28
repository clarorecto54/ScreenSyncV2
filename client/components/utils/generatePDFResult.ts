import WrapLongText from "@/components/utils/pdfTextWrapper";
import { GeneratePDFResultType } from "@/types/Schema.types";
import jsPDF from "jspdf";

const GeneratePDFResult: GeneratePDFResultType = ({
    name, schemaData, points, totalPoints, output
}) =>
{
    const doc = new jsPDF();
    let y = 10;

    doc.setFontSize(16);
    doc.text(`Name: ${name}`, 10, y);
    y += 8;

    doc.text("Exam: " + schemaData.title, 10, y)
    y += 8

    doc.text("Subject / Description: " + schemaData.description, 10, y)
    y += 8

    doc.text("Date: " + new Date().toLocaleString(), 10, y)
    y += 8

    let percentage = (Math.round(((points / totalPoints) * 100) * 10) / 10)
    doc.text(`Total points: ${points} / ${totalPoints}      [ ${percentage}% ]`, 10, y);
    y += 10;

    doc.setFontSize(14);
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
    return doc.output("arraybuffer")
}

export default GeneratePDFResult