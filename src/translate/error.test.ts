import { assertArrayIncludes, assertEquals } from "assert";
import { chooseDevice } from "../context/mod.ts";
import { blankSlate } from "../coupling/coupling.ts";
import { tokenLine } from "../source-code/testing.ts";
import { startPass } from "../state/mod.ts";
import { process } from "./process.ts";

Deno.test("Returns error if attempt to assemble unavailable instruction", () => {
    blankSlate();
    chooseDevice("dummy", {
        "programEnd": 4096,
        "unsupportedInstructions": ["multiply"]
    });
    startPass(2);
    const line = tokenLine("", "MUL", ["R26", "R28"]);
    for (const block of process(line)) {
        assertArrayIncludes(block.errors, [
            "Error: MUL is not available on dummy"
        ]);
    }
});

Deno.test("no unsupported instruction error on first pass", () => {
    blankSlate();
    chooseDevice("dummy", {
        "programEnd": 4096,
        "unsupportedInstructions": ["multiply"]
    });
    startPass(1);
    const line = tokenLine("", "MUL", ["R26", "R28"]);
    for (const block of process(line)) {
        assertEquals(0, block.errors.length, "no error on first pass");
    }
});

Deno.test("If no device is chosen, warn after the first assembly line", () => {
    blankSlate();
    startPass(2);
    const blankLine = tokenLine("", "", []);
    for (const block of process(blankLine)) {
        assertEquals(0, block.errors.length, "no error on blank line");
    }
    for (const block of process(blankLine)) {
        assertEquals(0, block.errors.length, "no error on blank line");
    }
    const line = tokenLine("", "ADIW", ["R26", "5"]);
    for (const block of process(line)) {
        assertArrayIncludes(block.errors, [
            "Error: Without a device selected, it's not possible to determine which instructions are available"
        ]);
    }
});

Deno.test("no device not chosen on first pass", () => {
    blankSlate();
    chooseDevice("dummy", {
        "programEnd": 4096,
        "unsupportedInstructions": []
    });
    startPass(1);
    const line = tokenLine("", "ADIW", ["R26", "5"]);
    for (const block of process(line)) {
        assertEquals(0, block.errors.length, "no error on first pass");
    }
});

Deno.test("The device selection error is only shown once", () => {
    blankSlate();
    const line = tokenLine("", "ADIW", ["R26", "5"]);
    startPass(2);
    for (const block of process(line)) {
        assertArrayIncludes(block.errors, [
            "Error: Without a device selected, it's not possible to determine which instructions are available"
        ]);
    }
    for (const block of process(line)) {
        assertEquals(0, block.errors.length, "repeated device errors");
    }
    for (const block of process(line)) {
        assertEquals(0, block.errors.length, "repeated device errors");
    }
});

Deno.test("Translation errors are ignored on first pass", () => {
    blankSlate();
    chooseDevice("dummy", {
        "programEnd": 4096,
        "unsupportedInstructions": []
    });
    const line = tokenLine("", "NOP", ["R2"]);
    startPass(1);
    for (const block of process(line)) {
        assertEquals(0, block.errors.length, "no errors on first pass");
    }
    startPass(2);
    for (const block of process(line)) {
        assertArrayIncludes(
            block.errors,
            ["Error: Incorrect number of operands - expecting none got R2"]
        );
    }
});
