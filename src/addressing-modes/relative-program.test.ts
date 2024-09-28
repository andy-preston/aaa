import { assertEquals, assertThrows } from "assert";
import { label, newContext } from "../context/mod.ts";
import {
    programMemoryOrigin,
    programMemoryStep,
    translator
} from "../generate/mod.ts";
import { type Tests, description} from "./testing.ts";
import { setPass } from "../operands/mod.ts";

// The bytes for these tests were generated by the last version of GAVRAsm
// that I could get hold of.

const tests: Tests = [
    [["RCALL", ["back"   ]], [0xdf, 0xfc]],
    [["RJMP",  ["back"   ]], [0xcf, 0xfb]],
    [["RCALL", ["forward"]], [0xd0, 0x04]],
    [["RJMP",  ["forward"]], [0xc0, 0x03]]
];

Deno.test("Relative Program Code Generation", () => {
    newContext();
    programMemoryOrigin(0);
    label("back");
    programMemoryOrigin(10);
    label("forward");
    programMemoryOrigin(3);
    setPass(2);
    const translate = translator();
    for (const test of tests) {
        assertEquals(translate(test[0]), test[1], description(test));
        programMemoryStep(test[1]);
    }
});

Deno.test("Absolute address too high on RJMP instruction", () => {
    newContext();
    programMemoryOrigin(0);
    setPass(2);
    const translate = translator();
    assertThrows(
        () => translate(["RJMP", ["0x1111"]]),
        RangeError,
        "Operand out of range: should be relative jump to 12 bit range (-2048 - 2047) not 0x1111"
    );
});

Deno.test("Absolute address too low on RCALL instruction", () => {
    newContext();
    programMemoryOrigin(0x2000);
    setPass(2);
    const translate = translator();
    assertThrows(
        () => translate(["RCALL", ["0x500"]]),
        RangeError,
        "Operand out of range: should be relative jump to 12 bit range (-2048 - 2047) not 0x500"
    );
});
