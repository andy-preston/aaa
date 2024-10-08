import { assertEquals } from "assert";
import { chooseDevice, inContext } from "../context/mod.ts";
import { programMemoryAddress, programMemoryOrigin } from "./mod.ts";
import { startPass } from "./pass.ts";
import { process } from "./process.ts";
import { blankSlate } from "../coupling/coupling.ts";

Deno.test("As code is generated, the programMemoryPos is incremented", () => {
    blankSlate();
    chooseDevice("dummy", { "programEnd": 4096 });
    startPass(2);
    assertEquals(programMemoryAddress(), 0);
    for (const _ of process("INC R5")) { /* pass */ }
    assertEquals(programMemoryAddress(), 1);
    for (const _ of process("MOV R5, R6")) { /* pass */ }
    assertEquals(programMemoryAddress(), 2);
});

Deno.test("programMemoryOrigin can be set from the context i.e. by embedded JS", () => {
    blankSlate();
    chooseDevice("dummy", { "programEnd": 4096 });
    startPass(2);
    assertEquals(programMemoryAddress(), 0);
    for (const _ of process("INC R5")) { /* pass */ }
    assertEquals(programMemoryAddress(), 1);

    programMemoryOrigin(100);
    for (const _ of process("MOV R5, R6")) { /* pass */ }
    assertEquals(programMemoryAddress(), 101);
});

Deno.test("Labels are saved at the current programMemoryPos", () => {
    blankSlate();
    chooseDevice("dummy", { "programEnd": 4096 });
    startPass(2);
    for (const _ of process("label1: INC R5")) { /* pass */ }
    assertEquals(inContext("label1"), "0");
    for (const _ of process("label2:")) { /* pass */ }
    assertEquals(inContext("label2"), "1");
    for (const _ of process("label3: MOV R5, R6")) { /* pass */ }
    assertEquals(inContext("label3"), "1");
    for (const _ of process("label4:")) { /* pass */ }
    assertEquals(inContext("label4"), "2");
});
