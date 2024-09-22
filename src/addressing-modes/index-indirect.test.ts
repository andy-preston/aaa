import { assertThrows } from "assert";
import { createOurContext } from "../context/mod.ts";
import { translator } from "../generate/mod.ts";
import { type Tests, testing } from "./testing.ts";
import { operandConverter } from "../operands/mod.ts";

// The bytes for these tests were generated by the last version of GAVRAsm
// that I could get hold of.

const tests: Tests = [
    [["LD", ["R14", "X" ]], [0x90, 0xec]],
    [["LD", ["R15", "X+"]], [0x90, 0xfd]],
    [["LD", ["R16", "-X"]], [0x91, 0x0e]],
    [["LD", ["R17", "Y" ]], [0x81, 0x18]],
    [["LD", ["R18", "Y+"]], [0x91, 0x29]],
    [["LD", ["R19", "-Y"]], [0x91, 0x3a]],
    [["LD", ["R21", "Z" ]], [0x81, 0x50]],
    [["LD", ["R22", "Z+"]], [0x91, 0x61]],
    [["LD", ["R23", "-Z"]], [0x91, 0x72]],
    [["ST", ["X",   "R0"]], [0x92, 0x0c]],
    [["ST", ["X+",  "R1"]], [0x92, 0x1d]],
    [["ST", ["-X",  "R2"]], [0x92, 0x2e]],
    [["ST", ["Y",   "R3"]], [0x82, 0x38]],
    [["ST", ["Y+",  "R4"]], [0x92, 0x49]],
    [["ST", ["-Y",  "R5"]], [0x92, 0x5a]],
    [["ST", ["Z",   "R7"]], [0x82, 0x70]],
    [["ST", ["Z+",  "R8"]], [0x92, 0x81]],
    [["ST", ["-Z",  "R9"]], [0x92, 0x92]]
];

testing(tests, createOurContext());

Deno.test("Bad symbolic operand for LD", () => {
    const context = createOurContext()
    const translate = translator(context, operandConverter(context));
    assertThrows(
        () => translate(["LD", ["R15", "-Q"]]),
        SyntaxError,
        "Operand out of range: index register should be Z, Z+, -Z, Y, Y+, -Y, X, X+, -X not -Q"
    );
});

Deno.test("Bad symbolic operand for ST", () => {
    const context = createOurContext()
    const translate = translator(context, operandConverter(context));
    assertThrows(
        () => translate(["ST", ["plop", "R16"]]),
        SyntaxError,
        "Operand out of range: index register should be Z, Z+, -Z, Y, Y+, -Y, X, X+, -X not plop"
    );
});
