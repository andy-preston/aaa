import { assertEquals, assertThrows } from "assert";
import { lineTokens } from "./tokens.ts";
import type { Line, RawSource } from "./line.ts";

const testLine = (assemblyLine: RawSource): Line => ({
    "filename": "",
    "lineNumber": 0,
    "rawLine": "",
    "assemblyLine": assemblyLine,
    "label": "",
    "mnemonic": "",
    "operands": []
});

Deno.test("Leading and trailing whitespace is discarded", () => {
    const line = testLine("\tLDI R16, 23   ");
    lineTokens(line);
    assertEquals(line.label, "");
    assertEquals(line.mnemonic, "LDI");
    assertEquals(line.operands, ["R16", "23"]);
});

Deno.test("Lines could be entirely blank", () => {
    const line = testLine("");
    lineTokens(line);
    assertEquals(line.label, "");
    assertEquals(line.mnemonic, "");
    assertEquals(line.operands, []);
});

Deno.test("Multiple spaces are reduced to one space", () => {
    const line = testLine("LDI     R16, \t 23");
    lineTokens(line);
    assertEquals(line.label, "");
    assertEquals(line.mnemonic, "LDI");
    assertEquals(line.operands, ["R16", "23"]);
});

Deno.test("Mnemonics are automatically converted to upper case", () => {
    const line = testLine("ldi R16, \t 23");
    lineTokens(line);
    assertEquals(line.label, "");
    assertEquals(line.mnemonic, "LDI");
    assertEquals(line.operands, ["R16", "23"]);
});

Deno.test("... but operands aren't", () => {
    const line = testLine("ldi r16, \t 23");
    lineTokens(line);
    assertEquals(line.label, "");
    assertEquals(line.mnemonic, "LDI");
    assertEquals(line.operands, ["r16", "23"]);
});

Deno.test("Comments are stripped and discarded", () => {
    const line = testLine("LDI R16, 23 ; Put 16 in R16");
    lineTokens(line);
    assertEquals(line.label, "");
    assertEquals(line.mnemonic, "LDI");
    assertEquals(line.operands, ["R16", "23"]);
});

Deno.test("A line could be just a comment", () => {
    const line = testLine("; Just a comment");
    lineTokens(line);
    assertEquals(line.label, "");
    assertEquals(line.mnemonic, "");
    assertEquals(line.operands, []);
});

Deno.test("A line containing a colon contains a label", () => {
    const line = testLine("label: LDI R16, 23");
    lineTokens(line);
    assertEquals(line.label, "label");
    assertEquals(line.mnemonic, "LDI");
    assertEquals(line.operands, ["R16", "23"]);
});

Deno.test("A line can contain JUST a label", () => {
    const line = testLine("label:");
    lineTokens(line);
    assertEquals(line.label, "label");
    assertEquals(line.mnemonic, "");
    assertEquals(line.operands, []);
});

Deno.test("A label may not contain whitespace", () => {
    const line = testLine("count bytes: LDI R16, 23");
    assertThrows(
        () => lineTokens(line),
        SyntaxError,
        "Label must not contain whitespace"
    );
});

Deno.test("The mnemonic is separated from the operands by whitespace", () => {
    const line = testLine("LDI R16, 23");
    lineTokens(line);
    assertEquals(line.label, "");
    assertEquals(line.mnemonic, "LDI");
    assertEquals(line.operands, ["R16", "23"]);
});

Deno.test("The operands are separated by a comma", () => {
    const line = testLine("label: LDI R16, 23");
    lineTokens(line);
    assertEquals(line.label, "label");
    assertEquals(line.mnemonic, "LDI");
    assertEquals(line.operands, ["R16", "23"]);
});

Deno.test("Some instructions only have one operand", () => {
    const line = testLine("label: INC R16");
    lineTokens(line);
    assertEquals(line.label, "label");
    assertEquals(line.mnemonic, "INC");
    assertEquals(line.operands, ["R16"]);
});

Deno.test("Some instructions only have no operands at all", () => {
    const line = testLine("label: RETI");
    lineTokens(line);
    assertEquals(line.label, "label");
    assertEquals(line.mnemonic, "RETI");
    assertEquals(line.operands, []);
});

Deno.test("Operands can contain whitespace and even be JS expressions", () => {
    const line = testLine("label: LDI baseReg + n, n * 2");
    lineTokens(line);
    assertEquals(line.label, "label");
    assertEquals(line.mnemonic, "LDI");
    assertEquals(line.operands, ["baseReg + n", "n * 2"]);
});

Deno.test("Z+q operands are tokenised as a 'Z+' and a q", () => {
    const loadLine = testLine("LDD R14, Z+23");
    lineTokens(loadLine);
    assertEquals(loadLine.label, "");
    assertEquals(loadLine.mnemonic, "LDD");
    assertEquals(loadLine.operands, ["R14", "Z+", "23"]);
    const storeLine = testLine("STD Z+0xa7, R17");
    lineTokens(storeLine);
    assertEquals(storeLine.label, "");
    assertEquals(storeLine.mnemonic, "STD");
    assertEquals(storeLine.operands, ["Z+", "0xa7", "R17"]);
});

Deno.test("Only one Z+q operand is allowed in an instruction", () => {
    const line = testLine("LDD Z+12, Z+13");
    assertThrows(
        () => lineTokens(line),
        SyntaxError,
        "An instruction can only have 1 index offset (Z+qq) operand"
    );
});
