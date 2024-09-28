import { assertEquals } from "assert";
import { label, newContext } from "../context/context.ts";
import { programMemoryOrigin, translator } from "../generate/mod.ts";
import { operandConverter } from "../operands/mod.ts";
import { description, type Tests } from "./testing.ts";

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
    const translate = translator(operandConverter());
    for (const test of tests) {
        assertEquals(translate(test[0]), test[1], description(test));
    }
});
