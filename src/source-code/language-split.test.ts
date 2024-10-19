import { assertEquals } from "assert";
import { newState } from "../state/mod.ts";
import type { Line, RawSource } from "./line.ts";
import { languageSplitter } from "./language-split.ts";

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
    const language = languageSplitter(newState().context);
    const line = testLine("MOV {{ this.test = 27; return this.test; }}, R2");
    language.split(line);
    assertEquals(line.assemblyLine, "MOV 27, R2");
    language.check();
});

Deno.test("JS can use registers from the context", () => {
    const state = newState();
    state.device.choose("dummy", { "reducedCore": false })
    const language = languageSplitter(state.context);
    const line = testLine("MOV {{ R6 }}, R2");
    language.split(line);
    assertEquals(line.assemblyLine, "MOV 6, R2");
    language.check();
});

Deno.test("JS can be delimited by moustaches across several lines", () => {
    const language = languageSplitter(newState().context);
    const line1 = testLine("some ordinary stuff {{ this.test = 27;");
    const line2 = testLine("this.andThat = \"hello\";");
    const line3 = testLine("return this.andThat; }} matey!")

    language.split(line1);
    assertEquals(line1.assemblyLine, "some ordinary stuff");
    language.split(line2);
    assertEquals(line2.assemblyLine, "");
    language.split(line3);
    assertEquals(line3.assemblyLine, "hello matey!");
    language.check();
});
