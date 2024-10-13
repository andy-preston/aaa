import { assertEquals } from "assert";
import { translate } from "../generate/mod.ts";
import { startPass } from "../process/mod.ts";
import { tokenLine } from "../source-code/testing.ts";
import { type Tests, description } from "./testing.ts";

// The bytes for these tests were generated by the last version of GAVRAsm
// that I could get hold of.

const tests: Tests = [
    [["", "BREAK",  []], [0x95, 0x98]],
    [["", "NOP",    []], [0x00, 0x00]],
    [["", "RET",    []], [0x95, 0x08]],
    [["", "RETI",   []], [0x95, 0x18]],
    [["", "SLEEP",  []], [0x95, 0x88]],
    [["", "WDR",    []], [0x95, 0xa8]],
    [["", "IJMP",   []], [0x94, 0x09]],
    [["", "EIJMP",  []], [0x94, 0x19]],
    [["", "ICALL",  []], [0x95, 0x09]],
    [["", "EICALL", []], [0x95, 0x19]]
];

Deno.test("Implicit Code Generation", () => {
    startPass(2);
    for (const test of tests) {
        const line = tokenLine(...test[0]);
        assertEquals(translate(line), test[1], description(test));
    }
});
