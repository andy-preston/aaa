import { assertEquals } from "assert";
import { newContext } from "../context/mod.ts";
import { translate } from "../generate/translate.ts";
import { startPass } from "../state/mod.ts";
import { tokenLine } from "../source-code/testing.ts";
import { type Tests, description } from "./testing.ts";

// The bytes for these tests were generated by the last version of GAVRAsm
// that I could get hold of.

const tests: Tests = [
    [["", "ADC",  ["R1",  "R2" ]], [0x1c, 0x12]],
    [["", "ADD",  ["R3",  "R4" ]], [0x0c, 0x34]],
    [["", "AND",  ["R7",  "R8" ]], [0x20, 0x78]],
    [["", "CLR",  ["R14"       ]], [0x24, 0xee]],
    [["", "CP",   ["R15", "R16"]], [0x16, 0xf0]],
    [["", "CPC",  ["R17", "R18"]], [0x07, 0x12]],
    [["", "CPSE", ["R20", "R21"]], [0x13, 0x45]],
    [["", "EOR",  ["R23", "R0" ]], [0x25, 0x70]],
    [["", "LSL",  ["R5"        ]], [0x0c, 0x55]],
    [["", "MOV",  ["R7",  "R8" ]], [0x2c, 0x78]],
    [["", "MUL",  ["R8",  "R16"]], [0x9e, 0x80]],
    [["", "OR",   ["R12", "R13"]], [0x28, 0xcd]],
    [["", "ROL",  ["R20"       ]], [0x1f, 0x44]],
    [["", "SBC",  ["R20", "R2" ]], [0x09, 0x42]],
    [["", "SUB",  ["R1",  "R2" ]], [0x18, 0x12]],
    [["", "TST",  ["R8"        ]], [0x20, 0x88]]
];

Deno.test("Two Register Direct Code Generation", () => {
    newContext();
    startPass(2);
    for (const test of tests) {
        const line = tokenLine(...test[0]);
        assertEquals(translate(line), test[1], description(test));
    }
});
