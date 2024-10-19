import { assertEquals } from "assert";
import { inContext } from "../context/mod.ts";
import { blankSlate } from "../coupling/coupling.ts";
import { tokenLine } from "../source-code/testing.ts";
import { newState } from "../state/mod.ts";
import { type CodeBlock, codeBlockGenerator } from "./code-block.ts";

const ignoredBlock = (_ : CodeBlock) => {};

Deno.test("As code is generated, the programMemoryPos is incremented", () => {
    const state = newState();
    const codeBlocksFrom = codeBlockGenerator(state);
    blankSlate();
    state.pass.start(2);
    state.device.choose("dummy", { "programEnd": 4096 });

    assertEquals(state.programMemory.address(), 0);
    codeBlocksFrom(tokenLine("", "INC", ["R5"])).forEach(ignoredBlock);
    assertEquals(state.programMemory.address(), 1);
    codeBlocksFrom(tokenLine("", "MOV", ["R5", "R6"])).forEach(ignoredBlock);
    assertEquals(state.programMemory.address(), 2);
});

Deno.test("programMemoryOrigin can be set from the context i.e. by embedded JS", () => {
    const state = newState();
    const codeBlocksFrom = codeBlockGenerator(state);
    blankSlate();
    state.pass.start(2);
    state.device.choose("dummy", { "programEnd": 4096 });

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
    blankSlate();
    state.pass.start(2);
    state.device.choose("dummy", { "programEnd": 4096 });

    codeBlocksFrom(tokenLine("label1", "INC", ["R5"])).forEach(ignoredBlock);
    assertEquals(inContext("label1"), "0");

    codeBlocksFrom(tokenLine("label2", "", [])).forEach(ignoredBlock);
    assertEquals(inContext("label2"), "1");

    codeBlocksFrom(tokenLine("label3", "INC", ["R5"])).forEach(ignoredBlock);
    assertEquals(inContext("label3"), "1");

    codeBlocksFrom(tokenLine("label4", "", [])).forEach(ignoredBlock);
    assertEquals(inContext("label4"), "2");
});
