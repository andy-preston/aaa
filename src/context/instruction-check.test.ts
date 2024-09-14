import { assert, assertFalse } from "assert";
import { instructionCheck } from "./instruction-check.ts";

Deno.test("The MUL instruction is not available in the AVR instruction set", () => {
    const check = instructionCheck();
    check.choose("AVR");
    assertFalse(check.available("MUL"));
});

Deno.test("The JMP instruction is available in the AVRe instruction set", () => {
    const check = instructionCheck();
    check.choose("AVRe");
    assert(check.available("JMP"));
});

Deno.test("If no instruction set is chosen, warn after a dodgy instruction is used", () => {
    const check = instructionCheck();
    check.available("ADIW");
    assert(check.notChosen());
});

Deno.test("If we do choose an instruction set, no warning is needed", () => {
    const check = instructionCheck();
    check.choose("AVR");
    check.available("ADIW");
    assertFalse(check.notChosen());
});

Deno.test("The instruction set chosen check is only executed once", () => {
    const check = instructionCheck();
    check.available("ADIW");
    assert(check.notChosen());
    assertFalse(check.notChosen());
});
