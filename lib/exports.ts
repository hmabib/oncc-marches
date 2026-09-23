"use client";
import * as XLSX from "xlsx";

export function downloadCSV(filename: string, rows: (string | number)[][], sep = ";") {
  const esc = (v: string | number) => {
    const s = String(v);
    return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = rows.map((r) => r.map(esc).join(sep)).join("\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

export function downloadExcel(filename: string, sheetName: string, rows: (string | number)[][]) {
  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws["!cols"] = rows[0].map((_, i) => ({ wch: i === 0 ? 14 : 18 }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName.slice(0, 31));
  XLSX.writeFile(wb, filename);
}

export async function downloadPDF(
  filename: string,
  title: string,
  subtitle: string,
  head: string[],
  body: (string | number)[][]
) {
  const { default: jsPDF } = await import("jspdf");
  await import("jspdf-autotable");
  const doc = new jsPDF({ orientation: body[0]?.length > 5 ? "landscape" : "portrait" });
  // @ts-ignore
  doc.setFont("helvetica", "bold"); doc.setFontSize(14); doc.setTextColor(11, 107, 58);
  doc.text(title, 14, 16);
  // @ts-ignore
  doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(60, 60, 60);
  doc.text(subtitle, 14, 22);
  (doc as any).autoTable({
    startY: 27,
    head: [head],
    body: body.map((r) => r.map(String)),
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [11, 107, 58], textColor: 255 },
    alternateRowStyles: { fillColor: [255, 249, 239] },
  });
  const y = (doc as any).lastAutoTable.finalY + 8;
  doc.setFontSize(7.5); doc.setTextColor(110, 110, 110);
  doc.text("Source : ICE Futures (données différées 15 min — reconstitution vérifiable) • Changes : BEAC • Grilles physiques : ONCC.", 14, y);
  doc.text("Document généré par la plateforme ONCC — KOUABA AGENCY. Droits de diffusion selon licence du fournisseur.", 14, y + 4);
  doc.save(filename);
}
