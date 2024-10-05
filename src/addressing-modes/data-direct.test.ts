import { assertEquals } from "assert";
import { chooseDevice } from "../context/mod.ts";
import { translate } from "../generate/mod.ts";
import { startPass } from "../process/mod.ts";
import { type Tests, description} from "./testing.ts";
import { blankSlate } from "../coupling/coupling.ts";

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
    blankSlate();
    chooseDevice("dummy", { "programEnd": 4096});
    startPass(2);
    for (const test of tests) {
        assertEquals(translate(test[0]), test[1], description(test));
    }
});

Deno.test("Data Direct (Reduced Core) code generation", () => {
    blankSlate();
    chooseDevice("dummy", { "programEnd": 4096, "reducedCore": true });
    startPass(2);
    for (const test of reducedCoreTests) {
        assertEquals(translate(test[0]), test[1], description(test));
    }
});
