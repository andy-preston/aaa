import { createOurContext } from "../context/mod.ts";
import { createGenerator } from "../generate/mod.ts";
import { type Tests, testing } from "./testing.ts";

// The bytes for these tests were generated by the last version of GAVRAsm
// that I could get hold of.

const tests: Tests = [
    [
        ["", "CBI", ["30", "1"]],
        [0xf1, 0x98]
    ],
    [
        ["", "SBI", ["28", "5"]],
        [0xe5, 0x9a]
    ],
    [
        ["", "SBIC", ["29", "4"]],
        [0xec, 0x99]
    ],
    [
        ["", "SBIS", ["30", "3"]],
        [0xf3, 0x9b]
    ]
];

testing(tests, createGenerator(createOurContext()));
