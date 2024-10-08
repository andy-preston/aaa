import { assertEquals } from "assert";
import { newContext } from "../context/mod.ts";
import { translate } from "../generate/mod.ts";
import { startPass } from "../process/mod.ts";
import { type Tests, description} from "./testing.ts";

// The bytes for these tests were generated by the last version of GAVRAsm
// that I could get hold of.

const tests: Tests = [
    [["IN",  ["R19", (53 + 0x20).toString()]], [0xb7, 0x35]],
    [["OUT", [(25 + 0x20).toString(), "R16"]], [0xbb, 0x09]]
];

Deno.test("IO Byte Code Generation", () => {
    newContext();
    startPass(2);
    for (const test of tests) {
        assertEquals(translate(test[0]), test[1], description(test));
    }
});
