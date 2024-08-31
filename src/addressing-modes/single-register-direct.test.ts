import { createOurContext } from "../context/mod.ts";
import { generator } from "../generate/mod.ts";
import { type Tests, testing } from "./testing.ts";

const generate = generator(createOurContext());

// The bytes for these tests were generated by the last version of GAVRAsm
// that I could get hold of.

const tests: Tests = [
    [
        ["", "POP", ["R6"]],
        [0x6f, 0x90]
    ],
    [
        ["", "PUSH", ["R7"]],
        [0x7f, 0x92]
    ],
    [
        ["", "LAC", ["Z", "R20"]],
        [0x46, 0x93]
    ],
    [
        ["", "LAS", ["Z", "R21"]],
        [0x55, 0x93]
    ],
    [
        ["", "LAT", ["Z", "R22"]],
        [0x67, 0x93]
    ],
    [
        ["", "COM", ["R14"]],
        [0xe0, 0x94]
    ],
    [
        ["", "DEC", ["R22"]],
        [0x6a, 0x95]
    ],
    [
        ["", "INC", ["R20"]],
        [0x43, 0x95]
    ],
    [
        ["", "LSR", ["R6"]],
        [0x66, 0x94]
    ],
    [
        ["", "ASR", ["R10"]],
        [0xa5, 0x94]
    ],
    [
        ["", "NEG", ["R11"]],
        [0xb1, 0x94]
    ],
    [
        ["", "SWAP", ["R7"]],
        [0x72, 0x94]
    ],
    [
        ["", "ROR", ["R19"]],
        [0x37, 0x95]
    ],
    [
        ["", "XCH", ["Z", "R15"]],
        [0xf4, 0x92]
    ]
];

testing(tests, generate);
