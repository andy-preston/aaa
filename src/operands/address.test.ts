import { assertEquals, assertThrows } from "assert";
import { newContext } from "../context/mod.ts";
import { programMemoryBytes, programMemoryOrigin } from "../process/mod.ts";
import { numericOperand } from "./converter.ts";
import { setPass } from "./numeric.ts";

const setupTest = () => {
    newContext();
    setPass(2);
}

Deno.test("An address is 0 - 0x3FFFFF", () => {
    setupTest();
    const moreProgramMemoryThanAddresses = 0xf00000;
    programMemoryBytes(moreProgramMemoryThanAddresses);
    assertEquals(numericOperand("address", "0"), 0);
    assertEquals(numericOperand("address", "0x3FFFFF"), 0x3fffff);
    assertThrows(
        () => numericOperand("address", "0x400000"),
        RangeError,
        "Operand out of range: should be 22 bit address (0 - 0x3FFFFF) (4 Meg) not 0x400000"
    );
});

Deno.test("An address is should not exceed program memory", () => {
    setupTest();
    programMemoryBytes(0x400);
    assertThrows(
        () => numericOperand("address", "-1"),
        RangeError,
        "Operand out of range: should be within program memory 0 - 0x200 not -1"
    );
    assertThrows(
        () => numericOperand("address", "0x400000"),
        RangeError,
        "Operand out of range: should be within program memory 0 - 0x200 not 0x400000"
    );
});

Deno.test("A RAM address is 0 - 0xFFFF", () => {
    setupTest();
    const moreProgramMemoryThanAddresses = 0x10000;
    programMemoryBytes(moreProgramMemoryThanAddresses);

    assertEquals(numericOperand("16bitRamAddress", "0"), 0);
    assertEquals(numericOperand("16bitRamAddress", "0xFFFF"), 0xffff);
    assertThrows(
        () => numericOperand("16bitRamAddress", "-1"),
        RangeError,
        "Operand out of range: should be 16 bit RAM address (0 - 0xFFFF) (64 K) not -1"
    );
    assertThrows(
        () => numericOperand("16bitRamAddress", "0x10000"),
        RangeError,
        "Operand out of range: should be 16 bit RAM address (0 - 0xFFFF) (64 K) not 0x10000"
    );
});

Deno.test("A 7 bit RAM address is 0 - 0x7F", () => {
    setupTest();
    assertEquals(numericOperand("7bitRamAddress", "0"), 0);
    assertEquals(numericOperand("7bitRamAddress", "0x7F"), 0x7f);
    assertThrows(
        () => numericOperand("7bitRamAddress", "-1"),
        RangeError,
        "Operand out of range: should be 7 bit RAM address (0 - 0x7F) (127 Bytes) not -1"
    );
    assertThrows(
        () => numericOperand("7bitRamAddress", "0x80"),
        RangeError,
        "Operand out of range: should be 7 bit RAM address (0 - 0x7F) (127 Bytes) not 0x80"
    );
});

Deno.test("A relative jump is 0 - 4K after being adjusted from PC", () => {
    setupTest();
    programMemoryOrigin(0);
    assertEquals(numericOperand("relativeJump", "500"), 499);
    programMemoryOrigin(1010);
    assertEquals(numericOperand("relativeJump", "1000"), 0x0fff - 10);
    programMemoryOrigin(0);
    assertThrows(
        () => numericOperand("relativeJump", "0x1111"),
        RangeError,
        "Operand out of range: should be relative jump to 12 bit range (-2048 - 2047) not 0x1111"
    );
});

Deno.test("A relative jump should not be outside program memory", () => {
    setupTest();
    assertThrows(
        () => numericOperand("relativeJump", "-1"),
        RangeError,
        "Operand out of range: should be within program memory 0 - 0x8000 not -1"
    );
    programMemoryBytes(32);
    assertThrows(
        () => numericOperand("relativeJump", "23"),
        RangeError,
        "Operand out of range: should be within program memory 0 - 0x10 not 23"
    );
});

Deno.test("A relative branch is 0 - 127 after being adjusted from PC", () => {
    setupTest();
    programMemoryBytes(1024);
    programMemoryOrigin(0);
    assertEquals(numericOperand("relativeBranch", "60"), 59);
    programMemoryOrigin(110);
    assertEquals(numericOperand("relativeBranch", "100"), 127 - 10);
    programMemoryOrigin(0);
    assertThrows(
        () => numericOperand("relativeBranch", "0x200"),
        RangeError,
        "Operand out of range: should be relative branch to 7 bit range (-64 - 63) not 0x200"
    );
    programMemoryOrigin(0x200);
    assertThrows(
        () => numericOperand("relativeBranch", "0x180"),
        RangeError,
        "Operand out of range: should be relative branch to 7 bit range (-64 - 63) not 0x180"
    );
});

Deno.test("A relative branch should not be outside program memory", () => {
    setupTest();
    programMemoryBytes(0x20);
    programMemoryOrigin(0);
    assertThrows(
        () => numericOperand("relativeBranch", "-1"),
        RangeError,
        "Operand out of range: should be within program memory 0 - 0x10 not -1"
    );
    assertThrows(
        () => numericOperand("relativeBranch", "0x20"),
        RangeError,
        "Operand out of range: should be within program memory 0 - 0x10 not 0x20"
    );
});

Deno.test("A port is between 0x20 - 0x5F and is remapped to 0x3f", () => {
    setupTest();
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
