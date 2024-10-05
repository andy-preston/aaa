import { assertArrayIncludes, assertEquals } from "assert";
import {
    chooseDevice,
    newContext,
    newDeviceChecker
} from "../context/mod.ts";
import { setUnsupportedInstructions } from "../generate/mod.ts";
import { startPass } from "./pass.ts";
import { newPokeBuffer } from "./poke-peek.ts";
import { process } from "./process.ts";

const setupTest = () => {
    newContext();
    newPokeBuffer();
    newDeviceChecker();
    setUnsupportedInstructions([]);
}

Deno.test("Returns error if attempt to assemble unavailable instruction", () => {
    setupTest();
    chooseDevice("dummy", { "unsupportedInstructions": ["ADIW"] });
    startPass(2);
    for (const [_address, _code, errors] of process("ADIW R26, 5")) {
        assertArrayIncludes(errors, ["Error: ADIW is not available on dummy"]);
    }
});

Deno.test("no unsupported instruction error on first pass", () => {
    setupTest();
    chooseDevice("dummy", { "unsupportedInstructions": ["ADIW"] });
    startPass(1);
    for (const [_address, _code, errors] of process("ADIW R26, 5")) {
        assertEquals(0, errors.length, "no error on first pass");
    }
});

Deno.test("If no device is chosen, warn after the first assembly line", () => {
    setupTest();
    startPass(2);
    for (const [_address, _code, errors] of process("")) {
        assertEquals(0, errors.length, "no error on blank line");
    }
    for (const [_address, _code, errors] of process("")) {
        assertEquals(0, errors.length, "no error on blank line");
    }
    for (const [_address, _code, errors] of process("ADIW R26, 5")) {
        assertArrayIncludes(errors, [
            "Error: Without a device selected, it's not possible to determine which instructions are available"
        ]);
    }
});

Deno.test("no device not chosen on first pass", () => {
    setupTest();
    startPass(1);
    for (const [_address, _code, errors] of process("ADIW R26, 5")) {
        assertEquals(0, errors.length, "no error on first pass");
    }
});

Deno.test("The device selection error is only shown once", () => {
    setupTest();
    startPass(2);
    for (const [_address, _code, errors] of process("ADIW R26, 5")) {
        assertArrayIncludes(errors, [
            "Error: Without a device selected, it's not possible to determine which instructions are available"
        ]);
    }
    for (const [_address, _code, errors] of process("ADIW R26, 5")) {
        assertEquals(0, errors.length, "repeated device errors");
    }
    for (const [_address, _code, errors] of process("ADIW R26, 5")) {
        assertEquals(0, errors.length, "repeated device errors");
    }
});

Deno.test("Translation errors are ignored on first pass", () => {
    setupTest();
    chooseDevice("dummy", {});
    startPass(1);
    for (const [_address, _code, errors] of process("NOP R2")) {
        assertEquals(0, errors.length, "no errors on first pass");
    }
    startPass(2);
    for (const [_address, _code, errors] of process("NOP R2")) {
        assertArrayIncludes(
            errors,
            ["Error: Incorrect number of operands - expecting none got R2"]
        );
    }
});
