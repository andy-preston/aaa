import { assertEquals } from "assert";
import { createOurContext } from "../context/mod.ts";
import { sourceLine } from "./source-line.ts";

Deno.test("Labels are saved at the current flashOrg", () => {
    const context = createOurContext();
    const source = sourceLine(context);
    source("label1: INC R5");
    assertEquals(context.theirs.label1, 0);
    source("label2:");
    assertEquals(context.theirs.label2, 1);
    source("label3: MOV R5, R6");
    assertEquals(context.theirs.label3, 1);
    source("label4:");
    assertEquals(context.theirs.label4, 2);
});