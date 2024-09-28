import { assertEquals, assertThrows } from "assert";
import {
    checkOperand,
    checkOperandCount,
    numericOperand,
    setPass
} from "./converter.ts";
import { newContext } from "../context/mod.ts";
import { programMemoryOrigin } from "../generate/mod.ts";

Deno.test("Symbolic is only used for Check Count", () => {
    newContext();
    setPass(2);
    assertThrows(
        () => numericOperand("symbolic", "anything"),
        Error,
        "Internal error: symbolic is only for checkCount"
    );
    assertThrows(
        () => checkOperand("symbolic", "anything"),
        Error,
        "Internal error: symbolic is only for checkCount"
    );
    checkOperandCount(["A", "B"], ["symbolic", "symbolic"]);
});

Deno.test("Numeric operands must be integers", () => {
    newContext();
    setPass(2);
    assertEquals(numericOperand("byte", "R10"), 10);
    assertEquals(numericOperand("byte", "42"), 42);
    assertThrows(
        () => numericOperand("byte", '"notANumber"'),
        TypeError,
        'Operand type: "notANumber" is not an integer'
    );
    assertThrows(
        () => numericOperand("byte", "23.5"),
        TypeError,
        "Operand type: 23.5 is not an integer"
    );
});

Deno.test("Operands must be defined, at least on the second pass", () => {
    newContext();
    setPass(1);
    assertEquals(0, numericOperand("byte", "notDefined"));
    setPass(2);
    assertThrows(
        () => numericOperand("byte", "notDefined"),
        ReferenceError,
        "notDefined is not defined"
    );
});

Deno.test("A register should be between zero and 31", () => {
    newContext();
    setPass(2);
    assertEquals(numericOperand("register", "R0"), 0);
    assertEquals(numericOperand("register", "6"), 6);
    assertEquals(numericOperand("register", "Z"), 30);
    assertEquals(numericOperand("register", "R31"), 31);
    assertEquals(numericOperand("register", "31"), 31);
    assertThrows(
        () => numericOperand("register", "-10"),
        RangeError,
        "Operand out of range: should be register (R0 - R31) not -10"
    );
    assertThrows(
        () => numericOperand("register", "42"),
        RangeError,
        "Operand out of range: should be register (R0 - R31) not 42"
    );
});

Deno.test("An immediate register should be 16-31 but converted to 0-15", () => {
    newContext();
    setPass(2);
    assertEquals(numericOperand("immediateRegister", "Z"), 14);
    assertEquals(numericOperand("immediateRegister", "R31"), 15);
    assertEquals(numericOperand("immediateRegister", "31"), 15);
    assertThrows(
        () => numericOperand("immediateRegister", "R0"),
        RangeError,
        "Operand out of range: should be immediate register (R16 - R31) not R0"
    );
    assertThrows(
        () => numericOperand("immediateRegister", "42"),
        RangeError,
        "Operand out of range: should be immediate register (R16 - R31) not 42"
    );
});

Deno.test("A 'multiply register' should be 16-23 but converted to 0-7", () => {
    newContext();
    setPass(2);
    assertEquals(numericOperand("multiplyRegister", "R20"), 4);
    assertEquals(numericOperand("multiplyRegister", "22"), 6);
    assertThrows(
        () => numericOperand("multiplyRegister", "R24"),
        RangeError,
        "Operand out of range: should be multiply register (R16 - R23) not R24"
    );
    assertThrows(
        () => numericOperand("multiplyRegister", "15"),
        RangeError,
        "Operand out of range: should be multiply register (R16 - R23) not 15"
    );
});

Deno.test("A register pair should be R24:R25, R26:R27, R28:29, R30:R31", () => {
    newContext();
    setPass(2);
    assertEquals(numericOperand("registerPair", "R24"), 0);
    assertEquals(numericOperand("registerPair", "X"), 1);
    assertEquals(numericOperand("registerPair", "Y"), 2);
    assertEquals(numericOperand("registerPair", "Z"), 3);
    assertThrows(
        () => numericOperand("registerPair", "R20"),
        RangeError,
        "Operand out of range: should be register pair (R24:R25, R26:R27, R28:29, R30:R31) not R20"
    );
    assertThrows(
        () => numericOperand("registerPair", "200"),
        RangeError,
        "Operand out of range: should be register pair (R24:R25, R26:R27, R28:29, R30:R31) not 200"
    );
});

