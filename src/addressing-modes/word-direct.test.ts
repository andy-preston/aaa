import { assertEquals } from "assert";
import { newContext } from "../context/mod.ts";
import { translate } from "../generate/mod.ts";
import { setPass } from "../operands/mod.ts";
import { type Tests, description} from "./testing.ts";

// The bytes for these tests were generated by the last version of GAVRAsm
// that I could get hold of.

const tests: Tests = [
    [["MOVW", ["R0", "R30"]], [0x01, 0x0f]]
];

Deno.test("Word Direct Code Generation", () => {
    newContext();
    setPass(2);
    for (const test of tests) {
        assertEquals(translate(test[0]), test[1], description(test));
    }
});
