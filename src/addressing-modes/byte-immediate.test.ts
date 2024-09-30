import { assertEquals } from "assert";
import { translate } from "../process/mod.ts";
import { type Tests, description } from "./testing.ts";
import { newContext } from "../context/mod.ts";
import { setPass } from "../operands/mod.ts";

// The bytes for these tests were generated by the last version of GAVRAsm
// that I could get hold of.

const tests: Tests = [
    [["CPI",  ["R16",    "0"]], [0x30, 0x00]],
    [["CPI",  ["R31",    "0"]], [0x30, 0xf0]],
    [["CPI",  ["R16",  "255"]], [0x3f, 0x0f]],
    [["CPI",  ["R19",   "53"]], [0x33, 0x35]],
    [["SBCI", ["R18",   "19"]], [0x41, 0x23]],
    [["SUBI", ["R17",   "47"]], [0x52, 0x1f]],
    [["ORI",  ["R17",   "86"]], [0x65, 0x16]],
    [["SBR",  ["R19",   "64"]], [0x64, 0x30]],
    [["ANDI", ["R20",    "6"]], [0x70, 0x46]],
    [["CBR",  ["R23",  "128"]], [0x77, 0x7f]],
    [["LDI",  ["R17",   "77"]], [0xe4, 0x1d]],
    [["LDI",  ["R17", "-128"]], [0xe8, 0x10]],
    [["LDI",  ["R19",  "255"]], [0xef, 0x3f]],
    [["SER",  ["R19"        ]], [0xef, 0x3f]]
];

Deno.test("Byte Immediate Code Generation", () => {
    newContext();
    setPass(2);
    for (const test of tests) {
        assertEquals(translate(test[0]), test[1], description(test));
    }
});
