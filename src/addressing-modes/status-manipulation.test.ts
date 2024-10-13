import { assertEquals } from "assert";
import { translate } from "../generate/mod.ts";
import { startPass } from "../state/mod.ts";
import { tokenLine } from "../source-code/testing.ts";
import { type Tests, description } from "./testing.ts";

// The bytes for these tests were generated by the last version of GAVRAsm
// that I could get hold of.

const tests: Tests = [
    [["", "BCLR", ["7"]], [0x94, 0xf8]],
    [["", "CLC",  [   ]], [0x94, 0x88]],
    [["", "CLH",  [   ]], [0x94, 0xd8]],
    [["", "CLI",  [   ]], [0x94, 0xf8]],
    [["", "CLN",  [   ]], [0x94, 0xa8]],
    [["", "CLS",  [   ]], [0x94, 0xc8]],
    [["", "CLT",  [   ]], [0x94, 0xe8]],
    [["", "CLV",  [   ]], [0x94, 0xb8]],
    [["", "CLZ",  [   ]], [0x94, 0x98]],
    [["", "BSET", ["1"]], [0x94, 0x18]],
    [["", "SEC",  [   ]], [0x94, 0x08]],
    [["", "SEH",  [   ]], [0x94, 0x58]],
    [["", "SEI",  [   ]], [0x94, 0x78]],
    [["", "SEN",  [   ]], [0x94, 0x28]],
    [["", "SES",  [   ]], [0x94, 0x48]],
    [["", "SET",  [   ]], [0x94, 0x68]],
    [["", "SEV",  [   ]], [0x94, 0x38]],
    [["", "SEZ",  [   ]], [0x94, 0x18]]
];

Deno.test("Status Manipulation Code Generation", () => {
    startPass(2);
    for (const test of tests) {
        const line = tokenLine(...test[0]);
        assertEquals(translate(line), test[1], description(test));
    }
});
