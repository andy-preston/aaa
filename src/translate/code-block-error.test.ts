import { assertArrayIncludes, assertEquals } from "assert";
import { tokenLine } from "../source-code/testing.ts";
import { newState } from "../state/mod.ts";
import { codeBlockGenerator } from "./code-block.ts";

Deno.test("Returns error if attempt to assemble unavailable instruction", () => {
    const state = newState();
    const codeBlocksFrom = codeBlockGenerator(state);
    state.pass.start(2);
    state.device.choose("dummy", {
        "programEnd": 4096,
        "unsupportedInstructions": ["multiply"]
    });

    codeBlocksFrom(tokenLine("", "MUL", ["R26", "R28"])).forEach(block => {
        assertArrayIncludes(block.errors, [
            "UnsupportedInstruction: MUL is not available on dummy"
        ]);
    });
});

Deno.test("Returns error if attempt to assemble non-existant instruction", () => {
    const state = newState();
    const codeBlocksFrom = codeBlockGenerator(state);
    state.pass.start(2);
    state.device.choose("dummy", { "programEnd": 4096 });

    codeBlocksFrom(tokenLine("", "PLOP", ["R26", "R28"])).forEach(block => {
        assertArrayIncludes(block.errors, ["UnknownInstruction: PLOP"]);
    });
});

Deno.test("no unsupported instruction error on first pass", () => {
    const state = newState();
    const codeBlocksFrom = codeBlockGenerator(state);
    state.pass.start(1);
    state.device.choose("dummy", {
        "programEnd": 4096,
        "unsupportedInstructions": ["multiply"]
    });

    codeBlocksFrom(tokenLine("", "MUL", ["R26", "R28"])).forEach(block => {
        assertEquals(0, block.errors.length, "no error on first pass");
    });
});

Deno.test("If no device is chosen, warn after the first assembly line", () => {
    const state = newState();
    const codeBlocksFrom = codeBlockGenerator(state);
    state.pass.start(2);

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
    const state = newState();
    const codeBlocksFrom = codeBlockGenerator(state);
    state.pass.start(1);
    state.device.choose("dummy", {
        "programEnd": 4096,
        "unsupportedInstructions": []
    });
    codeBlocksFrom(tokenLine("", "ADIW", ["R26", "5"])).forEach(block => {
        assertEquals(0, block.errors.length, "no error on first pass");
    });
});

Deno.test("The device selection error is only shown once", () => {
    const state = newState();
    const codeBlocksFrom = codeBlockGenerator(state);
    state.pass.start(2);
    const line = tokenLine("", "ADIW", ["26", "5"]);

    codeBlocksFrom(line).forEach(block => {
        assertArrayIncludes(block.errors, [
            "Error: Without a device selected, it's not possible to determine which instructions are available"
        ]);
    });
    codeBlocksFrom(line).forEach(block => {
        assertEquals(0, block.errors.length, block.errors.join("\n"));
    });
    codeBlocksFrom(line).forEach(block => {
        assertEquals(0, block.errors.length, block.errors.join("\n"));
    });
});

Deno.test("Translation errors are ignored on first pass", () => {
    const state = newState();
    const codeBlocksFrom = codeBlockGenerator(state);
    state.device.choose("dummy", {
        "programEnd": 4096,
        "unsupportedInstructions": []
    });
    const line = tokenLine("", "NOP", ["R2"]);

    state.pass.start(1);
    codeBlocksFrom(line).forEach(block => {
        assertEquals(0, block.errors.length, "no errors on first pass");
    });

    state.pass.start(2);
    codeBlocksFrom(line).forEach(block => {
        assertArrayIncludes(
            block.errors,
            ["Error: Incorrect number of operands - expecting none got R2"]
        );
    });
});
