import { assertEquals } from "assert";
import {
    chooseDevice,
    newContext,
    newDeviceChecker
} from "../context/mod.ts";
import { translate } from "../generate/mod.ts";
import { setPass } from "../operands/mod.ts";
import { type Tests, description} from "./testing.ts";

// The bytes for these tests were generated by the last version of GAVRAsm
// that I could get hold of.

const tests: Tests = [
    [["LDS", ["R30",  "1024"]], [0x91, 0xe0, 0x04, 0x00]],
    [["STS", ["4096", "R8"  ]], [0x92, 0x80, 0x10, 0x00]],
];

const reducedCoreTests: Tests = [
    [["LDS", ["R30", "120"]], [0xa7, 0xe8]],
    [["STS", ["126", "R18"]], [0xaf, 0x2e]]
];

Deno.test("Data Direct code generation", () => {
    newContext();
    newDeviceChecker();
    setPass(2);
    for (const test of tests) {
        assertEquals(translate(test[0]), test[1], description(test));
    }
});

Deno.test("Data Direct (Reduced Core) code generation", () => {
    newContext();
    newDeviceChecker();
    chooseDevice("dummy", { "reducedCore": true });
    setPass(2);
    for (const test of reducedCoreTests) {
        assertEquals(translate(test[0]), test[1], description(test));
    }
});
