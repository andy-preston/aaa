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
