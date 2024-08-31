import { assertThrows } from "assert";
import { createOurContext } from "../context/mod.ts";
import { generator } from "../generate/mod.ts";
import { type Tests, testing } from "./testing.ts";

const generate = generator(createOurContext());

// The bytes for these tests were generated by the last version of GAVRAsm
// that I could get hold of.

const tests: Tests = [
    [
        ["", "LD", ["R14", "X"]],
        [0xec, 0x90]
    ],
    [
        ["", "LD", ["R15", "X+"]],
        [0xfd, 0x90]
    ],
    [
        ["", "LD", ["R16", "-X"]],
        [0x0e, 0x91]
    ],
    [
        ["", "LD", ["R17", "Y"]],
        [0x18, 0x81]
    ],
    [
        ["", "LD", ["R18", "Y+"]],
        [0x29, 0x91]
    ],
    [
        ["", "LD", ["R19", "-Y"]],
        [0x3a, 0x91]
    ],
    [
        ["", "LD", ["R21", "Z"]],
        [0x50, 0x81]
    ],
    [
        ["", "LD", ["R22", "Z+"]],
        [0x61, 0x91]
    ],
    [
        ["", "LD", ["R23", "-Z"]],
        [0x72, 0x91]
    ],
    [
        ["", "ST", ["X", "R0"]],
        [0x0c, 0x92]
    ],
    [
        ["", "ST", ["X+", "R1"]],
        [0x1d, 0x92]
    ],
    [
        ["", "ST", ["-X", "R2"]],
        [0x2e, 0x92]
    ],
    [
        ["", "ST", ["Y", "R3"]],
        [0x38, 0x82]
    ],
    [
        ["", "ST", ["Y+", "R4"]],
        [0x49, 0x92]
    ],
    [
        ["", "ST", ["-Y", "R5"]],
        [0x5a, 0x92]
    ],
    [
        ["", "ST", ["Z", "R7"]],
        [0x70, 0x82]
    ],
    [
        ["", "ST", ["Z+", "R8"]],
        [0x81, 0x92]
    ],
    [
        ["", "ST", ["-Z", "R9"]],
        [0x92, 0x92]
    ]
];

testing(tests, generate);

Deno.test("Bad symbolic operand for LD", () => {
    assertThrows(
        () => generate(["", "LD", ["R15", "-Q"]]),
        SyntaxError,
        "Operand out of range: index register should be Z, Z+, -Z, Y, Y+, -Y, X, X+, -X not -Q"
    );
});

Deno.test("Bad symbolic operand for ST", () => {
    assertThrows(
        () => generate(["", "ST", ["plop", "R16"]]),
        SyntaxError,
        "Operand out of range: index register should be Z, Z+, -Z, Y, Y+, -Y, X, X+, -X not plop"
    );
});
