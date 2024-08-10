import { assertEquals, assertThrows } from "assert";
import { twosComplement } from "./transformations.ts";

Deno.test("Some valid values", () => {
    assertEquals(twosComplement(16, 8, true), 0b00010000);
    assertEquals(twosComplement(-8, 8, true), 0b11111000);
    assertEquals(twosComplement(1024, 16, true), 0b0000010000000000);
    assertEquals(twosComplement(-1024, 16, true), 0b1111110000000000);
});

Deno.test("Overflow", () => {
    assertThrows(
        () => twosComplement(16, 4, true),
        RangeError,
        "16 out of range - should be between -7 and 8"
    );
});

Deno.test("Underflow", () => {
    assertThrows(
        () => twosComplement(-8, 4, true),
        RangeError,
        "-8 out of range - should be between -7 and 8"
    );
});
