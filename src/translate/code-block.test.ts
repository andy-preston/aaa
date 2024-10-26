import { assertEquals } from "assert";
import { tokenLine } from "../source-code/testing.ts";
import { newState } from "../state/mod.ts";
import { type CodeBlock, codeBlockGenerator } from "./code-block.ts";

const ignoredBlock = (_ : CodeBlock) => {};

Deno.test("As code is generated, the programMemoryPos is incremented", () => {
    const state = newState();
    const codeBlocksFrom = codeBlockGenerator(state);
    state.pass.start(2);
    state.device.choose("dummy", {
        "programEnd": 4096,
        "reducedCore": false
    });
    assertEquals(state.programMemory.address(), 0);
    codeBlocksFrom(tokenLine("", "INC", ["R5"])).forEach(ignoredBlock);
    assertEquals(state.programMemory.address(), 1);
    codeBlocksFrom(tokenLine("", "MOV", ["R5", "R6"])).forEach(ignoredBlock);
    assertEquals(state.programMemory.address(), 2);
});

Deno.test("programMemoryOrigin can be set from the context i.e. by embedded JS", () => {
    const state = newState();
    const codeBlocksFrom = codeBlockGenerator(state);
    state.pass.start(2);
    state.device.choose("dummy", {
        "programEnd": 4096,
        "reducedCore": false
    });

    assertEquals(state.programMemory.address(), 0);
    codeBlocksFrom(tokenLine("", "INC", ["R5"])).forEach(ignoredBlock);
    assertEquals(state.programMemory.address(), 1);

    state.programMemory.origin(100);
    codeBlocksFrom(tokenLine("", "MOV", ["R5", "R6"])).forEach(ignoredBlock);
    assertEquals(state.programMemory.address(), 101);
});

Deno.test("Labels are saved at the current programMemoryPos", () => {
    const state = newState();
    const codeBlocksFrom = codeBlockGenerator(state);
    state.pass.start(2);
    state.device.choose("dummy", { "programEnd": 4096, "reducedCore": false });

    const assertLabelIs = (label: string, value: string) => {
        assertEquals(
            state.context.value(label),
            { "which": "value", "value": value }
        );
    };

    codeBlocksFrom(tokenLine("label1", "INC", ["R5"])).forEach(ignoredBlock);
    assertLabelIs("label1", "0");

    codeBlocksFrom(tokenLine("label2", "", [])).forEach(ignoredBlock);
    assertLabelIs("label2", "1");

    codeBlocksFrom(tokenLine("label3", "INC", ["R5"])).forEach(ignoredBlock);
    assertLabelIs("label3", "1");

    codeBlocksFrom(tokenLine("label4", "", [])).forEach(ignoredBlock);
    assertLabelIs("label4", "2");
});
