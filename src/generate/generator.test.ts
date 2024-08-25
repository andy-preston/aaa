import { assertEquals } from "assert";
import { newContext } from "../context/mod.ts";
import { newGenerator } from "../generate/mod.ts";

Deno.test("As code is generated, the flashOrg is incremented", () => {
    const context = newContext();
    const generate = newGenerator(context);
    assertEquals(context.flashPos(), 0);
    generate(["", "INC", ["R5"]]);
    assertEquals(context.flashPos(), 1);
    generate(["", "MOV", ["R5", "R6"]]);
    assertEquals(context.flashPos(), 2);
});

Deno.test("Labels are saved at the current flashOrg", () => {
    const context = newContext();
    const generate = newGenerator(context);
    generate(["label1", "INC", ["R5"]]);
    assertEquals(context.bound.label1, 0);
    generate(["label2", "", []]);
    assertEquals(context.bound.label2, 1);
    generate(["label3", "MOV", ["R5", "R6"]]);
    assertEquals(context.bound.label3, 1);
    generate(["label4", "", []]);
    assertEquals(context.bound.label4, 2);
});

Deno.test("flashOrg can be set from the context i.e. by embedded JS", () => {
    const context = newContext();
    const generate = newGenerator(context);
    assertEquals(context.flashPos(), 0);
    generate(["", "INC", ["R5"]]);
    assertEquals(context.flashPos(), 1);
    context.bound.flashOrg = 100;
    generate(["label1", "MOV", ["R5", "R6"]]);
    assertEquals(context.bound.label1, 100);
    assertEquals(context.flashPos(), 101);
});
