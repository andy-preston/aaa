import { assertEquals } from "assert";
import { chooseDevice } from "../../context/mod.ts";
import { blankSlate } from "../../coupling/coupling.ts";
import { tokenLine } from "../../source-code/testing.ts";
import { newState } from "../../state/mod.ts";
import { translator } from "../translate.ts";
import { type Tests, description } from "./testing.ts";

const state = newState();
const translate = translator(state);

// The bytes for these tests were generated by the last version of GAVRAsm
// that I could get hold of.

const tests: Tests = [
    [["", "LDS", ["R30",  "1024"]], [0x91, 0xe0, 0x04, 0x00]],
    [["", "STS", ["4096", "R8"  ]], [0x92, 0x80, 0x10, 0x00]],
];

const reducedCoreTests: Tests = [
    [["", "LDS", ["R30", "120"]], [0xa7, 0xe8]],
    [["", "STS", ["126", "R18"]], [0xaf, 0x2e]]
];

Deno.test("Data Direct code generation", () => {
    blankSlate();
    chooseDevice("dummy", { "programEnd": 4096, "ramEnd": 4096 });
    state.pass.start(2);
    for (const test of tests) {
        const line = tokenLine(...test[0]);
        assertEquals(translate(line), test[1], description(test));
    }
});

Deno.test("Data Direct (Reduced Core) code generation", () => {
    blankSlate();
    chooseDevice("dummy", {
        "programEnd": 4096,
        "ramEnd": 128,
        "reducedCore": true
    });
    state.pass.start(2);
    for (const test of reducedCoreTests) {
        const line = tokenLine(...test[0]);
        assertEquals(translate(line), test[1], description(test));
    }
});
