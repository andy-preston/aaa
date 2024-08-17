import { newContext } from "../context/mod.ts";
import { generator } from "../generate/mod.ts";
import { type Tests, testing } from "./testing.ts";

// The bytes for these tests were generated by the last version of GAVRAsm
// that I could get hold of.

const tests: Tests = [
    [
        ["", "CPI", ["R16", "0"]],
        [0x00, 0x30]
    ],
    [
        ["", "CPI", ["R31", "0"]],
        [0xf0, 0x30]
    ],
    [
        ["", "CPI", ["R16", "255"]],
        [0x0f, 0x3f]
    ],
    [
        ["", "CPI", ["R19", "53"]],
        [0x35, 0x33]
    ],
    [
        ["", "SBCI", ["R18", "19"]],
        [0x23, 0x41]
    ],
    [
        ["", "SUBI", ["R17", "47"]],
        [0x1f, 0x52]
    ],
    [
        ["", "ORI", ["R17", "86"]],
        [0x16, 0x65]
    ],
    [
        ["", "SBR", ["R19", "64"]],
        [0x30, 0x64]
    ],
    [
        ["", "ANDI", ["R20", "6"]],
        [0x46, 0x70]
    ],
    [
        ["", "CBR", ["R23", "128"]],
        [0x7f, 0x77]
    ],
    [
        ["", "LDI", ["R17", "77"]],
        [0x1d, 0xe4]
    ],
    [
        ["", "LDI", ["R19", "255"]],
        [0x3f, 0xef]
    ],
    [
        ["", "SER", ["R19"]],
        [0x3f, 0xef]
    ]
];

testing(tests, generator(newContext(0)));
