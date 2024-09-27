import { assert, assertEquals } from "assert";
import {
    type OurContext,
    createOurContext,
    theirContext
} from "../context/mod.ts";
import { ProcessGenerator, processor } from "./process.ts";
import { pokeBuffer } from "./poke-buffer.ts";
import { operandConverter } from "../operands/mod.ts";

const processing = (context: OurContext, line: string) => {
    context.device = "dummy";
    const process = processor(
        context,
        operandConverter(context),
        pokeBuffer().peek
    );
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
    const theirs = theirContext();
    const ours = createOurContext(theirs);
    assertEquals(ours.programMemoryPos, 0);
    processing(ours, "INC R5");
    assertEquals(ours.programMemoryPos, 1);
    processing(ours, "MOV R5, R6");
    assertEquals(ours.programMemoryPos, 2);
});

Deno.test("programMemoryPos can be set from the context i.e. by embedded JS", () => {
    const context = createOurContext(theirContext());
    assertEquals(context.programMemoryPos, 0);
    processing(context, "INC R5");
    assertEquals(context.programMemoryPos, 1);
    context.programMemoryPos = 100;
    processing(context, "MOV R5, R6");
    assertEquals(context.programMemoryPos, 101);
});

Deno.test("Labels are saved at the current programMemoryPos", () => {
    const context = createOurContext(theirContext());
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
    const theirs = theirContext()
    const ours = createOurContext(theirs);
    context.device = "dummy";
    context.unsupportedInstructions = ["ADIW"];
    const process = processor(
        ours,
        operandConverter(ours),
        pokeBuffer().peek
    );
    assert(findError(process, "ADIW R26, 5", "ADIW is not available on dummy"));
});

Deno.test("If no device is chosen, warn after the first assembly line", () => {
    const context = createOurContext(theirContext());
    const process = processor(
        context,
        operandConverter(context),
        pokeBuffer().peek
    );
    assert(noErrors(process, ""), "no error on blank line");
    assert(noErrors(process, ""), "no error on blank line");
    assert(
        findError(process, "ADIW R26, 5", "No device selected"),
        "error on instruction line"
    );
});

Deno.test("The instruction set chosen check is only executed once", () => {
    const context = createOurContext(theirContext());
    const process = processor(
        context,
        operandConverter(context),
        pokeBuffer().peek
    );
    assert(
        findError(process, "ADIW R26, 5", "No device selected"),
        "error on instruction line"
    );
    assert(noErrors(process, "ADIW R26, 5"), "no error on blank line");
    assert(noErrors(process, "ADIW R26, 5"), "no error on blank line");
});
