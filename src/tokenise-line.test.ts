import { assertEquals, assertThrows } from "assert";
import { tokeniseLine } from "./tokenise-line.ts";

Deno.test("Leading and trailing whitespace is discarded", () => {
    assertEquals(
        tokeniseLine("\tLDI R16, 23   "), ["", "LDI", "R16", "23"]
    );
});

Deno.test("Lines could be entirely blank", () => {
    assertEquals(
        tokeniseLine(""),
        ["", "", "", ""]
    );
});


Deno.test("multiple spaces are reduced to one space", () => {
    assertEquals(tokeniseLine("LDI     R16, \t 23"), ["", "LDI", "R16", "23"]);
});

Deno.test("Comments are stripped and discarded", () => {
    assertEquals(
        tokeniseLine("LDI R16, 23 ; Put 16 in R16"),
        ["", "LDI", "R16", "23"]
    );
});

Deno.test("A line could be just a comment", () => {
    assertEquals(
        tokeniseLine("; Just a comment"),
        ["", "", "", ""]
    );
});

Deno.test("A line containing a colon contains a label", () => {
    assertEquals(
        tokeniseLine("label: LDI R16, 23"),
        ["label", "LDI", "R16", "23"]
    );
});

Deno.test("A line can contain JUST a label", () => {
    assertEquals(
        tokeniseLine("label:"),
        ["label", "", "", ""]
    );
});

Deno.test("A label may not contain whitespace", () => {
    assertThrows(
        () => tokeniseLine("count bytes: LDI R16, 23"),
        SyntaxError,
        "Label must not contain whitespace"
    );
});

Deno.test("The mnemonic is separated from the operands by whitespace", () => {
    assertEquals(
        tokeniseLine("LDI R16, 23"),
        ["", "LDI", "R16", "23"]
    );
});

Deno.test("The operands are separated by a comma", () => {
    assertEquals(
        tokeniseLine("label: LDI R16, 23"),
        ["label", "LDI", "R16", "23"]
    );
});

Deno.test("Some instructions only have one operand", () => {
    assertEquals(
        tokeniseLine("label: INC R16"),
        ["label", "INC", "R16", ""]
    );
});

Deno.test("Some instructions only have no operands at all", () => {
    assertEquals(
        tokeniseLine("label: RETI"),
        ["label", "RETI", "", ""]
    );
});

Deno.test("Operands can contain whitespace and even be JS expressions", () => {
    assertEquals(
        tokeniseLine("label: LDI baseReg + n, n * 2"),
        ["label", "LDI", "baseReg + n", "n * 2"]
    );
});
});
