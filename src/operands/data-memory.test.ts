import { assertEquals, assertThrows } from "assert";
import { blankSlate } from "../coupling/coupling.ts";
import { startPass } from "../state/mod.ts";
import { numericOperand } from "./converter.ts";

Deno.test("A Data Memory Address is 0 - 0xFFFF", () => {
    blankSlate();
    startPass(2);
    assertEquals(numericOperand("dataAddress16Bit", "0"), 0);
    assertEquals(numericOperand("dataAddress16Bit", "0xFFFF"), 0xffff);
    assertThrows(
        () => numericOperand("dataAddress16Bit", "-1"),
        RangeError,
        "Operand out of range: should be 16 bit Data Memory address (0 - 0xFFFF) (64 K) not -1"
    );
    assertThrows(
        () => numericOperand("dataAddress16Bit", "0x10000"),
        RangeError,
        "Operand out of range: should be 16 bit Data Memory address (0 - 0xFFFF) (64 K) not 0x10000"
    );
});

Deno.test("A Data Memory Address can't exceed available data memory", () => {
    blankSlate();
    startPass(2);

});

Deno.test("A 7 bit Data Memory Address is 0 - 0x7F", () => {
    blankSlate();
    startPass(2);
    assertEquals(numericOperand("dataAddress7Bit", "0"), 0);
    assertEquals(numericOperand("dataAddress7Bit", "0x7F"), 0x7f);
    assertThrows(
        () => numericOperand("dataAddress7Bit", "-1"),
        RangeError,
        "Operand out of range: should be 7 bit Data Memory address (0 - 0x7F) (127 Bytes) not -1"
    );
    assertThrows(
        () => numericOperand("dataAddress7Bit", "0x80"),
        RangeError,
        "Operand out of range: should be 7 bit Data Memory address (0 - 0x7F) (127 Bytes) not 0x80"
    );
});

Deno.test("A port is between 0x20 - 0x5F and is remapped to 0x3f", () => {
    blankSlate();
    startPass(2);
    assertEquals(numericOperand("port", "0x20"), 0);
    assertEquals(numericOperand("port", "0x5F"), 0x3f);
    assertThrows(
        () => numericOperand("port", "10"),
        RangeError,
        "Operand out of range: should be Data Memory mapped into IO space (0x20 - 0x5F) not 10"
    );
    assertThrows(
        () => numericOperand("port", "-47"),
        RangeError,
        "Operand out of range: should be Data Memory mapped into IO space (0x20 - 0x5F) not -47"
    );
    assertThrows(
        () => numericOperand("port", "96"),
        RangeError,
        "Operand out of range: should be Data Memory mapped into IO space (0x20 - 0x5F) not 96"
    );
});
