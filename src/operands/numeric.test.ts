import { assertEquals, assertThrows } from "assert";
import { newState } from "../state/mod.ts";
import { operandConverter } from "./converter.ts";


Deno.test("Numeric operands must be integers", () => {
    const state = newState();
    const operands = operandConverter(state);
    state.pass.start(2);
    state.device.choose("dummy", { "reducedCore": false })
    assertEquals(operands.numeric("byte", "R10"), 10);
    assertEquals(operands.numeric("byte", "42"), 42);
    assertThrows(
        () => operands.numeric("byte", '"notANumber"'),
        TypeError,
        'Operand type: "notANumber" is not an integer'
    );
    assertThrows(
        () => operands.numeric("byte", "23.5"),
        TypeError,
        "Operand type: 23.5 is not an integer"
    );
});

Deno.test("6 bits is between 0 and 0x3F", () => {
    const state = newState();
    const operands = operandConverter(state);
    state.pass.start(2);
    assertEquals(operands.numeric("sixBits", "0b111111"), 0x3f);
    assertEquals(operands.numeric("sixBits", "0x3e"), 0x3e);
    assertThrows(
        () => operands.numeric("sixBits", "0b1111111"),
        RangeError,
        "Operand out of range: should be six bit number (0 - 0x3F) not 0b1111111"
    );
    assertThrows(
        () => operands.numeric("sixBits", "0x40"),
        RangeError,
        "Operand out of range: should be six bit number (0 - 0x3F) not 0x40"
    );
});

Deno.test("A bit index is 0 - 7", () => {
    const state = newState();
    const operands = operandConverter(state);
    state.pass.start(2);
    assertEquals(operands.numeric("bitIndex", "0"), 0);
    assertEquals(operands.numeric("bitIndex", "4"), 4);
    assertEquals(operands.numeric("bitIndex", "7"), 7);
    assertThrows(
        () => operands.numeric("bitIndex", "8"),
        RangeError,
        "Operand out of range: should be bit index (0 - 7) not 8"
    );
});

Deno.test("A byte can be -127 - 128 OR 0 - 255", () => {
    const state = newState();
    const operands = operandConverter(state);
    state.pass.start(2);
    assertEquals(operands.numeric("byte", "-1"), 0xff);
    assertEquals(operands.numeric("byte", "255"), 0xff);
    assertEquals(operands.numeric("byte", "-128"), 128);
    assertEquals(operands.numeric("byte", "128"), 128);
    assertEquals(operands.numeric("byte", "0"), 0);
    assertThrows(
        () => operands.numeric("byte", "-129"),
        RangeError,
        "Operand out of range: should be byte (-127 - 128) or (0 - 0xFF) not -129"
    );
    assertThrows(
        () => operands.numeric("byte", "256"),
        RangeError,
        "Operand out of range: should be byte (-127 - 128) or (0 - 0xFF) not 256"
    );
});

Deno.test("A nybble should be between 0 and 0x0f", () => {
    const state = newState();
    const operands = operandConverter(state);
    state.pass.start(2);
    assertEquals(operands.numeric("nybble", "0"), 0);
    assertEquals(operands.numeric("nybble", "6"), 6);
    assertEquals(operands.numeric("nybble", "15"), 15);
    assertThrows(
        () => operands.numeric("nybble", "17"),
        RangeError,
        "Operand out of range: should be nybble (0 - 0x0F) not 17"
    );
    assertThrows(
        () => operands.numeric("nybble", "-1"),
        RangeError,
        "Operand out of range: should be nybble (0 - 0x0F) not -1"
    );
});
