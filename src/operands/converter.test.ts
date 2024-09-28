import { assertEquals, assertThrows } from "assert";
import { operandConverter } from "./converter.ts";
import { programMemoryOrigin } from "../context/program-memory.ts";
import { newContext } from "../context/context.ts";

Deno.test("Symbolic is only used for Check Count", () => {
    newContext();
    const converter = operandConverter();
    assertThrows(
        () => converter.numeric("symbolic", "anything"),
        Error,
        "Internal error: symbolic is only for checkCount"
    );
    assertThrows(
        () => converter.check("symbolic", "anything"),
        Error,
        "Internal error: symbolic is only for checkCount"
    );
    converter.checkCount(["A", "B"], ["symbolic", "symbolic"]);
});

Deno.test("Numeric operands must be integers", () => {
    newContext();
    const converter = operandConverter();
    assertEquals(converter.numeric("byte", "R10"), 10);
    assertEquals(converter.numeric("byte", "42"), 42);
    assertThrows(
        () => converter.numeric("byte", '"notANumber"'),
        TypeError,
        'Operand type: "notANumber" is not an integer'
    );
    assertThrows(
        () => converter.numeric("byte", "23.5"),
        TypeError,
        "Operand type: 23.5 is not an integer"
    );
});

Deno.test("Operands must be defined, at least on the second pass", () => {
    newContext();
    const converter = operandConverter();
    assertEquals(0, converter.numeric("byte", "notDefined"));
    converter.secondPass();
    assertThrows(
        () => converter.numeric("byte", "notDefined"),
        ReferenceError,
        "notDefined is not defined"
    );
});

Deno.test("A register should be between zero and 31", () => {
    newContext();
    const converter = operandConverter();
    assertEquals(converter.numeric("register", "R0"), 0);
    assertEquals(converter.numeric("register", "6"), 6);
    assertEquals(converter.numeric("register", "Z"), 30);
    assertEquals(converter.numeric("register", "R31"), 31);
    assertEquals(converter.numeric("register", "31"), 31);
    assertThrows(
        () => converter.numeric("register", "-10"),
        RangeError,
        "Operand out of range: should be register (R0 - R31) not -10"
    );
    assertThrows(
        () => converter.numeric("register", "42"),
        RangeError,
        "Operand out of range: should be register (R0 - R31) not 42"
    );
});

Deno.test("An immediate register should be 16-31 but converted to 0-15", () => {
    newContext();
    const converter = operandConverter();
    assertEquals(converter.numeric("immediateRegister", "Z"), 14);
    assertEquals(converter.numeric("immediateRegister", "R31"), 15);
    assertEquals(converter.numeric("immediateRegister", "31"), 15);
    assertThrows(
        () => converter.numeric("immediateRegister", "R0"),
        RangeError,
        "Operand out of range: should be immediate register (R16 - R31) not R0"
    );
    assertThrows(
        () => converter.numeric("immediateRegister", "42"),
        RangeError,
        "Operand out of range: should be immediate register (R16 - R31) not 42"
    );
});

Deno.test("A 'multiply register' should be 16-23 but converted to 0-7", () => {
    newContext();
    const converter = operandConverter();
    assertEquals(converter.numeric("multiplyRegister", "R20"), 4);
    assertEquals(converter.numeric("multiplyRegister", "22"), 6);
    assertThrows(
        () => converter.numeric("multiplyRegister", "R24"),
        RangeError,
        "Operand out of range: should be multiply register (R16 - R23) not R24"
    );
    assertThrows(
        () => converter.numeric("multiplyRegister", "15"),
        RangeError,
        "Operand out of range: should be multiply register (R16 - R23) not 15"
    );
});

Deno.test("A register pair should be R24:R25, R26:R27, R28:29, R30:R31", () => {
    newContext();
    const converter = operandConverter();
    assertEquals(converter.numeric("registerPair", "R24"), 0);
    assertEquals(converter.numeric("registerPair", "X"), 1);
    assertEquals(converter.numeric("registerPair", "Y"), 2);
    assertEquals(converter.numeric("registerPair", "Z"), 3);
    assertThrows(
        () => converter.numeric("registerPair", "R20"),
        RangeError,
        "Operand out of range: should be register pair (R24:R25, R26:R27, R28:29, R30:R31) not R20"
    );
    assertThrows(
        () => converter.numeric("registerPair", "200"),
        RangeError,
        "Operand out of range: should be register pair (R24:R25, R26:R27, R28:29, R30:R31) not 200"
    );
});

