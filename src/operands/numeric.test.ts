import { assertEquals, assertThrows } from "assert";
import { numericOperand } from "./converter.ts";
import { setupTest } from "./testing.ts";

Deno.test("Numeric operands must be integers", () => {
    setupTest();
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

Deno.test("6 bits is between 0 and 0x3F", () => {
    setupTest();
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
    setupTest();
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
    setupTest();
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
    setupTest();
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
