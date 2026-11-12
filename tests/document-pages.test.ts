import { describe, expect, it } from "vitest";
import { readDocument } from "@/lib/copper/document-pages";
import { DOCUMENTS } from "@/lib/copper/documents";

describe("readDocument", () => {
  it("returns every customer document page by page, with links to the PDF page", () => {
    for (const doc of DOCUMENTS) {
      const result = readDocument(doc.id);
      expect(result.status).toBe("ok");
      if (result.status !== "ok") continue;
      expect(result.document).toBe(doc.title);
      expect(result.pages.length).toBeGreaterThan(0);
      expect(result.pages[0]).toMatchObject({
        page: 1,
        link: `${doc.file}#page=1`,
      });
    }
  });

  it("finds C-31 on page 8 of the Copper Notes guide", () => {
    const result = readDocument("copper-notes-user-guide");
    if (result.status !== "ok") throw new Error("not found");
    expect(result.pages[7].text).toContain("C-31");
    expect(result.pages[7].text).toContain("Storage full");
  });

  it("says plainly when a document doesn't exist", () => {
    expect(readDocument("pizza-menu").status).toBe("not_found");
  });
});