Deno.test("Any register pair is any even numbered register", () => {
    newContext();
    const converter = operandConverter();
    assertEquals(converter.numeric("anyRegisterPair", "R0"), 0);
    assertEquals(converter.numeric("anyRegisterPair", "R2"), 1);
    assertEquals(converter.numeric("anyRegisterPair", "R4"), 2);
    assertEquals(converter.numeric("anyRegisterPair", "R10"), 5);
    assertEquals(converter.numeric("anyRegisterPair", "R20"), 10);
    assertEquals(converter.numeric("anyRegisterPair", "R30"), 15);
    assertThrows(
        () => converter.numeric("anyRegisterPair", "R31"),
        RangeError,
        "Operand out of range: should be any register pair (R0:R1 - R30:R31) not R31"
    );
    assertThrows(
        () => converter.numeric("anyRegisterPair", "32"),
        RangeError,
        "Operand out of range: should be any register pair (R0:R1 - R30:R31) not 32"
    );
});

Deno.test("Some instructions require Z and no other register", () => {
    newContext();
    const converter = operandConverter();
    assertEquals(converter.numeric("z", "R30"), 30);
    assertEquals(converter.numeric("z", "Z"), 30);
    assertEquals(converter.numeric("z", "30"), 30);
    assertThrows(
        () => converter.numeric("z", "R31"),
        RangeError,
        "Operand out of range: should be Z Register only (R30:R31) not R31"
    );
    assertThrows(
        () => converter.numeric("z", "ZH"),
        RangeError,
        "Operand out of range: should be Z Register only (R30:R31) not ZH"
    );
    assertThrows(
        () => converter.numeric("z", "X"),
        RangeError,
        "Operand out of range: should be Z Register only (R30:R31) not X"
    );
});

Deno.test("A port is between 0x20 - 0x5F and is remapped to 0x3f", () => {
    const converter = operandConverter();
    assertEquals(converter.numeric("port", "0x20"), 0);
    assertEquals(converter.numeric("port", "0x5F"), 0x3f);
    assertThrows(
        () => converter.numeric("port", "10"),
        RangeError,
        "Operand out of range: should be Data memory mapped into IO space (0x20 - 0x5F) not 10"
    );
    assertThrows(
        () => converter.numeric("port", "-47"),
        RangeError,
        "Operand out of range: should be Data memory mapped into IO space (0x20 - 0x5F) not -47"
    );
    assertThrows(
        () => converter.numeric("port", "96"),
        RangeError,
        "Operand out of range: should be Data memory mapped into IO space (0x20 - 0x5F) not 96"
    );
});

Deno.test("6 bits is between 0 and 0x3F", () => {
    const converter = operandConverter();
    assertEquals(converter.numeric("sixBits", "0b111111"), 0x3f);
    assertEquals(converter.numeric("sixBits", "0x3e"), 0x3e);
    assertThrows(
        () => converter.numeric("sixBits", "0b1111111"),
        RangeError,
        "Operand out of range: should be six bit number (0 - 0x3F) not 0b1111111"
    );
    assertThrows(
        () => converter.numeric("sixBits", "0x40"),
        RangeError,
        "Operand out of range: should be six bit number (0 - 0x3F) not 0x40"
    );
});

Deno.test("A bit index is 0 - 7", () => {
    const converter = operandConverter();
    assertEquals(converter.numeric("bitIndex", "0"), 0);
    assertEquals(converter.numeric("bitIndex", "4"), 4);
    assertEquals(converter.numeric("bitIndex", "7"), 7);
    assertThrows(
        () => converter.numeric("bitIndex", "8"),
        RangeError,
        "Operand out of range: should be bit index (0 - 7) not 8"
    );
});

Deno.test("A byte can be -127 - 128 OR 0 - 255", () => {
    const converter = operandConverter();
    assertEquals(converter.numeric("byte", "-1"), 0xff);
    assertEquals(converter.numeric("byte", "255"), 0xff);
    assertEquals(converter.numeric("byte", "-128"), 128);
    assertEquals(converter.numeric("byte", "128"), 128);
    assertEquals(converter.numeric("byte", "0"), 0);
    assertThrows(
        () => converter.numeric("byte", "-129"),
        RangeError,
        "Operand out of range: should be byte (-127 - 128) or (0 - 0xFF) not -129"
    );
    assertThrows(
        () => converter.numeric("byte", "256"),
        RangeError,
        "Operand out of range: should be byte (-127 - 128) or (0 - 0xFF) not 256"
    );
});

