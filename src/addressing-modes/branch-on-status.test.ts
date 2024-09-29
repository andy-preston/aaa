import { assertEquals, assertThrows } from "assert";
import {
    programMemoryOrigin,
    programMemoryStep,
    translate
} from "../generate/mod.ts";
import { description, type Tests } from "./testing.ts";
import { setPass } from "../operands/mod.ts";
import { property, newContext } from "../context/mod.ts";

// The bytes for these tests were generated by the last version of GAVRAsm
// that I could get hold of.

const tests: Tests = [
    [["BRBC", ["5", "back"   ]], [0xf7, 0xe5]],
    [["BRBC", ["4", "forward"]], [0xf5, 0x4c]],
    [["BRBS", ["3", "back"   ]], [0xf3, 0xd3]],
    [["BRBS", ["2", "forward"]], [0xf1, 0x3a]],
    [["BRCC", [     "back"   ]], [0xf7, 0xc0]],
    [["BRCC", [     "forward"]], [0xf5, 0x28]],
    [["BRCS", [     "back"   ]], [0xf3, 0xb0]],
    [["BRCS", [     "forward"]], [0xf1, 0x18]],
    [["BREQ", [     "back"   ]], [0xf3, 0xa1]],
    [["BREQ", [     "forward"]], [0xf1, 0x09]],
    [["BRGE", [     "back"   ]], [0xf7, 0x94]],
    [["BRGE", [     "forward"]], [0xf4, 0xfc]],
    [["BRHC", [     "back"   ]], [0xf7, 0x85]],
    [["BRHC", [     "forward"]], [0xf4, 0xed]],
    [["BRHS", [     "back"   ]], [0xf3, 0x75]],
    [["BRHS", [     "forward"]], [0xf0, 0xdd]],
    [["BRID", [     "back"   ]], [0xf7, 0x67]],
    [["BRID", [     "forward"]], [0xf4, 0xcf]],
    [["BRIE", [     "back"   ]], [0xf3, 0x57]],
    [["BRIE", [     "forward"]], [0xf0, 0xbf]],
    [["BRLO", [     "back"   ]], [0xf3, 0x40]],
    [["BRLO", [     "forward"]], [0xf0, 0xa8]],
    [["BRLT", [     "back"   ]], [0xf3, 0x34]],
    [["BRLT", [     "forward"]], [0xf0, 0x9c]],
    [["BRMI", [     "back"   ]], [0xf3, 0x22]],
    [["BRMI", [     "forward"]], [0xf0, 0x8a]],
    [["BRNE", [     "back"   ]], [0xf7, 0x11]],
    [["BRNE", [     "forward"]], [0xf4, 0x79]],
    [["BRPL", [     "back"   ]], [0xf7, 0x02]],
    [["BRPL", [     "forward"]], [0xf4, 0x6a]],
    [["BRSH", [     "back"   ]], [0xf6, 0xf0]],
    [["BRSH", [     "forward"]], [0xf4, 0x58]],
    [["BRTC", [     "back"   ]], [0xf6, 0xe6]],
    [["BRTC", [     "forward"]], [0xf4, 0x4e]],
    [["BRTS", [     "back"   ]], [0xf2, 0xd6]],
    [["BRTS", [     "forward"]], [0xf0, 0x3e]],
    [["BRVC", [     "back"   ]], [0xf6, 0xc3]],
    [["BRVC", [     "forward"]], [0xf4, 0x2b]],
    [["BRVS", [     "back"   ]], [0xf2, 0xb3]],
    [["BRVS", [     "forward"]], [0xf0, 0x1b]]
];

Deno.test("Branch on status code generation", () => {
    newContext();
    property("back", 0x0000);
    property("forward", 0x002e);
    programMemoryOrigin(3);
    setPass(2);
    for (const test of tests) {
        assertEquals(translate(test[0]), test[1], description(test));
        programMemoryStep(test[1]);
    }
});

Deno.test("Absolute address too high on BRNE instruction", () => {
    programMemoryOrigin(0);
    setPass(2);
    assertThrows(
        () => translate(["BRNE", ["130"]]),
        RangeError,
        "Operand out of range: should be relative branch to 7 bit range (-64 - 63) not 130"
    );
});

Deno.test("Absolute address too low on BREQ instruction", () => {
    programMemoryOrigin(500);
    setPass(2);
    assertThrows(
        () => translate(["BREQ", ["100"]]),
        RangeError,
        "Operand out of range: should be relative branch to 7 bit range (-64 - 63) not 100"
    );
});
