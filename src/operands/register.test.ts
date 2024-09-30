import { assertEquals, assertThrows } from "assert";
import { newContext } from "../context/mod.ts";
import { numericOperand } from "./converter.ts";
import { setPass } from "./numeric.ts";

const setupTest = () => {
    newContext();
    setPass(2);
}

Deno.test("A register should be between zero and 31", () => {
    setupTest();
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
    setupTest();
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
    setupTest();
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
    setupTest();
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
    setupTest();
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
    setupTest();
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
