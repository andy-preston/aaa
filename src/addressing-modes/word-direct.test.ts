import { createOurContext } from "../context/mod.ts";
import { generator } from "../generate/mod.ts";
import { type Tests, testing } from "./testing.ts";

// The bytes for these tests were generated by the last version of GAVRAsm
// that I could get hold of.

const tests: Tests = [
    [
        ["", "MOVW", ["R0", "R30"]],
        [0x0f, 0x01]
    ]
];

testing(tests, generator(createOurContext()));
