// Module 3: the text of each customer PDF, page by page, so Ask Copper can
// answer from the documents and say which page each answer came from.
// The text was copied out of the PDFs in public/docs/ into
// lib/copper/data/document-pages.json (one string per page, page 1 first).
import pages from "@/lib/copper/data/document-pages.json";
import { DOCUMENTS, type CopperDocument } from "@/lib/copper/documents";

export type DocumentId = CopperDocument["id"];

export const DOCUMENT_IDS = DOCUMENTS.map((d) => d.id) as [
  DocumentId,
  ...DocumentId[],
];

export type DocumentPages =
  | {
      status: "ok";
      document: string;
      pages: { page: number; link: string; text: string }[];
    }
  | { status: "not_found"; message: string };

/** read_document: every page of one customer document, with page numbers. */
export function readDocument(id: string): DocumentPages {
  const doc = DOCUMENTS.find((d) => d.id === id);
  const text = (pages as Record<string, string[]>)[id];
  if (!doc || !text) {
    return {
      status: "not_found",
      message: `There's no document called ${id}.`,
    };
  }
  return {
    status: "ok",
    document: doc.title,
    pages: text.map((t, i) => ({
      page: i + 1,
      link: `${doc.file}#page=${i + 1}`,
      text: t,
    })),
  };
}
