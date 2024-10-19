import { assertEquals, assertThrows } from "assert";
import { blankSlate } from "../coupling/coupling.ts";
import { newState } from "../state/mod.ts";
import { operandConverter } from "./converter.ts";

Deno.test("A Data Memory Address is 0 - 0xFFFF", () => {
    const state = newState();
    const operands = operandConverter(state);
    blankSlate();
    state.pass.start(2);
    state.device.choose("dummy", { "ramStart": 0x0000, "ramEnd": 0xffff });

    assertEquals(state.dataMemory.ramStart(), 0);
    assertEquals(state.dataMemory.ramEnd(), 0xffff);


    assertEquals(operands.numeric("dataAddress16Bit", "0"), 0);
    assertEquals(operands.numeric("dataAddress16Bit", "0xFFFF"), 0xffff);
    assertThrows(
        () => operands.numeric("dataAddress16Bit", "-1"),
        RangeError,
        "Operand out of range: should be 16 bit Data Memory address (0 - 0xFFFF) (64 K) not -1"
    );
    assertThrows(
        () => operands.numeric("dataAddress16Bit", "0x10000"),
        RangeError,
        "Operand out of range: should be 16 bit Data Memory address (0 - 0xFFFF) (64 K) not 0x10000"
    );
});

Deno.test("A Data Memory Address can't exceed available data memory", () => {
    const state = newState();
    const operands = operandConverter(state);
    blankSlate();
    state.device.choose("dummy", { "ramStart": 0x0060, "ramEnd": 0x0080 });
    state.pass.start(2);
    assertEquals(operands.numeric("dataAddress16Bit", "0x0060"), 0x0060);
    assertEquals(operands.numeric("dataAddress16Bit", "0x0080"), 0x0080);
    assertThrows(
        () => operands.numeric("dataAddress16Bit", "0x0090"),
        RangeError,
        "Operand out of range: should be within data memory 0 - 0x80 not 0x90"
    );
});

Deno.test("A 7 bit Data Memory Address is 0 - 0x7F", () => {
    const state = newState();
    const operands = operandConverter(state);
    blankSlate();
    state.device.choose("dummy", { "ramEnd": 0x0100 });
    state.pass.start(2);
    assertEquals(operands.numeric("dataAddress7Bit", "0"), 0);
    assertEquals(operands.numeric("dataAddress7Bit", "0x7F"), 0x7f);
    assertThrows(
        () => operands.numeric("dataAddress7Bit", "-1"),
        RangeError,
        "Operand out of range: should be 7 bit Data Memory address (0 - 0x7F) (127 Bytes) not -1"
    );
    assertThrows(
        () => operands.numeric("dataAddress7Bit", "0x80"),
        RangeError,
        "Operand out of range: should be 7 bit Data Memory address (0 - 0x7F) (127 Bytes) not 0x80"
    );
});

Deno.test("A port is between 20 - 5F and is remapped to 00 - 3F", () => {
    const state = newState();
    const operands = operandConverter(state);
    blankSlate();
    state.device.choose("dummy", { "ramEnd": 0x0100 });
    state.pass.start(2);
    assertEquals(operands.numeric("port", "0x20"), 0);
    assertEquals(operands.numeric("port", "0x5F"), 0x3f);
    assertThrows(
        () => operands.numeric("port", "10"),
        RangeError,
        "Operand out of range: should be Data Memory mapped into IO space (0x20 - 0x5F) not 10"
    );
    assertThrows(
        () => operands.numeric("port", "-47"),
        RangeError,
        "Operand out of range: should be Data Memory mapped into IO space (0x20 - 0x5F) not -47"
    );
    assertThrows(
        () => operands.numeric("port", "96"),
        RangeError,
        "Operand out of range: should be Data Memory mapped into IO space (0x20 - 0x5F) not 96"
    );
});
