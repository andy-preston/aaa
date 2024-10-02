import { assertEquals, assertThrows } from "assert";
import { programMemoryBytes, programMemoryOrigin } from "../process/mod.ts";
import { numericOperand } from "./converter.ts";

import { setupTest } from "./testing.ts";

const moreProgramMemoryThanAddresses = (bytes: number) => {
    programMemoryBytes(bytes);
};

Deno.test("An address is 0 - 0x3FFFFF", () => {
    setupTest();
    moreProgramMemoryThanAddresses(0xf00000);

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
    moreProgramMemoryThanAddresses(0x400);

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

Deno.test("A relative jump is 0 - 4K after being adjusted from PC", () => {
    setupTest();
    moreProgramMemoryThanAddresses(8 * 1024);

    programMemoryOrigin(0);
    assertEquals(numericOperand("relativeJump", "500"), 499);

    programMemoryOrigin(1010);
    assertEquals(numericOperand("relativeJump", "1000"), 0x0fff - 10);

    programMemoryOrigin(0);
    assertThrows(
        () => numericOperand("relativeJump", "-1"),
        RangeError,
        "Operand out of range: should be relative jump to 12 bit range (-2048 - 2047) not -1"
    );

    programMemoryOrigin(0);
    assertThrows(
        () => numericOperand("relativeJump", "2050"),
        RangeError,
        "Operand out of range: should be relative jump to 12 bit range (-2048 - 2047) not 2050"
    );
});

Deno.test("A relative jump should not be outside program memory", () => {
    setupTest();
    moreProgramMemoryThanAddresses(32);

    assertThrows(
        () => numericOperand("relativeJump", "23"),
        RangeError,
        "Operand out of range: should be within program memory 0 - 0x10 not 0x17"
    );
});

Deno.test("A relative branch is 0 - 127 after being adjusted from PC", () => {
    setupTest();
    moreProgramMemoryThanAddresses(1024);

    programMemoryOrigin(0);
    assertEquals(numericOperand("relativeBranch", "60"), 59);

    programMemoryOrigin(110);
    assertEquals(numericOperand("relativeBranch", "100"), 127 - 10);

    programMemoryOrigin(0);
    assertThrows(
        () => numericOperand("relativeBranch", "-1"),
        RangeError,
        "Operand out of range: should be relative branch to 7 bit range (-64 - 63) not -1"
    );

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
    moreProgramMemoryThanAddresses(0x20);

    assertThrows(
        () => numericOperand("relativeBranch", "0x11"),
        RangeError,
        "Operand out of range: should be within program memory 0 - 0x10 not 0x11"
    );
});
