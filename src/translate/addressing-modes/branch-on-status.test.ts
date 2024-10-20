import { assertEquals, assertThrows } from "assert";
import { OperandRangeError } from "../../errors/errors.ts";
import { tokenLine } from "../../source-code/testing.ts";
import { newState } from "../../state/mod.ts";
import { translator } from "../translate.ts";
import { description, type Tests } from "./testing.ts";

// The bytes for these tests were generated by the last version of GAVRAsm
// that I could get hold of.

const tests: Tests = [
    [["", "BRBC", ["5", "back"   ]], [0xf7, 0xe5]],
    [["", "BRBC", ["4", "forward"]], [0xf5, 0x4c]],
    [["", "BRBS", ["3", "back"   ]], [0xf3, 0xd3]],
    [["", "BRBS", ["2", "forward"]], [0xf1, 0x3a]],
    [["", "BRCC", [     "back"   ]], [0xf7, 0xc0]],
    [["", "BRCC", [     "forward"]], [0xf5, 0x28]],
    [["", "BRCS", [     "back"   ]], [0xf3, 0xb0]],
    [["", "BRCS", [     "forward"]], [0xf1, 0x18]],
    [["", "BREQ", [     "back"   ]], [0xf3, 0xa1]],
    [["", "BREQ", [     "forward"]], [0xf1, 0x09]],
    [["", "BRGE", [     "back"   ]], [0xf7, 0x94]],
    [["", "BRGE", [     "forward"]], [0xf4, 0xfc]],
    [["", "BRHC", [     "back"   ]], [0xf7, 0x85]],
    [["", "BRHC", [     "forward"]], [0xf4, 0xed]],
    [["", "BRHS", [     "back"   ]], [0xf3, 0x75]],
    [["", "BRHS", [     "forward"]], [0xf0, 0xdd]],
    [["", "BRID", [     "back"   ]], [0xf7, 0x67]],
    [["", "BRID", [     "forward"]], [0xf4, 0xcf]],
    [["", "BRIE", [     "back"   ]], [0xf3, 0x57]],
    [["", "BRIE", [     "forward"]], [0xf0, 0xbf]],
    [["", "BRLO", [     "back"   ]], [0xf3, 0x40]],
    [["", "BRLO", [     "forward"]], [0xf0, 0xa8]],
    [["", "BRLT", [     "back"   ]], [0xf3, 0x34]],
    [["", "BRLT", [     "forward"]], [0xf0, 0x9c]],
    [["", "BRMI", [     "back"   ]], [0xf3, 0x22]],
    [["", "BRMI", [     "forward"]], [0xf0, 0x8a]],
    [["", "BRNE", [     "back"   ]], [0xf7, 0x11]],
    [["", "BRNE", [     "forward"]], [0xf4, 0x79]],
    [["", "BRPL", [     "back"   ]], [0xf7, 0x02]],
    [["", "BRPL", [     "forward"]], [0xf4, 0x6a]],
    [["", "BRSH", [     "back"   ]], [0xf6, 0xf0]],
    [["", "BRSH", [     "forward"]], [0xf4, 0x58]],
    [["", "BRTC", [     "back"   ]], [0xf6, 0xe6]],
    [["", "BRTC", [     "forward"]], [0xf4, 0x4e]],
    [["", "BRTS", [     "back"   ]], [0xf2, 0xd6]],
    [["", "BRTS", [     "forward"]], [0xf0, 0x3e]],
    [["", "BRVC", [     "back"   ]], [0xf6, 0xc3]],
    [["", "BRVC", [     "forward"]], [0xf4, 0x2b]],
    [["", "BRVS", [     "back"   ]], [0xf2, 0xb3]],
    [["", "BRVS", [     "forward"]], [0xf0, 0x1b]]
];

Deno.test("Branch on status code generation", () => {
    const state = newState();
    const translate = translator(state);
    state.device.choose("dummy", { "programEnd": 4096 });
    state.pass.start(2);
    state.context.property("back", 0x0000);
    state.context.property("forward", 0x002e);
    state.programMemory.origin(3);
    for (const test of tests) {
        const line = tokenLine(...test[0]);
        assertEquals(translate(line), test[1], description(test));
        state.programMemory.step(test[1]);
    }
});

Deno.test("Absolute address out of relative range on BRNE instruction", () => {
    const state = newState();
    const translate = translator(state);
    state.device.choose("dummy", { "programEnd": 4096 });
    state.pass.start(2);
    state.programMemory.origin(0);
    assertThrows(
        () => translate(tokenLine("", "BRNE", ["130"])),
        OperandRangeError,
        "Operand out of range: should be relative branch to 7 bit range (-64 - 63) not 130"
    );
    state.programMemory.origin(500);
    state.pass.start(2);
    assertThrows(
        () => translate(tokenLine("", "BREQ", ["100"])),
        OperandRangeError,
        "Operand out of range: should be relative branch to 7 bit range (-64 - 63) not 100"
    );
});

Deno.test("Absolute address outside available program memory", () => {
    const state = newState();
    const translate = translator(state);
    state.pass.start(2);
    state.device.choose("dummy", { "programEnd": 0x40 });
    assertThrows(
        () => translate(tokenLine("", "BRNE", ["0x23"])),
        OperandRangeError,
        "Operand out of range: should be within program memory 0 - 0x20 not 0x23"
    );
});

Deno.test("Absolute target of branch can't be below 0", () => {
    const state = newState();
    const translate = translator(state);
    state.pass.start(2);
    state.device.choose("dummy", { "programEnd": 0x40 });
    assertThrows(
        () => translate(tokenLine("", "BREQ", ["-1"])),
        OperandRangeError,
        "Operand out of range: should be relative branch to 7 bit range (-64 - 63) not -1"
    );
});