Deno.test("Any register pair is any even numbered register", () => {
    newContext();
    setPass(2);
    assertEquals(numericOperand("anyRegisterPair", "R0"), 0);
    assertEquals(numericOperand("anyRegisterPair", "R2"), 1);
    assertEquals(numericOperand("anyRegisterPair", "R4"), 2);
    assertEquals(numericOperand("anyRegisterPair", "R10"), 5);
    assertEquals(numericOperand("anyRegisterPair", "R20"), 10);
    assertEquals(numericOperand("anyRegisterPair", "R30"), 15);
    assertThrows(
        () => numericOperand("anyRegisterPair", "R31"),
        RangeError,
        "Operand out of range: should be any register pair (R0:R1 - R30:R31) not R31"
    );
    assertThrows(
        () => numericOperand("anyRegisterPair", "32"),
        RangeError,
        "Operand out of range: should be any register pair (R0:R1 - R30:R31) not 32"
    );
});

Deno.test("Some instructions require Z and no other register", () => {
    newContext();
    setPass(2);
    assertEquals(numericOperand("z", "R30"), 30);
    assertEquals(numericOperand("z", "Z"), 30);
    assertEquals(numericOperand("z", "30"), 30);
    assertThrows(
        () => numericOperand("z", "R31"),
        RangeError,
        "Operand out of range: should be Z Register only (R30:R31) not R31"
    );
    assertThrows(
        () => numericOperand("z", "ZH"),
        RangeError,
        "Operand out of range: should be Z Register only (R30:R31) not ZH"
    );
    assertThrows(
        () => numericOperand("z", "X"),
        RangeError,
        "Operand out of range: should be Z Register only (R30:R31) not X"
    );
});

Deno.test("A port is between 0x20 - 0x5F and is remapped to 0x3f", () => {
    setPass(2);
    assertEquals(numericOperand("port", "0x20"), 0);
    assertEquals(numericOperand("port", "0x5F"), 0x3f);
    assertThrows(
        () => numericOperand("port", "10"),
        RangeError,
        "Operand out of range: should be Data memory mapped into IO space (0x20 - 0x5F) not 10"
    );
    assertThrows(
        () => numericOperand("port", "-47"),
        RangeError,
        "Operand out of range: should be Data memory mapped into IO space (0x20 - 0x5F) not -47"
    );
    assertThrows(
        () => numericOperand("port", "96"),
        RangeError,
        "Operand out of range: should be Data memory mapped into IO space (0x20 - 0x5F) not 96"
    );
});

Deno.test("6 bits is between 0 and 0x3F", () => {
    setPass(2);
    assertEquals(numericOperand("sixBits", "0b111111"), 0x3f);
    assertEquals(numericOperand("sixBits", "0x3e"), 0x3e);
    assertThrows(
        () => numericOperand("sixBits", "0b1111111"),
        RangeError,
        "Operand out of range: should be six bit number (0 - 0x3F) not 0b1111111"
    );
    assertThrows(
        () => numericOperand("sixBits", "0x40"),
        RangeError,
        "Operand out of range: should be six bit number (0 - 0x3F) not 0x40"
    );
});

Deno.test("A bit index is 0 - 7", () => {
    setPass(2);
    assertEquals(numericOperand("bitIndex", "0"), 0);
    assertEquals(numericOperand("bitIndex", "4"), 4);
    assertEquals(numericOperand("bitIndex", "7"), 7);
    assertThrows(
        () => numericOperand("bitIndex", "8"),
        RangeError,
        "Operand out of range: should be bit index (0 - 7) not 8"
    );
});

Deno.test("A byte can be -127 - 128 OR 0 - 255", () => {
    setPass(2);
    assertEquals(numericOperand("byte", "-1"), 0xff);
    assertEquals(numericOperand("byte", "255"), 0xff);
    assertEquals(numericOperand("byte", "-128"), 128);
    assertEquals(numericOperand("byte", "128"), 128);
    assertEquals(numericOperand("byte", "0"), 0);
    assertThrows(
        () => numericOperand("byte", "-129"),
        RangeError,
        "Operand out of range: should be byte (-127 - 128) or (0 - 0xFF) not -129"
    );
    assertThrows(
        () => numericOperand("byte", "256"),
        RangeError,
        "Operand out of range: should be byte (-127 - 128) or (0 - 0xFF) not 256"
    );
});

