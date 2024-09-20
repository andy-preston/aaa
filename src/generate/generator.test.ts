import { assertEquals } from "assert";
import { createOurContext } from "../context/mod.ts";
import { generator } from "../generate/mod.ts";

Deno.test("As code is generated, the programMemoryPos is incremented", () => {
    const context = createOurContext();
    const generate = generator(context);
    assertEquals(context.programMemoryPos, 0);
    generate(["INC", ["R5"]]);
    assertEquals(context.programMemoryPos, 1);
    generate(["MOV", ["R5", "R6"]]);
    assertEquals(context.programMemoryPos, 2);
});

Deno.test("programMemoryPos can be set from the context i.e. by embedded JS", () => {
    const context = createOurContext();
    const generate = generator(context);
    assertEquals(context.programMemoryPos, 0);
    generate(["INC", ["R5"]]);
    assertEquals(context.programMemoryPos, 1);
    context.programMemoryPos = 100;
    generate(["MOV", ["R5", "R6"]]);
    assertEquals(context.programMemoryPos, 101);
});
