import { assertEquals, assertThrows } from "assert";
import { label, newContext } from "../context/mod.ts";
import { translate } from "../generate/mod.ts";
import {
    programMemoryOrigin, programMemoryBytes, startPass
} from "../process/mod.ts";
import { type Tests, description } from "./testing.ts";

// The bytes for these tests were generated by the last version of GAVRAsm
// that I could get hold of.

const tests: Tests = [
    [["CALL", ["branch"]], [0x94, 0x0e, 0x00, 0x00]],
    [["JMP",  ["branch"]], [0x94, 0x0c, 0x00, 0x00]]
];

Deno.test("Direct Program Code Generation", () => {
    newContext();
    programMemoryOrigin(0);
    label("branch");
    programMemoryOrigin(3);
    startPass(2);
    for (const test of tests) {
        assertEquals(translate(test[0]), test[1], description(test));
    }
});

Deno.test("A jump should not be beyond the end of program memory", () => {
    newContext();
    programMemoryOrigin(0);
    programMemoryBytes(0x2000);
    startPass(2);
    assertThrows(
        () => { translate(["JMP", ["0x1001"]]); },
        RangeError,
        "Operand out of range: should be within program memory 0 - 0x1000 not 0x1001"
    );
});
