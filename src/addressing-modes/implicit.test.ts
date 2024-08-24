import { newContext } from "../context/mod.ts";
import { generator } from "../generate/mod.ts";
import { type Tests, testing } from "./testing.ts";

// The bytes for these tests were generated by the last version of GAVRAsm
// that I could get hold of.

const tests: Tests = [
    [
        ["", "BREAK", []],
        [0x98, 0x95]
    ],
    [
        ["", "NOP", []],
        [0, 0]
    ],
    [
        ["", "RET", []],
        [0x08, 0x95]
    ],
    [
        ["", "RETI", []],
        [0x18, 0x95]
    ],
    [
        ["", "SLEEP", []],
        [0x88, 0x95]
    ],
    [
        ["", "WDR", []],
        [0xa8, 0x95]
    ],
    [
        ["", "IJMP", []],
        [0x09, 0x94]
    ],
    [
        ["", "EIJMP", []],
        [0x19, 0x94]
    ],
    [
        ["", "ICALL", []],
        [0x09, 0x95]
    ],
    [
        ["", "EICALL", []],
        [0x19, 0x95]
    ]
];

testing(tests, generator(newContext()));
