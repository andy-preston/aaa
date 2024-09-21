import { assertEquals, assertThrows } from "assert";
import { createOurContext } from "../context/mod.ts";
import { sourceLine } from "./source-line.ts";
import { translator } from "../generate/mod.ts";

Deno.test("Labels are saved at the current programMemoryPos", () => {
    const context = createOurContext();
    context.device = "Imaginary";
    const source = sourceLine(context);
    const translate = translator(context);
    translate(source("label1: INC R5"));
    assertEquals(context.theirs.label1, 0);
    translate(source("label2:"));
    assertEquals(context.theirs.label2, 1);
    translate(source("label3: MOV R5, R6"));
    assertEquals(context.theirs.label3, 1);
    translate(source("label4:"));
    assertEquals(context.theirs.label4, 2);
});

Deno.test("Throws if attempt to assemble unavailable instruction", () => {
    const context = createOurContext();
    context.device = "Imaginary";
    context.unsupportedInstructions = ["ADIW"];
    const source = sourceLine(context);
    assertThrows(
        () => { source("ADIW"); },
        Error,
        "ADIW is not available on Imaginary"
    );
});

Deno.test("If no device is chosen, warn after the first assembly line", () => {
    const context = createOurContext();
    const source = sourceLine(context);
    source("");
    source("");
    assertThrows(
        () => { source("MOV R4, R5"); },
        Error,
        "No device selected"
    );
});

Deno.test("The instruction set chosen check is only executed once", () => {
    const context = createOurContext();
    const source = sourceLine(context);
    assertThrows(
        () => { source("MOV R4, R5"); },
        Error,
        "No device selected"
    );
    source("MOV R4, R5");
});
