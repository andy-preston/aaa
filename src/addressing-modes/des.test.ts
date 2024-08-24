import { newContext } from "../context/mod.ts";
import { generator } from "../generate/mod.ts";
import { type Tests, testing } from "./testing.ts";

// The bytes for these tests were generated by the last version of GAVRAsm
// that I could get hold of.

const tests: Tests = [
    [
        ["", "DES", ["15"]],
        [0xfb, 0x94]
    ]
];

testing(tests, generator(newContext()));
