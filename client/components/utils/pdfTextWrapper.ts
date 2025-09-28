import jsPDF from "jspdf";

export default function WrapLongText(doc: jsPDF, text: string, x: number = 10, y: number)
{
    const pageHeight = doc.internal.pageSize.height || 297; // A4 height in mm
    const lineHeight = 7;
    const pageMargin = 10;
    const lines: string[] = doc.splitTextToSize(text, 180);
    lines.forEach(line =>
    {
        if (y + lineHeight > pageHeight - pageMargin)
        {
            doc.addPage();
            y = pageMargin;
        }
        doc.text(line, x, y);
        y += lineHeight;
    });
}