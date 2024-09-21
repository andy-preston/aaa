import { assert, assertEquals } from "assert";
import { type OurContext, createOurContext } from "../context/mod.ts";
import { ProcessGenerator, processor } from "./process.ts";
import { pokeBuffer } from "./poke-buffer.ts";

const processing = (context: OurContext, line: string) => {
    context.device = "dummy";
    const process = processor(context, pokeBuffer().peek);
    for (const _ of process(line)) {
        // pass
    }
};

const findError = (process: ProcessGenerator, line: string, error: string) => {
    for (const processed of process(line)) {
        if (processed[2] == error) {
            return true;
        }
    }
    return false;
}

Deno.test("As code is generated, the programMemoryPos is incremented", () => {
    const context = createOurContext();
    assertEquals(context.programMemoryPos, 0);
    processing(context, "INC R5");
    assertEquals(context.programMemoryPos, 1);
    processing(context, "MOV R5, R6");
    assertEquals(context.programMemoryPos, 2);
});

Deno.test("programMemoryPos can be set from the context i.e. by embedded JS", () => {
    const context = createOurContext();
    assertEquals(context.programMemoryPos, 0);
    processing(context, "INC R5");
    assertEquals(context.programMemoryPos, 1);
    context.programMemoryPos = 100;
    processing(context, "MOV R5, R6");
    assertEquals(context.programMemoryPos, 101);
});

Deno.test("Labels are saved at the current programMemoryPos", () => {
    const context = createOurContext();
    assertEquals(context.programMemoryPos, 0);
    processing(context, "label1: INC R5");
    assertEquals(context.theirs.label1, 0);
    processing(context, "label2:");
    assertEquals(context.theirs.label2, 1);
    processing(context, "label3: MOV R5, R6");
    assertEquals(context.theirs.label3, 1);
    processing(context, "label4:");
    assertEquals(context.theirs.label4, 2);
});

Deno.test("Returns error if attempt to assemble unavailable instruction", () => {
    const context = createOurContext();
    context.device = "dummy";
    context.unsupportedInstructions = ["ADIW"];
    const process = processor(context, pokeBuffer().peek);
    assert(findError(process, "ADIW R26, 5", "ADIW is not available on dummy"));
});

Deno.test("If no device is chosen, warn after the first assembly line", () => {
    const context = createOurContext();
    const process = processor(context, pokeBuffer().peek);
    assert(findError(process, "", ""));
    assert(findError(process, "", ""));
    assert(findError(process, "ADIW R26, 5", "No device selected"));
});

Deno.test("The instruction set chosen check is only executed once", () => {
    const context = createOurContext();
    const process = processor(context, pokeBuffer().peek);
    assert(findError(process, "ADIW R26, 5", "No device selected"));
    assert(findError(process, "ADIW R26, 5", ""));
    assert(findError(process, "ADIW R26, 5", ""));
});
