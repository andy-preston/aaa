import { assertEquals, assertThrows } from "assert";
import { newContext } from "../context/mod.ts";
import { operandConverter } from "./converter.ts";

const converter = operandConverter(newContext(0));

Deno.test("A register should be between zero and 31", () => {
    assertEquals(converter.numeric("register", "R0"), 0);
    assertEquals(converter.numeric("register", "6"), 6);
    assertEquals(converter.numeric("register", "Z"), 30);
    assertEquals(converter.numeric("register", "R31"), 31);
    assertEquals(converter.numeric("register", "31"), 31);
    assertThrows(
        () => converter.numeric("register", "-10"),
        RangeError,
        "Operand out of range - expecting register (R0 - R31) not -10"
    );
    assertThrows(
        () => converter.numeric("register", "42"),
        RangeError,
        "Operand out of range - expecting register (R0 - R31) not 42"
    );
});

Deno.test("An immediate register should be 16-31 but converted to 0-15", () => {
    assertEquals(converter.numeric("immediateRegister", "Z"), 14);
    assertEquals(converter.numeric("immediateRegister", "R31"), 15);
    assertEquals(converter.numeric("immediateRegister", "31"), 15);
    assertThrows(
        () => converter.numeric("immediateRegister", "R0"),
        RangeError,
        "Operand out of range - expecting immediate register (R16 - R31) not R0"
    );
    assertThrows(
        () => converter.numeric("immediateRegister", "42"),
        RangeError,
        "Operand out of range - expecting immediate register (R16 - R31) not 42"
    );
});

Deno.test("A 'multiply register' should be 16-23 but converted to 0-7", () => {
    assertEquals(converter.numeric("multiplyRegister", "R20"), 4);
    assertEquals(converter.numeric("multiplyRegister", "22"), 6);
    assertThrows(
        () => converter.numeric("multiplyRegister", "R24"),
        RangeError,
        "Operand out of range - expecting multiply register (R16 - R23) not R24"
    );
    assertThrows(
        () => converter.numeric("multiplyRegister", "15"),
        RangeError,
        "Operand out of range - expecting multiply register (R16 - R23) not 15"
    );
});

Deno.test("A register pair should be R24:R25, R26:R27, R28:29, R30:R31", () => {
    assertEquals(converter.numeric("registerPair", "R24"), 0);
    assertEquals(converter.numeric("registerPair", "X"), 1);
    assertEquals(converter.numeric("registerPair", "Y"), 2);
    assertEquals(converter.numeric("registerPair", "Z"), 3);
    assertThrows(
        () => converter.numeric("registerPair", "R20"),
        RangeError,
        "Operand out of range - expecting register pair (R24:R25, R26:R27, R28:29, R30:R31) not R20"
    );
    assertThrows(
        () => converter.numeric("registerPair", "200"),
        RangeError,
        "Operand out of range - expecting register pair (R24:R25, R26:R27, R28:29, R30:R31) not 200"
    );
});

Deno.test("Any register pair is any even numbered register", () => {
    assertEquals(converter.numeric("anyRegisterPair", "R0"), 0);
    assertEquals(converter.numeric("anyRegisterPair", "R2"), 1);
    assertEquals(converter.numeric("anyRegisterPair", "R4"), 2);
    assertEquals(converter.numeric("anyRegisterPair", "R10"), 5);
    assertEquals(converter.numeric("anyRegisterPair", "R20"), 10);
    assertEquals(converter.numeric("anyRegisterPair", "R30"), 15);
    assertThrows(
        () => converter.numeric("anyRegisterPair", "R31"),
        RangeError,
        "Operand out of range - expecting any register pair (R0:R1 - R30:R31) not R31"
    );
    assertThrows(
        () => converter.numeric("anyRegisterPair", "32"),
        RangeError,
        "Operand out of range - expecting any register pair (R0:R1 - R30:R31) not 32"
    );

});

Deno.test("Some instructions require Z and no other register", () => {
    assertEquals(converter.numeric("Z", "R30"), 30);
    assertEquals(converter.numeric("Z", "Z"), 30);
    assertEquals(converter.numeric("Z", "30"), 30);
    assertThrows(
        () => converter.numeric("Z", "R31"),
        RangeError,
        "Operand out of range - expecting Z Register only (R30:R31) not R31"
    );
    assertThrows(
        () => converter.numeric("Z", "ZH"),
        RangeError,
        "Operand out of range - expecting Z Register only (R30:R31) not ZH"
    );
    assertThrows(
        () => converter.numeric("Z", "X"),
        RangeError,
        "Operand out of range - expecting Z Register only (R30:R31) not X"
    );
});

Deno.test("A port is between 0 and 0x3F", () => {
    assertEquals(converter.numeric("port", "0"), 0);
    assertEquals(converter.numeric("port", "0x3F"), 63);
    assertThrows(
        () => converter.numeric("port", "-47"),
        RangeError,
        "Operand out of range - expecting GPIO port (0 - 0x3F) not -47"
    );
    assertThrows(
        () => converter.numeric("port", "64"),
        RangeError,
        "Operand out of range - expecting GPIO port (0 - 0x3F) not 64"
    );
});

Deno.test("6 bits is between 0 and 0x3F", () => {
    assertEquals(converter.numeric("sixBits", "0b111111"), 0x3f);
    assertEquals(converter.numeric("sixBits", "0x3e"), 0x3e);
    assertThrows(
        () => converter.numeric("sixBits", "0b1111111"),
        RangeError,
        "Operand out of range - expecting six bit number (0 - 0x3F) not 0b1111111"
    );
    assertThrows(
        () => converter.numeric("sixBits", "0x40"),
        RangeError,
        "Operand out of range - expecting six bit number (0 - 0x3F) not 0x40"
    );
});

Deno.test("A bit index is 0 - 7", () => {
    assertEquals(converter.numeric("bitIndex", "0"), 0);
    assertEquals(converter.numeric("bitIndex", "4"), 4);
    assertEquals(converter.numeric("bitIndex", "7"), 7);
    assertThrows(
        () => converter.numeric("bitIndex", "8"),
        RangeError,
        "Operand out of range - expecting bit index (0 - 7) not 8"
    );
});
