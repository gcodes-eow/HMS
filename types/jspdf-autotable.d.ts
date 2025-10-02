declare module "jspdf-autotable" {
  import { jsPDF } from "jspdf";

  interface AutoTableOptions {
    head?: Array<Array<string>>;
    body?: Array<Array<string | number>>;
    startY?: number;
    theme?: "striped" | "grid" | "plain";
    styles?: Record<string, any>;
    headStyles?: Record<string, any>;
    bodyStyles?: Record<string, any>;
    alternateRowStyles?: Record<string, any>;
    columnStyles?: Record<string, any>;
  }

  export default function autoTable(doc: jsPDF, options: AutoTableOptions): void;
}
