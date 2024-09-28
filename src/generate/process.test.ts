import { assert, assertEquals } from "assert";
import { chooseDevice } from "../context/mod.ts";
import { ProcessGenerator, processor } from "./process.ts";
import { pokeBuffer } from "./poke-buffer.ts";
import { operandConverter } from "../operands/mod.ts";
import { programMemoryAddress, programMemoryOrigin } from "../generate/mod.ts";
import { execute, newContext } from "../context/context.ts";
import { newDeviceChecker } from "../context/device.ts";

const processing = (line: string) => {
    const process = processor(
        operandConverter(),
        pokeBuffer().peek
    );
    chooseDevice("dummy", {});
    for (const _ of process(line)) {
        // pass
    }
};

const findError = (process: ProcessGenerator, line: string, error: string) => {
    for (const processed of process(line)) {
        if (processed[2].includes(error)) {
            return true;
        }
    }
    return false;
}

const noErrors = (process: ProcessGenerator, line: string) => {
    for (const processed of process(line)) {
        if (processed[2].length != 0) {
            return false;
        }
    }
    return true;
}

Deno.test("As code is generated, the programMemoryPos is incremented", () => {
    programMemoryOrigin(0);
    assertEquals(programMemoryAddress(), 0);
    processing("INC R5");
    assertEquals(programMemoryAddress(), 1);
    processing("MOV R5, R6");
    assertEquals(programMemoryAddress(), 2);
});

Deno.test("programMemoryOrigin can be set from the context i.e. by embedded JS", () => {
    programMemoryOrigin(0);
    assertEquals(programMemoryAddress(), 0);
    processing("INC R5");
    assertEquals(programMemoryAddress(), 1);

    programMemoryOrigin(100);
    processing("MOV R5, R6");
    assertEquals(programMemoryAddress(), 101);
});

Deno.test("Labels are saved at the current programMemoryPos", () => {
    newContext();
    programMemoryOrigin(0);
    processing("label1: INC R5");
    assertEquals(execute("label1"), "0");
    processing("label2:");
    assertEquals(execute("label2"), "1");
    processing("label3: MOV R5, R6");
    assertEquals(execute("label3"), "1");
    processing("label4:");
    assertEquals(execute("label4"), "2");
});

Deno.test("Returns error if attempt to assemble unavailable instruction", () => {
    newDeviceChecker();
    const process = processor(operandConverter(), pokeBuffer().peek);
    chooseDevice("dummy", { "unsupportedInstructions": ["ADIW"] });
    assert(findError(process, "ADIW R26, 5", "ADIW is not available on dummy"));
});

Deno.test("If no device is chosen, warn after the first assembly line", () => {
    const process = processor(operandConverter(), pokeBuffer().peek);
    assert(noErrors(process, ""), "no error on blank line");
    assert(noErrors(process, ""), "no error on blank line");
    assert(
        findError(process, "ADIW R26, 5", "No device selected"),
        "error on instruction line"
    );
});

Deno.test("The instruction set chosen check is only executed once", () => {
    const process = processor(operandConverter(), pokeBuffer().peek);
    assert(
        findError(process, "ADIW R26, 5", "No device selected"),
        "error on instruction line"
    );
    assert(noErrors(process, "ADIW R26, 5"), "no error on blank line");
    assert(noErrors(process, "ADIW R26, 5"), "no error on blank line");
});
