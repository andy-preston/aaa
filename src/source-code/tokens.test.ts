import { assertEquals, assertThrows } from "assert";
import { lineTokens } from "./tokens.ts";

Deno.test("Leading and trailing whitespace is discarded", () => {
    const tokens = lineTokens("\tLDI R16, 23   ");
    assertEquals(tokens, ["", "LDI", ["R16", "23"]]);
});

Deno.test("Lines could be entirely blank", () => {
    const tokens = lineTokens("");
    assertEquals(tokens, ["", "", []]);
});

Deno.test("Multiple spaces are reduced to one space", () => {
    const tokens = lineTokens("LDI     R16, \t 23");
    assertEquals(tokens, ["", "LDI", ["R16", "23"]]);
});

Deno.test("Mnemonics are automatically converted to upper case", () => {
    const tokens = lineTokens("ldi R16, \t 23");
    assertEquals(tokens, ["", "LDI", ["R16", "23"]]);
});

Deno.test("... but operands aren't", () => {
    const tokens = lineTokens("ldi r16, \t 23");
    assertEquals(tokens, ["", "LDI", ["r16", "23"]]);
});

Deno.test("Comments are stripped and discarded", () => {
    const tokens = lineTokens("LDI R16, 23 ; Put 16 in R16");
    assertEquals(tokens, ["", "LDI", ["R16", "23"]]);
});

Deno.test("A line could be just a comment", () => {
    const tokens = lineTokens("; Just a comment");
    assertEquals(tokens, ["", "", []]);
});

Deno.test("A line containing a colon contains a label", () => {
    const tokens = lineTokens("label: LDI R16, 23");
    assertEquals(tokens, ["label", "LDI", ["R16", "23"]]);
});

Deno.test("A line can contain JUST a label", () => {
    const tokens = lineTokens("label:");
    assertEquals(tokens, ["label", "", []]);
});

Deno.test("A label may not contain whitespace", () => {
    assertThrows(
        () => lineTokens("count bytes: LDI R16, 23"),
        SyntaxError,
        "Label must not contain whitespace"
    );
});

Deno.test("The mnemonic is separated from the operands by whitespace", () => {
    const tokens = lineTokens("LDI R16, 23");
    assertEquals(tokens, ["", "LDI", ["R16", "23"]]);
});

Deno.test("The operands are separated by a comma", () => {
    const tokens = lineTokens("label: LDI R16, 23");
    assertEquals(tokens, ["label", "LDI", ["R16", "23"]]);
});

Deno.test("Some instructions only have one operand", () => {
    const tokens = lineTokens("label: INC R16");
    assertEquals(tokens, ["label", "INC", ["R16"]]);
});

Deno.test("Some instructions only have no operands at all", () => {
    const tokens = lineTokens("label: RETI");
    assertEquals(tokens, ["label", "RETI", []]);
});

Deno.test("Operands can contain whitespace and even be JS expressions", () => {
    const tokens = lineTokens("label: LDI baseReg + n, n * 2");
    assertEquals(tokens, ["label", "LDI", ["baseReg + n", "n * 2"]]);
});

Deno.test("Z+q operands are tokenised as a 'Z+' and a q", () => {
    const loadTokens = lineTokens("LDD R14, Z+23");
    assertEquals(loadTokens, ["", "LDD", ["R14", "Z+", "23"]]);
    const storeTokens = lineTokens("STD Z+0xa7, R17");
    assertEquals(storeTokens, ["", "STD", ["Z+", "0xa7", "R17"]]);
});

Deno.test("Only one Z+q operand is allowed in an instruction", () => {
    assertThrows(
        () => lineTokens("LDD Z+12, Z+13"),
        SyntaxError,
        "An instruction can only have 1 index offset (Z+qq) operand"
    );
});
