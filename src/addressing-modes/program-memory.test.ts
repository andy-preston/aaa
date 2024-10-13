import { assertEquals, assertThrows } from "assert";
import { newContext } from "../context/mod.ts";
import { translate } from "../generate/mod.ts";
import { startPass } from "../state/mod.ts";
import { type TestTokens, tokenLine } from "../source-code/testing.ts";
import { type Tests, description } from "./testing.ts";

// The bytes for these tests were generated by the last version of GAVRAsm
// that I could get hold of.

const tests: Tests = [
    [["", "SPM",  [           ]], [0x95, 0xe8]],
    [["", "SPM",  ["Z+"       ]], [0x95, 0xf8]],
    [["", "ELPM", [           ]], [0x95, 0xd8]],
    [["", "ELPM", ["R12", "Z" ]], [0x90, 0xc6]],
    [["", "ELPM", ["R12", "Z" ]], [0x90, 0xc6]],
    [["", "ELPM", ["R13", "Z+"]], [0x90, 0xd7]],
    [["", "LPM",  [           ]], [0x95, 0xc8]],
    [["", "LPM",  ["R25", "Z" ]], [0x91, 0x94]],
    [["", "LPM",  ["R26", "Z+"]], [0x91, 0xa5]]
];

Deno.test("Program Memory Code Generation", () => {
    newContext();
    startPass(2);
    for (const test of tests) {
        const line = tokenLine(...test[0])
        assertEquals(translate(line), test[1], description(test));
    }
});

const failingTests: Array<TestTokens> = [
    ["", "SPM", ["-X"]],
    ["", "SPM", ["6"]]
];

Deno.test("Program Memory (Bad Syntax) Code Generation", () => {
    newContext();
    startPass(2);
    for (const test of failingTests) {
        assertThrows(
            () => translate(tokenLine(...test)),
            SyntaxError,
            "Can only have either no operands or Z+"
        );
    }
});