Deno.test("A nybble should be between 0 and 0x0f", () => {
    const converter = operandConverter();
    assertEquals(converter.numeric("nybble", "0"), 0);
    assertEquals(converter.numeric("nybble", "6"), 6);
    assertEquals(converter.numeric("nybble", "15"), 15);
    assertThrows(
        () => converter.numeric("nybble", "17"),
        RangeError,
        "Operand out of range: should be nybble (0 - 0x0F) not 17"
    );
    assertThrows(
        () => converter.numeric("nybble", "-1"),
        RangeError,
        "Operand out of range: should be nybble (0 - 0x0F) not -1"
    );
});

Deno.test("An address is 0 - 0x3FFFFF", () => {
    const converter = operandConverter();
    assertEquals(converter.numeric("address", "0"), 0);
    assertEquals(converter.numeric("address", "0x3FFFFF"), 0x3fffff);
    assertThrows(
        () => converter.numeric("address", "-1"),
        RangeError,
        "Operand out of range: should be 22 bit address (0 - 0x3FFFFF) (4 Meg) not -1"
    );
    assertThrows(
        () => converter.numeric("address", "0x400000"),
        RangeError,
        "Operand out of range: should be 22 bit address (0 - 0x3FFFFF) (4 Meg) not 0x400000"
    );
});

Deno.test("A RAM address is 0 - 0xFFFF", () => {
    const converter = operandConverter();
    assertEquals(converter.numeric("16bitAddress", "0"), 0);
    assertEquals(converter.numeric("16bitAddress", "0xFFFF"), 0xffff);
    assertThrows(
        () => converter.numeric("16bitAddress", "-1"),
        RangeError,
        "Operand out of range: should be 16 bit RAM address (0 - 0xFFFF) (64 K) not -1"
    );
    assertThrows(
        () => converter.numeric("16bitAddress", "0x10000"),
        RangeError,
        "Operand out of range: should be 16 bit RAM address (0 - 0xFFFF) (64 K) not 0x10000"
    );
});

Deno.test("A 7 bit RAM address is 0 - 0x7F", () => {
    const converter = operandConverter();
    assertEquals(converter.numeric("7bitAddress", "0"), 0);
    assertEquals(converter.numeric("7bitAddress", "0x7F"), 0x7f);
    assertThrows(
        () => converter.numeric("7bitAddress", "-1"),
        RangeError,
        "Operand out of range: should be 7 bit RAM address (0 - 0x7F) (127 Bytes) not -1"
    );
    assertThrows(
        () => converter.numeric("7bitAddress", "0x80"),
        RangeError,
        "Operand out of range: should be 7 bit RAM address (0 - 0x7F) (127 Bytes) not 0x80"
    );
});

Deno.test("A relative jump is 0 - 4K after being adjusted from PC", () => {
    const converter = operandConverter();
    programMemoryOrigin(0);
    assertEquals(converter.numeric("relativeJump", "500"), 499);
    programMemoryOrigin(1010);
    assertEquals(converter.numeric("relativeJump", "1000"), 0x0fff - 10);
    programMemoryOrigin(0);
    assertThrows(
        () => converter.numeric("relativeJump", "-1"),
        RangeError,
        "Operand out of range: -1 should be a memory address not -1"
    );
    programMemoryOrigin(0);
    assertThrows(
        () => converter.numeric("relativeJump", "0x1111"),
        RangeError,
        "Operand out of range: should be relative jump to 12 bit range (-2048 - 2047) not 0x1111"
    );
});

Deno.test("A relative branch is 0 - 127 after being adjusted from PC", () => {
    const converter = operandConverter();
    programMemoryOrigin(0);
    assertEquals(converter.numeric("relativeBranch", "60"), 59);
    programMemoryOrigin(110);
    assertEquals(converter.numeric("relativeBranch", "100"), 127 - 10);
    programMemoryOrigin(0);
    assertThrows(
        () => converter.numeric("relativeBranch", "-1"),
        RangeError,
        "Operand out of range: -1 should be a memory address not -1"
    );
    programMemoryOrigin(0);
    assertThrows(
        () => converter.numeric("relativeBranch", "0x10000"),
        RangeError,
        "Operand out of range: 0x10000 should be a memory address not 65536"
    );
    programMemoryOrigin(0);
    assertThrows(
        () => converter.numeric("relativeBranch", "0x1111"),
        RangeError,
        "Operand out of range: should be relative branch to 7 bit range (-64 - 63) not 0x1111"
    );
});
