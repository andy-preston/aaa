import { assertEquals, assertThrows } from "assert";
import { littleEndian } from "../generate/mod.ts";
import { encoder } from "../generate/mod.ts";
import { newContext } from "../context/mod.ts";

const encode = encoder(newContext(0));

// The bytes for these tests were generated by the last version of GAVRAsm
// that I could get hold of.

const tests = [
    [["", "SPM"], [0xe8, 0x95]],
    [["", "SPM", "Z+"], [0xf8, 0x95]],
    [["", "ELPM"], [0xd8, 0x95]],
    [["", "ELPM", "R12", "Z"], [0xc6, 0x90]],
    [["", "ELPM", "R12", "Z"], [0xc6, 0x90]],
    [["", "ELPM", "R13", "Z+"], [0xd7, 0x90]],
    [["", "LPM"], [0xC8, 0x95]],
    [["", "LPM", "R25", "Z"], [0x94, 0x91]],
    [["", "LPM", "R26", "Z+"], [0xa5, 0x91]]
];

for (const test of tests) {
    const tokens = test[0] as Array<string>;
    const mnemonic = tokens[0];
    const operands = tokens.slice(1).join(", ");
    const description = operands ? operands : "no operands";
    Deno.test(`Basic code generation: ${mnemonic} with ${description}`, () => {
        assertEquals(littleEndian(encode(tokens)), test[1]);
    });
}

const failingTests = [
    ["", "SPM", "-X"],
    ["", "SPM", "6"]
];

for (const test of failingTests) {
    const tokens = test as Array<string>;
    const mnemonic = tokens[0];
    const operands = tokens.slice(1).join(", ");
    const description = operands ? operands : "no operands";
    Deno.test(`Bad syntax: ${mnemonic} with ${description}`, () => {
        assertThrows(
            () => encode(tokens),
            Error,
            "SPM can only have either no operands or Z+"
        );
    });
}
