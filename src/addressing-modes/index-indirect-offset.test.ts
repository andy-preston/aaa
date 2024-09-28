import { assertEquals } from "assert";
import { newContext } from "../context/mod.ts";
import { translator } from "../generate/mod.ts";
import { setPass } from "../operands/mod.ts";
import { type Tests, description} from "./testing.ts";

// The bytes for these tests were generated by the last version of GAVRAsm
// that I could get hold of.

const tests: Tests = [
    [["LDD", ["R20", "Y+",  "8"]], [0x85, 0x48]],
    [["LDD", ["R24", "Z+",  "6"]], [0x81, 0x86]],
    [["STD", ["Y+",  "9",  "R6"]], [0x86, 0x69]],
    [["STD", ["Z+", "13", "R10"]], [0x86, 0xa5]]
];

Deno.test("Index Indirect Code Generation", () => {
    newContext();
    setPass(2);
    const translate = translator();
    for (const test of tests) {
        assertEquals(translate(test[0]), test[1], description(test));
    }
});
