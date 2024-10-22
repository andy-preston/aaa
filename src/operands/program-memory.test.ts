import { assertEquals, assertThrows } from "assert";
import { OperandOutOfRange } from "../errors/errors.ts";
import { newState } from "../state/mod.ts";
import { operandConverter } from "./converter.ts";

Deno.test("An address is 0 - 0x3FFFFF", () => {
    const state = newState();
    const operands = operandConverter(state);
    state.pass.start(2);
    state.device.choose("dummy", { "programEnd": 0xf00000 });
    assertEquals(operands.numeric("address", "0"), 0);
    assertEquals(operands.numeric("address", "0x3FFFFF"), 0x3fffff);
    assertThrows(
        () => operands.numeric("address", "-1"),
        OperandOutOfRange,
        "should be 22 bit address (0 - 0x3FFFFF) (4M Words) not -1"
    );
    assertThrows(
        () => operands.numeric("address", "0x400000"),
        OperandOutOfRange,
        "should be 22 bit address (0 - 0x3FFFFF) (4M Words) not 0x400000"
    );
});

Deno.test("An address is should not exceed program memory", () => {
    const state = newState();
    const operands = operandConverter(state);
    state.pass.start(2);
    state.device.choose("dummy", { "programEnd": 0x400 });
    assertThrows(
        () => operands.numeric("address", "0x400000"),
        OperandOutOfRange,
        "should be 22 bit address (0 - 0x3FFFFF) (4M Words) not 0x400000"
    );
});

Deno.test("A relative jump is 0 - 4K after being adjusted from PC", () => {
    const state = newState();
    const operands = operandConverter(state);
    state.pass.start(2);
    state.device.choose("dummy", { "programEnd": 8 * 1024 });

    state.programMemory.origin(0);
    assertEquals(operands.numeric("relativeJump", "500"), 499);

    state.programMemory.origin(1010);
    assertEquals(operands.numeric("relativeJump", "1000"), 0x0fff - 10);

    state.programMemory.origin(0);
    assertThrows(
        () => operands.numeric("relativeJump", "-1"),
        OperandOutOfRange,
        "should be relative jump to 12 bit range (-2048 - 2047) not -1"
    );

    state.programMemory.origin(0);
    assertThrows(
        () => operands.numeric("relativeJump", "2050"),
        OperandOutOfRange,
        "should be relative jump to 12 bit range (-2048 - 2047) not 2050"
    );
});

Deno.test("A relative jump should not be outside program memory", () => {
    const state = newState();
    const operands = operandConverter(state);
    state.pass.start(2);
    state.device.choose("dummy", { "programEnd": 32 });
    assertThrows(
        () => operands.numeric("relativeJump", "23"),
        OperandOutOfRange,
        "should be within program memory 0 - 0x10 not 0x17"
    );
});

Deno.test("A relative branch is 0 - 127 after being adjusted from PC", () => {
    const state = newState();
    const operands = operandConverter(state);
    state.pass.start(2);
    state.device.choose("dummy", { "programEnd": 1024 });

    state.programMemory.origin(0);
    assertEquals(operands.numeric("relativeBranch", "60"), 59);

    state.programMemory.origin(110);
    assertEquals(operands.numeric("relativeBranch", "100"), 127 - 10);

    state.programMemory.origin(0);
    assertThrows(
        () => operands.numeric("relativeBranch", "-1"),
        OperandOutOfRange,
        "should be relative branch to 7 bit range (-64 - 63) not -1"
    );

    state.programMemory.origin(0);
    assertThrows(
        () => operands.numeric("relativeBranch", "0x200"),
        OperandOutOfRange,
        "should be relative branch to 7 bit range (-64 - 63) not 0x200"
    );

    state.programMemory.origin(0x200);
    assertThrows(
        () => operands.numeric("relativeBranch", "0x180"),
        OperandOutOfRange,
        "should be relative branch to 7 bit range (-64 - 63) not 0x180"
    );
});

Deno.test("A relative branch should not be outside program memory", () => {
    const state = newState();
    const operands = operandConverter(state);
    state.pass.start(2);
    state.device.choose("dummy", { "programEnd": 0x20 });
    assertThrows(
        () => operands.numeric("relativeBranch", "0x11"),
        OperandOutOfRange,
        "should be within program memory 0 - 0x10 not 0x11"
    );
});
