import { assertEquals, assertThrows } from "assert";
import { OperandRangeError } from "../../errors/errors.ts";
import { tokenLine } from "../../source-code/testing.ts";
import { newState } from "../../state/mod.ts";
import { translator } from "../translate.ts";
import { type Tests, description } from "./testing.ts";

// The bytes for these tests were generated by the last version of GAVRAsm
// that I could get hold of.

const tests: Tests = [
    [["", "RCALL", ["back"   ]], [0xdf, 0xfc]],
    [["", "RJMP",  ["back"   ]], [0xcf, 0xfb]],
    [["", "RCALL", ["forward"]], [0xd0, 0x04]],
    [["", "RJMP",  ["forward"]], [0xc0, 0x03]]
];

Deno.test("Relative Program Code Generation", () => {
    const state = newState();
    const translate = translator(state);
    state.pass.start(2);
    state.device.choose("dummy", { "programEnd": 16 * 1024 });
    state.context.property("back", 0);
    state.context.property("forward", 10);
    state.programMemory.origin(3);
    for (const test of tests) {
        const line = tokenLine(...test[0]);
        assertEquals(translate(line), test[1], description(test));
        state.programMemory.step(test[1]);
    }
});

Deno.test("Absolute address too high on RJMP instruction", () => {
    const state = newState();
    const translate = translator(state);
    state.pass.start(2);
    state.device.choose("dummy", { "programEnd": 16 * 1024 });
    assertThrows(
        () => translate(tokenLine("", "RJMP", ["0x1111"])),
        OperandRangeError,
        "Operand out of range: should be relative jump to 12 bit range (-2048 - 2047) not 0x1111"
    );
});

Deno.test("Absolute address too low on RCALL instruction", () => {
    const state = newState();
    const translate = translator(state);
    state.pass.start(2);
    state.device.choose("dummy", { "programEnd": 16 * 1024 });
    state.programMemory.origin(0x2000);
    assertThrows(
        () => translate(tokenLine("", "RCALL", ["0x500"])),
        OperandRangeError,
        "Operand out of range: should be relative jump to 12 bit range (-2048 - 2047) not 0x500"
    );
});
