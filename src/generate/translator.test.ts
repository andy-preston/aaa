import { assertEquals } from "assert";
import { createOurContext } from "../context/mod.ts";
import { translator } from "./translator.ts";

Deno.test("As code is generated, the programMemoryPos is incremented", () => {
    const context = createOurContext();
    const translate = translator(context);
    assertEquals(context.programMemoryPos, 0);
    translate(["INC", ["R5"]]);
    assertEquals(context.programMemoryPos, 1);
    translate(["MOV", ["R5", "R6"]]);
    assertEquals(context.programMemoryPos, 2);
});

Deno.test("programMemoryPos can be set from the context i.e. by embedded JS", () => {
    const context = createOurContext();
    const translate = translator(context);
    assertEquals(context.programMemoryPos, 0);
    translate(["INC", ["R5"]]);
    assertEquals(context.programMemoryPos, 1);
    context.programMemoryPos = 100;
    translate(["MOV", ["R5", "R6"]]);
    assertEquals(context.programMemoryPos, 101);
});
