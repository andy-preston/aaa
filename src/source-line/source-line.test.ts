import { assertEquals, assertThrows } from "assert";
import { createOurContext } from "../context/mod.ts";
import { sourceLine } from "./source-line.ts";
import { generator } from "../generate/mod.ts";

Deno.test("Labels are saved at the current flashOrg", () => {
    const context = createOurContext();
    const source = sourceLine(context);
    const generate = generator(context);
    generate(source("label1: INC R5"));
    assertEquals(context.theirs.label1, 0);
    generate(source("label2:"));
    assertEquals(context.theirs.label2, 1);
    generate(source("label3: MOV R5, R6"));
    assertEquals(context.theirs.label3, 1);
    generate(source("label4:"));
    assertEquals(context.theirs.label4, 2);
});

Deno.test("Throws if attempt to assemble unavailable instruction", () => {
    const context = createOurContext();
    context.instructionSet.choose("AVRrc");
    assertEquals(context.instructionSet.name(), "AVRrc");
    const source = sourceLine(context);
    assertThrows(
        () => { source("ADIW"); },
        Error,
        "ADIW is not available on the AVRrc instruction set."
    );
});
