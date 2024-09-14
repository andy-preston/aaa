import { assertEquals } from "assert";
import { createOurContext } from "../context/mod.ts";
import { generator } from "../generate/mod.ts";

Deno.test("As code is generated, the flashOrg is incremented", () => {
    const context = createOurContext();
    const generate = generator(context);
    assertEquals(context.flashPos(), 0);
    generate(["INC", ["R5"]]);
    assertEquals(context.flashPos(), 1);
    generate(["MOV", ["R5", "R6"]]);
    assertEquals(context.flashPos(), 2);
});

Deno.test("flashOrg can be set from the context i.e. by embedded JS", () => {
    const context = createOurContext();
    const generate = generator(context);
    assertEquals(context.flashPos(), 0);
    generate(["INC", ["R5"]]);
    assertEquals(context.flashPos(), 1);
    context.theirs.flashOrg = 100;
    generate(["MOV", ["R5", "R6"]]);
    assertEquals(context.flashPos(), 101);
});
