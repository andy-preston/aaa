import { assertEquals } from "assert";
import { chooseDevice, inContext } from "../context/mod.ts";
import { blankSlate } from "../coupling/coupling.ts";
import { tokenLine } from "../source-code/testing.ts";
import {
    programMemoryAddress,
    programMemoryOrigin,
    startPass
} from "../state/mod.ts";
import { process } from "./process.ts";

Deno.test("As code is generated, the programMemoryPos is incremented", () => {
    blankSlate();
    chooseDevice("dummy", { "programEnd": 4096 });
    startPass(2);
    assertEquals(programMemoryAddress(), 0);
    const line1 = tokenLine("", "INC", ["R5"]);
    for (const _ of process(line1)) { /* pass */ }
    assertEquals(programMemoryAddress(), 1);
    const line2 = tokenLine("", "MOV", ["R5", "R6"]);
    for (const _ of process(line2)) { /* pass */ }
    assertEquals(programMemoryAddress(), 2);
});

Deno.test("programMemoryOrigin can be set from the context i.e. by embedded JS", () => {
    blankSlate();
    chooseDevice("dummy", { "programEnd": 4096 });
    startPass(2);
    assertEquals(programMemoryAddress(), 0);
    const line1 = tokenLine("", "INC", ["R5"]);
    for (const _ of process(line1)) { /* pass */ }
    assertEquals(programMemoryAddress(), 1);

    programMemoryOrigin(100);
    const line2 = tokenLine("", "MOV", ["R5", "R6"]);
    for (const _ of process(line2)) { /* pass */ }
    assertEquals(programMemoryAddress(), 101);
});

Deno.test("Labels are saved at the current programMemoryPos", () => {
    blankSlate();
    chooseDevice("dummy", { "programEnd": 4096 });
    startPass(2);
    const line1 = tokenLine("label1", "INC", ["R5"]);
    for (const _ of process(line1)) { /* pass */ }
    assertEquals(inContext("label1"), "0");
    const line2 = tokenLine("label2", "", []);
    for (const _ of process(line2)) { /* pass */ }
    assertEquals(inContext("label2"), "1");
    const line3 = tokenLine("label3", "MOV", ["R5", "R6"]);
    for (const _ of process(line3)) { /* pass */ }
    assertEquals(inContext("label3"), "1");
    const line4 = tokenLine("label4", "", []);
    for (const _ of process(line4)) { /* pass */ }
    assertEquals(inContext("label4"), "2");
});
