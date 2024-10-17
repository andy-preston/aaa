import { assertEquals } from "assert";
import { tokenLine } from "../../source-code/testing.ts";
import { newState } from "../../state/mod.ts";
import { translator } from "../translate.ts";
import { type Tests, description } from "./testing.ts";

const state = newState();
const translate = translator(state);

// The bytes for these tests were generated by the last version of GAVRAsm
// that I could get hold of.

const tests: Tests = [
    [["", "CBI",  [(30 + 0x20).toString(), "1"]], [0x98, 0xf1]],
    [["", "SBI",  [(28 + 0x20).toString(), "5"]], [0x9a, 0xe5]],
    [["", "SBIC", [(29 + 0x20).toString(), "4"]], [0x99, 0xec]],
    [["", "SBIS", [(30 + 0x20).toString(), "3"]], [0x9b, 0xf3]]
];

Deno.test("IO Bit Code Generation", () => {
    state.pass.start(2);
    for (const test of tests) {
        const line = tokenLine(...test[0]);
        assertEquals(translate(line), test[1], description(test));
    }
});
