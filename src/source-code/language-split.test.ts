import { assertEquals } from "assert";
import { languageSplit, splitterCheck } from "./language-split.ts";
import { blankSlate } from "../coupling/coupling.ts";
import type { Line, RawSource } from "./line.ts";

const testLine = (rawLine: RawSource): Line => ({
    "filename": "",
    "lineNumber": 0,
    "rawLine": rawLine,
    "assemblyLine": "",
    "label": "",
    "mnemonic": "",
    "operands": []
});

Deno.test("JS can be delimited with moustaches on the same line", () => {
    blankSlate();
    const line = testLine("MOV {{ this.test = 27; return this.test; }}, R2");
    languageSplit(line);
    assertEquals(line.assemblyLine, "MOV 27, R2");
    splitterCheck();
});

Deno.test("JS can use registers from the context", () => {
    blankSlate();
    const line = testLine("MOV {{ R6 }}, R2");
    languageSplit(line);
    assertEquals(line.assemblyLine, "MOV 6, R2");
    splitterCheck();
});

Deno.test("JS can be delimited by moustaches across several lines", () => {
    blankSlate();
    const line1 = testLine("some ordinary stuff {{ this.test = 27;");
    const line2 = testLine("this.andThat = \"hello\";");
    const line3 = testLine("return this.andThat; }} matey!")

    languageSplit(line1);
    assertEquals(line1.assemblyLine, "some ordinary stuff");
    languageSplit(line2);
    assertEquals(line2.assemblyLine, "");
    languageSplit(line3);
    assertEquals(line3.assemblyLine, "hello matey!");
    splitterCheck();
});
