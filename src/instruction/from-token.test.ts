import { assertEquals, assertThrows } from "assert";
import { tokenConverter } from "./from-token.ts";
import { newContext } from "../context/mod.ts";

const fromTokens = tokenConverter(newContext(0));

Deno.test("An implied-addressing instruction", () => {
    const [mnemonic, numericOperands, symbolicOperands] = fromTokens(["", "NOP", []]);
    assertEquals(mnemonic, "NOP");
    assertEquals(numericOperands, []);
    assertEquals(symbolicOperands, []);
});

Deno.test("A lower case instruction", () => {
    const [mnemonic, numericOperands, symbolicOperands] = fromTokens(["", "reti", []]);
    assertEquals(mnemonic, "RETI");
    assertEquals(numericOperands, []);
    assertEquals(symbolicOperands, []);
});

Deno.test("A single-register instruction with a numeric register", () => {
    const [mnemonic, numericOperands, symbolicOperands] = fromTokens(["", "DEC", ["12"]]);
    assertEquals(mnemonic, "DEC");
    assertEquals(numericOperands, [12]);
    assertEquals(symbolicOperands, ["12"]);
});

Deno.test("A two-register instruction with symbolic registers", () => {
    const [mnemonic, numericOperands, symbolicOperands] = fromTokens(["", "AND", ["R12", "ZL"]]);
    assertEquals(mnemonic, "AND");
    assertEquals(numericOperands, [12, 30]);
    assertEquals(symbolicOperands, ["R12", "ZL"]);
});

Deno.test("A simple javascript expression", () => {
    const [mnemonic, numericOperands, symbolicOperands] = fromTokens(["", "AND", ["R12", "0xF * 3"]]);
    assertEquals(mnemonic, "AND");
    assertEquals(numericOperands, [12, 45]);
    assertEquals(symbolicOperands, ["R12", "0xF * 3"]);
});

Deno.test("Bad JavaScript Syntax", () => {
    assertThrows(
        () => fromTokens(["", "JMP", ["dodgy+"]]),
        SyntaxError,
        "Unexpected end of input"
    );
});

Deno.test("An indexed auto-incrementing instruction", () => {
    const [mnemonic, numericOperands, symbolicOperands] = fromTokens(["", "LD", ["R16", "Y+"]]);
    assertEquals(mnemonic, "LD");
    assertEquals(numericOperands, [16, null]);
    assertEquals(symbolicOperands, ["R16", "Y+"]);
});

Deno.test("At this point, bad multiple index operations isn't an error", () => {
    const [mnemonic, numericOperands, symbolicOperands] = fromTokens(["", "LD", ["X+", "Y+"]]);
    assertEquals(mnemonic, "LD");
    assertEquals(numericOperands, [null, null]);
    assertEquals(symbolicOperands, ["X+", "Y+"]);
});

Deno.test("An indexed instruction with no +/-", () => {
    const [mnemonic, numericOperands, symbolicOperands] = fromTokens(["", "LD", ["R16", "Y"]]);
    assertEquals(mnemonic, "LD");
    assertEquals(numericOperands, [16, 28]);
    assertEquals(symbolicOperands, ["R16", "Y"]);
});

Deno.test("An indexed instruction with an offset", () => {
    const [mnemonic, numericOperands, symbolicOperands] = fromTokens(["", "LDD", ["R16", "Z+", "15"]]);
    assertEquals(mnemonic, "LDD");
    assertEquals(numericOperands, [16, null, 15]);
    assertEquals(symbolicOperands, ["R16", "Z+", "15"]);
});
