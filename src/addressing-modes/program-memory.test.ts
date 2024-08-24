import { assertThrows } from "assert";
import { newContext } from "../context/mod.ts";
import { newGenerator } from "../generate/mod.ts";
import type { Tokens } from "../tokens/tokens.ts";
import { type Tests, testDescription, testing } from "./testing.ts";

const generate = newGenerator(newContext());

// The bytes for these tests were generated by the last version of GAVRAsm
// that I could get hold of.

const tests: Tests = [
    [
        ["", "SPM", []],
        [0xe8, 0x95]
    ],
    [
        ["", "SPM", ["Z+"]],
        [0xf8, 0x95]
    ],
    [
        ["", "ELPM", []],
        [0xd8, 0x95]
    ],
    [
        ["", "ELPM", ["R12", "Z"]],
        [0xc6, 0x90]
    ],
    [
        ["", "ELPM", ["R12", "Z"]],
        [0xc6, 0x90]
    ],
    [
        ["", "ELPM", ["R13", "Z+"]],
        [0xd7, 0x90]
    ],
    [
        ["", "LPM", []],
        [0xc8, 0x95]
    ],
    [
        ["", "LPM", ["R25", "Z"]],
        [0x94, 0x91]
    ],
    [
        ["", "LPM", ["R26", "Z+"]],
        [0xa5, 0x91]
    ]
];

testing(tests, generate);

const failingTests: Array<Tokens> = [
    ["", "SPM", ["-X"]],
    ["", "SPM", ["6"]]
];

for (const test of failingTests) {
    Deno.test(`Bad syntax: ${testDescription(test)}`, () => {
        assertThrows(
            () => generate(test),
            SyntaxError,
            "Can only have either no operands or Z+"
        );
    });
}
