import WrapLongText from "@/components/utils/pdfTextWrapper";
import { GeneratePDFResultType } from "@/types/Schema.types";
import jsPDF from "jspdf";

const GeneratePDFResult: GeneratePDFResultType = ({
    name, schemaData, points, totalPoints, output
}) =>
{
    const doc = new jsPDF();
    let cursor = 10;
    doc.setFontSize(16);
    doc.text(`Name: ${name}`, 10, cursor);
    cursor = MoveCursor(8, cursor, doc)

    doc.text("Exam: " + schemaData.title, 10, cursor)
    cursor = MoveCursor(8, cursor, doc)

    doc.text("Subject / Description: " + schemaData.description, 10, cursor)
    cursor = MoveCursor(8, cursor, doc)

    doc.text("Date: " + new Date().toLocaleString(), 10, cursor)
    cursor = MoveCursor(8, cursor, doc)

    let percentage = (Math.round(((points / totalPoints) * 100) * 10) / 10)
    doc.text(`Total points: ${points} / ${totalPoints}      [ ${percentage}% ]`, 10, cursor);
    cursor = MoveCursor(10, cursor, doc)

    doc.setFontSize(14);
    Object.entries(output).forEach(([question, info], index) =>
    {
        doc.setFontSize(14)
        doc.text(`Question ${index + 1} : ${info.score ? "CORRECT" : "WRONG"}`, 10, cursor)
        cursor = MoveCursor(8, cursor, doc)

        doc.setFontSize(12);
        doc.text("Question:", 15, cursor)
        cursor = MoveCursor(6, cursor, doc)
        cursor = WrapLongText(doc, question, 20, cursor)

        doc.text("Answer:", 15, cursor)
        cursor = MoveCursor(6, cursor, doc)
        cursor = WrapLongText(doc, info.answer ?? "No Answer", 20, cursor)

        if (!info.score)
        {
            doc.text("Correct Answer:", 15, cursor)
            cursor = MoveCursor(6, cursor, doc)
            cursor = WrapLongText(doc, info.correct, 20, cursor)
        }
        cursor = MoveCursor(8, cursor, doc)
    });
    return doc.output("arraybuffer")
}

function MoveCursor(steps: number, cursor: number, doc: jsPDF)
{
    if ((cursor + steps) > (doc.internal.pageSize.getHeight() - 10))
    {
        doc.addPage()
        cursor = 10
    }
    else cursor += steps
    return cursor
}

export default GeneratePDFResult