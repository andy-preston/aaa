import { assertArrayIncludes, assertEquals } from "assert";
import { chooseDevice } from "../context/mod.ts";
import { startPass } from "./pass.ts";
import { process } from "./process.ts";
import { blankSlate } from "../coupling/coupling.ts";

Deno.test("Returns error if attempt to assemble unavailable instruction", () => {
    blankSlate();
    chooseDevice("dummy", {
        "programEnd": 4096,
        "unsupportedInstructions": ["multiply"]
    });
    startPass(2);
    for (const [_address, _code, errors] of process("MUL R26, R28")) {
        assertArrayIncludes(errors, ["Error: MUL is not available on dummy"]);
    }
});

Deno.test("no unsupported instruction error on first pass", () => {
    blankSlate();
    chooseDevice("dummy", {
        "programEnd": 4096,
        "unsupportedInstructions": ["multiply"]
    });
    startPass(1);
    for (const [_address, _code, errors] of process("MUL R26, R28")) {
        assertEquals(0, errors.length, "no error on first pass");
    }
});

Deno.test("If no device is chosen, warn after the first assembly line", () => {
    blankSlate();
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
    blankSlate();
    chooseDevice("dummy", {
        "programEnd": 4096,
        "unsupportedInstructions": []
    });
    startPass(1);
    for (const [_address, _code, errors] of process("ADIW R26, 5")) {
        assertEquals(0, errors.length, "no error on first pass");
    }
});

Deno.test("The device selection error is only shown once", () => {
    blankSlate();
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
    blankSlate();
    chooseDevice("dummy", {
        "programEnd": 4096,
        "unsupportedInstructions": []
    });
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
