import { assertEquals } from "assert";
import { newContext } from "../../context/mod.ts";
import { tokenLine } from "../../source-code/testing.ts";
import { newState } from "../../state/mod.ts";
import { translator } from "../translate.ts";
import { type Tests, description } from "./testing.ts";

const state = newState();
const translate = translator(state);

// The bytes for these tests were generated by the last version of GAVRAsm
// that I could get hold of.

const tests: Tests = [
    [["", "BLD",  ["R11", "1"]], [0xf8, 0xb1]],
    [["", "BST",  ["R12", "3"]], [0xfa, 0xc3]],
    [["", "SBRC", ["R20", "3"]], [0xfd, 0x43]],
    [["", "SBRS", ["R21", "6"]], [0xff, 0x56]]
];

Deno.test("Single Register Bit Code Generation", () => {
    newContext();
    state.pass.start(2);
    for (const test of tests) {
        const line = tokenLine(...test[0]);
        assertEquals(translate(line), test[1], description(test));
    }
});
