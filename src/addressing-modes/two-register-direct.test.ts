import { newContext } from "../context/mod.ts";
import { generator } from "../generate/mod.ts";
import { type Tests, testing } from "./testing.ts";

// The bytes for these tests were generated by the last version of GAVRAsm
// that I could get hold of.

const tests: Tests = [
    [["", "CPC", ["R17", "R18"]], [0x12, 0x07]],
    [["", "SBC", ["R20", "R2"]], [0x42, 0x09]],
    [["", "ADD", ["R3", "R4"]], [0x34, 0x0c]],
    [["", "LSL", ["R5"]], [0x55, 0x0c]],
    [["", "CPSE", ["R20", "R21"]], [0x45, 0x13]],
    [["", "CP", ["R15", "R16"]], [0xf0, 0x16]],
    [["", "SUB", ["R1", "R2"]], [0x12, 0x18]],
    [["", "ADC", ["R1", "R2"]], [0x12, 0x1c]],
    [["", "ROL", ["R20"]], [0x44, 0x1f]],
    [["", "AND", ["R7", "R8"]], [0x78, 0x20]],
    [["", "TST", ["R8"]], [0x88, 0x20]],
    [["", "EOR", ["R23", "R0"]], [0x70, 0x25]],
    [["", "CLR", ["R14"]], [0xee, 0x24]],
    [["", "OR", ["R12", "R13"]], [0xcd, 0x28]],
    [["", "MOV", ["R7", "R8"]], [0x78, 0x2c]],
    [["", "MUL", ["R8", "R16"]], [0x80, 0x9e]],
];

testing(tests, generator(newContext(0)));
