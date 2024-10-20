import { assertEquals, assertThrows } from "assert";
import { OperandRangeError } from "../errors/errors.ts";
import { newState } from "../state/mod.ts";
import { operandConverter } from "./converter.ts";

Deno.test("A register should be between zero and 31", () => {
    const state = newState();
    const operands = operandConverter(state);
    state.pass.start(2);
    state.device.choose("dummy", { "reducedCore": false })
    assertEquals(operands.numeric("register", "R0"), 0);
    assertEquals(operands.numeric("register", "6"), 6);
    assertEquals(operands.numeric("register", "Z"), 30);
    assertEquals(operands.numeric("register", "R31"), 31);
    assertEquals(operands.numeric("register", "31"), 31);
    assertThrows(
        () => operands.numeric("register", "-10"),
        OperandRangeError,
        "Operand out of range: should be register (R0 - R31) not -10"
    );
    assertThrows(
        () => operands.numeric("register", "42"),
        OperandRangeError,
        "Operand out of range: should be register (R0 - R31) not 42"
    );
});

Deno.test("An immediate register should be 16-31 but converted to 0-15", () => {
    const state = newState();
    const operands = operandConverter(state);
    state.pass.start(2);
    state.device.choose("dummy", { "reducedCore": false })
    assertEquals(operands.numeric("immediateRegister", "Z"), 14);
    assertEquals(operands.numeric("immediateRegister", "R31"), 15);
    assertEquals(operands.numeric("immediateRegister", "31"), 15);
    assertThrows(
        () => operands.numeric("immediateRegister", "R0"),
        OperandRangeError,
        "Operand out of range: should be immediate register (R16 - R31) not R0"
    );
    assertThrows(
        () => operands.numeric("immediateRegister", "42"),
       OperandRangeError,
        "Operand out of range: should be immediate register (R16 - R31) not 42"
    );
});

Deno.test("A 'multiply register' should be 16-23 but converted to 0-7", () => {
    const state = newState();
    const operands = operandConverter(state);
    state.pass.start(2);
    state.device.choose("dummy", { "reducedCore": false })
    assertEquals(operands.numeric("multiplyRegister", "R20"), 4);
    assertEquals(operands.numeric("multiplyRegister", "22"), 6);
    assertThrows(
        () => operands.numeric("multiplyRegister", "R24"),
        OperandRangeError,
        "Operand out of range: should be multiply register (R16 - R23) not R24"
    );
    assertThrows(
        () => operands.numeric("multiplyRegister", "15"),
        OperandRangeError,
        "Operand out of range: should be multiply register (R16 - R23) not 15"
    );
});

Deno.test("A register pair should be R24:R25, R26:R27, R28:29, R30:R31", () => {
    const state = newState();
    const operands = operandConverter(state);
    state.pass.start(2);
    state.device.choose("dummy", { "reducedCore": false })
    assertEquals(operands.numeric("registerPair", "R24"), 0);
    assertEquals(operands.numeric("registerPair", "X"), 1);
    assertEquals(operands.numeric("registerPair", "Y"), 2);
    assertEquals(operands.numeric("registerPair", "Z"), 3);
    assertThrows(
        () => operands.numeric("registerPair", "R20"),
        OperandRangeError,
        "Operand out of range: should be register pair (R24:R25, R26:R27, R28:29, R30:R31) not R20"
    );
    assertThrows(
        () => operands.numeric("registerPair", "200"),
        OperandRangeError,
        "Operand out of range: should be register pair (R24:R25, R26:R27, R28:29, R30:R31) not 200"
    );
});

Deno.test("Any register pair is any even numbered register", () => {
    const state = newState();
    const operands = operandConverter(state);
    state.pass.start(2);
    state.device.choose("dummy", { "reducedCore": false })
    assertEquals(operands.numeric("anyRegisterPair", "R0"), 0);
    assertEquals(operands.numeric("anyRegisterPair", "R2"), 1);
    assertEquals(operands.numeric("anyRegisterPair", "R4"), 2);
    assertEquals(operands.numeric("anyRegisterPair", "R10"), 5);
    assertEquals(operands.numeric("anyRegisterPair", "R20"), 10);
    assertEquals(operands.numeric("anyRegisterPair", "R30"), 15);
    assertThrows(
        () => operands.numeric("anyRegisterPair", "R31"),
        OperandRangeError,
        "Operand out of range: should be any register pair (R0:R1 - R30:R31) not R31"
    );
    assertThrows(
        () => operands.numeric("anyRegisterPair", "32"),
        OperandRangeError,
        "Operand out of range: should be any register pair (R0:R1 - R30:R31) not 32"
    );
});

Deno.test("Some instructions require Z and no other register", () => {
    const state = newState();
    const operands = operandConverter(state);
    state.pass.start(2);
    state.device.choose("dummy", { "reducedCore": false })
    assertEquals(operands.numeric("z", "R30"), 30);
    assertEquals(operands.numeric("z", "Z"), 30);
    assertEquals(operands.numeric("z", "30"), 30);
    assertThrows(
        () => operands.numeric("z", "R31"),
        OperandRangeError,
        "Operand out of range: should be Z Register only (R30:R31) not R31"
    );
    assertThrows(
        () => operands.numeric("z", "ZH"),
        OperandRangeError,
        "Operand out of range: should be Z Register only (R30:R31) not ZH"
    );
    assertThrows(
        () => operands.numeric("z", "X"),
        OperandRangeError,
        "Operand out of range: should be Z Register only (R30:R31) not X"
    );
});
