import { createOurContext } from "../context/mod.ts";
import { newGenerator } from "../generate/mod.ts";
import { type Tests, testing } from "./testing.ts";

const generate = newGenerator(createOurContext());

// The bytes for these tests were generated by the last version of GAVRAsm
// that I could get hold of.

const tests: Tests = [
    [
        ["", "BCLR", ["7"]],
        [0xf8, 0x94]
    ],
    [
        ["", "CLC", []],
        [0x88, 0x94]
    ],
    [
        ["", "CLH", []],
        [0xd8, 0x94]
    ],
    [
        ["", "CLI", []],
        [0xf8, 0x94]
    ],
    [
        ["", "CLN", []],
        [0xa8, 0x94]
    ],
    [
        ["", "CLS", []],
        [0xc8, 0x94]
    ],
    [
        ["", "CLT", []],
        [0xe8, 0x94]
    ],
    [
        ["", "CLV", []],
        [0xb8, 0x94]
    ],
    [
        ["", "CLZ", []],
        [0x98, 0x94]
    ],
    [
        ["", "BSET", ["1"]],
        [0x18, 0x94]
    ],
    [
        ["", "SEC", []],
        [0x08, 0x94]
    ],
    [
        ["", "SEH", []],
        [0x58, 0x94]
    ],
    [
        ["", "SEI", []],
        [0x78, 0x94]
    ],
    [
        ["", "SEN", []],
        [0x28, 0x94]
    ],
    [
        ["", "SES", []],
        [0x48, 0x94]
    ],
    [
        ["", "SET", []],
        [0x68, 0x94]
    ],
    [
        ["", "SEV", []],
        [0x38, 0x94]
    ],
    [
        ["", "SEZ", []],
        [0x18, 0x94]
    ]
];

testing(tests, generate);