Deno.test("A nybble should be between 0 and 0x0f", () => {
    setPass(2);
    assertEquals(numericOperand("nybble", "0"), 0);
    assertEquals(numericOperand("nybble", "6"), 6);
    assertEquals(numericOperand("nybble", "15"), 15);
    assertThrows(
        () => numericOperand("nybble", "17"),
        RangeError,
        "Operand out of range: should be nybble (0 - 0x0F) not 17"
    );
    assertThrows(
        () => numericOperand("nybble", "-1"),
        RangeError,
        "Operand out of range: should be nybble (0 - 0x0F) not -1"
    );
});

Deno.test("An address is 0 - 0x3FFFFF", () => {
    setPass(2);
    assertEquals(numericOperand("address", "0"), 0);
    assertEquals(numericOperand("address", "0x3FFFFF"), 0x3fffff);
    assertThrows(
        () => numericOperand("address", "-1"),
        RangeError,
        "Operand out of range: should be 22 bit address (0 - 0x3FFFFF) (4 Meg) not -1"
    );
    assertThrows(
        () => numericOperand("address", "0x400000"),
        RangeError,
        "Operand out of range: should be 22 bit address (0 - 0x3FFFFF) (4 Meg) not 0x400000"
    );
});

Deno.test("A RAM address is 0 - 0xFFFF", () => {
    setPass(2);
    assertEquals(numericOperand("16bitAddress", "0"), 0);
    assertEquals(numericOperand("16bitAddress", "0xFFFF"), 0xffff);
    assertThrows(
        () => numericOperand("16bitAddress", "-1"),
        RangeError,
        "Operand out of range: should be 16 bit RAM address (0 - 0xFFFF) (64 K) not -1"
    );
    assertThrows(
        () => numericOperand("16bitAddress", "0x10000"),
        RangeError,
        "Operand out of range: should be 16 bit RAM address (0 - 0xFFFF) (64 K) not 0x10000"
    );
});

Deno.test("A 7 bit RAM address is 0 - 0x7F", () => {
    setPass(2);
    assertEquals(numericOperand("7bitAddress", "0"), 0);
    assertEquals(numericOperand("7bitAddress", "0x7F"), 0x7f);
    assertThrows(
        () => numericOperand("7bitAddress", "-1"),
        RangeError,
        "Operand out of range: should be 7 bit RAM address (0 - 0x7F) (127 Bytes) not -1"
    );
    assertThrows(
        () => numericOperand("7bitAddress", "0x80"),
        RangeError,
        "Operand out of range: should be 7 bit RAM address (0 - 0x7F) (127 Bytes) not 0x80"
    );
});

Deno.test("A relative jump is 0 - 4K after being adjusted from PC", () => {
    setPass(2);
    programMemoryOrigin(0);
    assertEquals(numericOperand("relativeJump", "500"), 499);
    programMemoryOrigin(1010);
    assertEquals(numericOperand("relativeJump", "1000"), 0x0fff - 10);
    programMemoryOrigin(0);
    assertThrows(
        () => numericOperand("relativeJump", "-1"),
        RangeError,
        "Operand out of range: -1 should be a memory address not -1"
    );
    programMemoryOrigin(0);
    assertThrows(
        () => numericOperand("relativeJump", "0x1111"),
        RangeError,
        "Operand out of range: should be relative jump to 12 bit range (-2048 - 2047) not 0x1111"
    );
});

Deno.test("A relative branch is 0 - 127 after being adjusted from PC", () => {
    setPass(2);
    programMemoryOrigin(0);
    assertEquals(numericOperand("relativeBranch", "60"), 59);
    programMemoryOrigin(110);
    assertEquals(numericOperand("relativeBranch", "100"), 127 - 10);
    programMemoryOrigin(0);
    assertThrows(
        () => numericOperand("relativeBranch", "-1"),
        RangeError,
        "Operand out of range: -1 should be a memory address not -1"
    );
    programMemoryOrigin(0);
    assertThrows(
        () => numericOperand("relativeBranch", "0x10000"),
        RangeError,
        "Operand out of range: 0x10000 should be a memory address not 65536"
    );
    programMemoryOrigin(0);
    assertThrows(
        () => numericOperand("relativeBranch", "0x1111"),
        RangeError,
        "Operand out of range: should be relative branch to 7 bit range (-64 - 63) not 0x1111"
    );
});
