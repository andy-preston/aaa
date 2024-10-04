import { assertEquals } from "assert";
import {
    chooseDevice,
    execute,
    newContext,
    newDeviceChecker
} from "../context/mod.ts";
import { programMemoryAddress, programMemoryOrigin } from "./mod.ts";
import { startPass } from "./pass.ts";
import { newPokeBuffer } from "./poke-peek.ts";
import { process } from "./process.ts";

const setupTest = () => {
    newContext();
    newPokeBuffer();
    newDeviceChecker();
    startPass(2);
}

Deno.test("As code is generated, the programMemoryPos is incremented", () => {
    setupTest();
    chooseDevice("dummy", {});
    assertEquals(programMemoryAddress(), 0);
    for (const _ of process("INC R5")) { /* pass */ }
    assertEquals(programMemoryAddress(), 1);
    for (const _ of process("MOV R5, R6")) { /* pass */ }
    assertEquals(programMemoryAddress(), 2);
});

Deno.test("programMemoryOrigin can be set from the context i.e. by embedded JS", () => {
    setupTest();
    chooseDevice("dummy", {});
    assertEquals(programMemoryAddress(), 0);
    for (const _ of process("INC R5")) { /* pass */ }
    assertEquals(programMemoryAddress(), 1);

    programMemoryOrigin(100);
    for (const _ of process("MOV R5, R6")) { /* pass */ }
    assertEquals(programMemoryAddress(), 101);
});

Deno.test("Labels are saved at the current programMemoryPos", () => {
    setupTest();
    chooseDevice("dummy", {});
    for (const _ of process("label1: INC R5")) { /* pass */ }
    assertEquals(execute("label1"), "0");
    for (const _ of process("label2:")) { /* pass */ }
    assertEquals(execute("label2"), "1");
    for (const _ of process("label3: MOV R5, R6")) { /* pass */ }
    assertEquals(execute("label3"), "1");
    for (const _ of process("label4:")) { /* pass */ }
    assertEquals(execute("label4"), "2");
});
