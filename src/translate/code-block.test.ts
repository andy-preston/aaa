import { assertEquals } from "assert";
import { chooseDevice, inContext } from "../context/mod.ts";
import { blankSlate } from "../coupling/coupling.ts";
import { tokenLine } from "../source-code/testing.ts";
import {
    programMemoryAddress,
    programMemoryOrigin,
    startPass
} from "../state/mod.ts";
import { type CodeBlock, codeBlocksFrom } from "./code-block.ts";

const ignoredBlock = (_ : CodeBlock) => {};

Deno.test("As code is generated, the programMemoryPos is incremented", () => {
    blankSlate();
    chooseDevice("dummy", { "programEnd": 4096 });
    startPass(2);

    assertEquals(programMemoryAddress(), 0);
    codeBlocksFrom(tokenLine("", "INC", ["R5"])).forEach(ignoredBlock);
    assertEquals(programMemoryAddress(), 1);
    codeBlocksFrom(tokenLine("", "MOV", ["R5", "R6"])).forEach(ignoredBlock);
    assertEquals(programMemoryAddress(), 2);
});

Deno.test("programMemoryOrigin can be set from the context i.e. by embedded JS", () => {
    blankSlate();
    chooseDevice("dummy", { "programEnd": 4096 });
    startPass(2);

    assertEquals(programMemoryAddress(), 0);
    codeBlocksFrom(tokenLine("", "INC", ["R5"])).forEach(ignoredBlock);
    assertEquals(programMemoryAddress(), 1);

    programMemoryOrigin(100);
    codeBlocksFrom(tokenLine("", "MOV", ["R5", "R6"])).forEach(ignoredBlock);
    assertEquals(programMemoryAddress(), 101);
});

Deno.test("Labels are saved at the current programMemoryPos", () => {
    blankSlate();
    chooseDevice("dummy", { "programEnd": 4096 });
    startPass(2);

    codeBlocksFrom(tokenLine("label1", "INC", ["R5"])).forEach(ignoredBlock);
    assertEquals(inContext("label1"), "0");

    codeBlocksFrom(tokenLine("label2", "", [])).forEach(ignoredBlock);
    assertEquals(inContext("label2"), "1");

    codeBlocksFrom(tokenLine("label3", "INC", ["R5"])).forEach(ignoredBlock);
    assertEquals(inContext("label3"), "1");

    codeBlocksFrom(tokenLine("label4", "", [])).forEach(ignoredBlock);
    assertEquals(inContext("label4"), "2");
});
