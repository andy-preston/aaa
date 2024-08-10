import { assertEquals, assertThrows } from "assert";
import { parseLine } from "./tokenise-line.ts";

Deno.test("Tokens are split by spaces and commas are discarded", () => {
    assertEquals(
        parseLine("LDI R16, 23"),
        ["LDI", "R16", "23"]
    )
});

Deno.test("The comma is still required after the first parameter", () => {
    assertThrows(
        () => parseLine("LDI R16 23"),
        Error,
        "Comma expected after first operand"
    );
});

Deno.test("Leading and trailing whitespace is discarded", () => {
    assertEquals(
        parseLine("\tLDI R16, 23   "), ["LDI", "R16", "23"]);
});

Deno.test("multiple spaces are reduced to one space", () => {
    assertEquals(parseLine("LDI  R16,\t23"), ["LDI", "R16", "23"]);
});

Deno.test("Comments are stripped and discarded", () => {
    assertEquals(
        parseLine("LDI R16, 23 ; Put 16 in R16"),
        ["LDI", "R16", "23"]
    );
});

Deno.test("Lines without comments are passed without carnage", () => {
    assertEquals(parseLine("LDI R16, 23"), ["LDI", "R16", "23"]);
});
