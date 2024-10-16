import { assertArrayIncludes, assertEquals } from "assert";
import { chooseDevice } from "../context/mod.ts";
import { blankSlate } from "../coupling/coupling.ts";
import { tokenLine } from "../source-code/testing.ts";
import { startPass } from "../state/mod.ts";
import { codeBlocksFrom } from "./code-block.ts";

Deno.test("Returns error if attempt to assemble unavailable instruction", () => {
    blankSlate();
    chooseDevice("dummy", {
        "programEnd": 4096,
        "unsupportedInstructions": ["multiply"]
    });
    startPass(2);

    codeBlocksFrom(tokenLine("", "MUL", ["R26", "R28"])).forEach(block => {
        assertArrayIncludes(block.errors, [
            "Error: MUL is not available on dummy"
        ]);
    });
});

Deno.test("no unsupported instruction error on first pass", () => {
    blankSlate();
    chooseDevice("dummy", {
        "programEnd": 4096,
        "unsupportedInstructions": ["multiply"]
    });
    startPass(1);

    codeBlocksFrom(tokenLine("", "MUL", ["R26", "R28"])).forEach(block => {
        assertEquals(0, block.errors.length, "no error on first pass");
    });
});

Deno.test("If no device is chosen, warn after the first assembly line", () => {
    blankSlate();
    startPass(2);

    const blankLine = tokenLine("", "", []);
    codeBlocksFrom(blankLine).forEach(block => {
        assertEquals(0, block.errors.length, "no error on blank line");
    });
    codeBlocksFrom(blankLine).forEach(block => {
        assertEquals(0, block.errors.length, "no error on blank line");
    });
    codeBlocksFrom(tokenLine("", "ADIW", ["R26", "5"])).forEach(block => {
        assertArrayIncludes(block.errors, [
            "Error: Without a device selected, it's not possible to determine which instructions are available"
        ]);
    });
});

Deno.test("no device not chosen on first pass", () => {
    blankSlate();
    chooseDevice("dummy", {
        "programEnd": 4096,
        "unsupportedInstructions": []
    });
    startPass(1);

    codeBlocksFrom(tokenLine("", "ADIW", ["R26", "5"])).forEach(block => {
        assertEquals(0, block.errors.length, "no error on first pass");
    });
});

Deno.test("The device selection error is only shown once", () => {
    blankSlate();
    startPass(2);
    const line = tokenLine("", "ADIW", ["R26", "5"]);

    codeBlocksFrom(line).forEach(block => {
        assertArrayIncludes(block.errors, [
            "Error: Without a device selected, it's not possible to determine which instructions are available"
        ]);
    });
    codeBlocksFrom(line).forEach(block => {
        assertEquals(0, block.errors.length, "repeated device errors");
    });
    codeBlocksFrom(line).forEach(block => {
        assertEquals(0, block.errors.length, "repeated device errors");
    });
});

Deno.test("Translation errors are ignored on first pass", () => {
    blankSlate();
    chooseDevice("dummy", {
        "programEnd": 4096,
        "unsupportedInstructions": []
    });
    const line = tokenLine("", "NOP", ["R2"]);

    startPass(1);
    codeBlocksFrom(line).forEach(block => {
        assertEquals(0, block.errors.length, "no errors on first pass");
    });

    startPass(2);
    codeBlocksFrom(line).forEach(block => {
        assertArrayIncludes(
            block.errors,
            ["Error: Incorrect number of operands - expecting none got R2"]
        );
    });
});
