import { assertEquals } from "assert";
import { languageSplit, newSplitter } from "./language-split.ts";
import { blankSlate } from "../coupling/coupling.ts";
import type { Line, RawSource } from "./line.ts";

const testLine = (rawLine: RawSource): Line => ({
    "pass": 2,
    "filename": "dummy.asm",
    "lineNumber": 1,
    "rawLine": rawLine
});

Deno.test("JS can be delimited with moustaches on the same line", () => {
    blankSlate();
    const line = testLine("MOV {{ this.test = 27; return this.test; }}, R2");
    languageSplit(newSplitter(), line);
    assertEquals(line.rawLine, "MOV 27, R2");
});

Deno.test("JS can use registers from the context", () => {
    blankSlate();
    const line = testLine("MOV {{ R6 }}, R2");
    languageSplit(newSplitter(), line);
    assertEquals(line.rawLine, "MOV 6, R2");
});

Deno.test("JS can be delimited by moustaches across several lines", () => {
    blankSlate();
    const split = newSplitter();

    const line1 = testLine("some ordinary stuff {{ this.test = 27;");
    const line2 = testLine("this.andThat = \"hello\";");
    const line3 = testLine("return this.andThat; }} matey!")

    languageSplit(split, line1);
    assertEquals(line1.rawLine, "some ordinary stuff");
    languageSplit(split, line2);
    assertEquals(line2.rawLine, "");
    languageSplit(split, line3);
    assertEquals(line3.rawLine, "hello matey!");
});
