import { assertEquals, assertThrows } from "assert";
import { fromTokens } from "./instruction.ts";
import { newContext } from "./context/mod.ts";

const context = newContext();

Deno.test("An implied-addressing instruction", () => {
    const instruction = fromTokens(context, ["NOP"]);
    assertEquals(instruction.mnemonic, "NOP");
    assertEquals(instruction.operands, []);
});

Deno.test("A lower case instruction", () => {
    const instruction = fromTokens(context, ["reti"]);
    assertEquals(instruction.mnemonic, "RETI");
    assertEquals(instruction.operands, []);
});

Deno.test("A single-register instruction with a numeric register", () => {
    const instruction = fromTokens(context, ["DEC", "12"]);
    assertEquals(instruction.mnemonic, "DEC");
    assertEquals(instruction.operands, [12]);
});

Deno.test("A two-register instruction with symbolic registers", () => {
    const instruction = fromTokens(context, ["AND", "R12", "ZL"]);
    assertEquals(instruction.mnemonic, "AND");
    assertEquals(instruction.operands, [12, 30]);
});

Deno.test("Bad JavaScript Syntax", () => {
    assertThrows(
        () => fromTokens(context, ["JMP", "dodgy+"]),
        SyntaxError,
        "Unexpected end of input"
    );
});

Deno.test("An indexed auto-incrementing instruction", () => {
    const instruction = fromTokens(context, ["LD", "R16", "Y+"]);
    assertEquals(instruction.mnemonic, "LD");
    assertEquals(instruction.operands, [16]);
    assertEquals(instruction.indexingOperand, "Y+");
});

Deno.test("Bad multiple indexing operations", () => {
    assertThrows(
        () => fromTokens(context, ["LD", "X+", "Y+"]),
        Error,
        "Y+ is invalid - instruction already has X+"
    );
});

Deno.test("An indexed instruction with no +/-", () => {
    const instruction = fromTokens(context, ["LD", "R16", "Y"]);
    assertEquals(instruction.mnemonic, "LD");
    assertEquals(instruction.operands, [16, 28]);
});
