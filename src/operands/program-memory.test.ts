import { assertEquals, assertThrows } from "assert";
import { programMemoryOrigin, newState } from "../state/mod.ts";
import { blankSlate } from "../coupling/coupling.ts";
import { chooseDevice } from "../context/mod.ts";
import { operandConverter } from "./converter.ts";

const state = newState();
const operands = operandConverter(state);

Deno.test("An address is 0 - 0x3FFFFF", () => {
    blankSlate();
    state.pass.start(2);
    chooseDevice("dummy", { "programEnd": 0xf00000 });
    assertEquals(operands.numeric("address", "0"), 0);
    assertEquals(operands.numeric("address", "0x3FFFFF"), 0x3fffff);
    assertThrows(
        () => operands.numeric("address", "-1"),
        RangeError,
        "Operand out of range: should be 22 bit address (0 - 0x3FFFFF) (4M Words) not -1"
    );
    assertThrows(
        () => operands.numeric("address", "0x400000"),
        RangeError,
        "Operand out of range: should be 22 bit address (0 - 0x3FFFFF) (4M Words) not 0x400000"
    );
});

Deno.test("An address is should not exceed program memory", () => {
    blankSlate();
    state.pass.start(2);
    chooseDevice("dummy", { "programEnd": 0x400 });
    assertThrows(
        () => operands.numeric("address", "0x400000"),
        RangeError,
        "Operand out of range: should be 22 bit address (0 - 0x3FFFFF) (4M Words) not 0x400000"
    );
});

Deno.test("A relative jump is 0 - 4K after being adjusted from PC", () => {
    blankSlate();
    state.pass.start(2);
    chooseDevice("dummy", { "programEnd": 8 * 1024 });

    programMemoryOrigin(0);
    assertEquals(operands.numeric("relativeJump", "500"), 499);

    programMemoryOrigin(1010);
    assertEquals(operands.numeric("relativeJump", "1000"), 0x0fff - 10);

    programMemoryOrigin(0);
    assertThrows(
        () => operands.numeric("relativeJump", "-1"),
        RangeError,
        "Operand out of range: should be relative jump to 12 bit range (-2048 - 2047) not -1"
    );

    programMemoryOrigin(0);
    assertThrows(
        () => operands.numeric("relativeJump", "2050"),
        RangeError,
        "Operand out of range: should be relative jump to 12 bit range (-2048 - 2047) not 2050"
    );
});

Deno.test("A relative jump should not be outside program memory", () => {
    blankSlate();
    state.pass.start(2);
    chooseDevice("dummy", { "programEnd": 32 });
    assertThrows(
        () => operands.numeric("relativeJump", "23"),
        RangeError,
        "Operand out of range: should be within program memory 0 - 0x10 not 0x17"
    );
});

Deno.test("A relative branch is 0 - 127 after being adjusted from PC", () => {
    blankSlate();
    state.pass.start(2);
    chooseDevice("dummy", { "programEnd": 1024 });

    programMemoryOrigin(0);
    assertEquals(operands.numeric("relativeBranch", "60"), 59);

    programMemoryOrigin(110);
    assertEquals(operands.numeric("relativeBranch", "100"), 127 - 10);

    programMemoryOrigin(0);
    assertThrows(
        () => operands.numeric("relativeBranch", "-1"),
        RangeError,
        "Operand out of range: should be relative branch to 7 bit range (-64 - 63) not -1"
    );

    programMemoryOrigin(0);
    assertThrows(
        () => operands.numeric("relativeBranch", "0x200"),
        RangeError,
        "Operand out of range: should be relative branch to 7 bit range (-64 - 63) not 0x200"
    );

    programMemoryOrigin(0x200);
    assertThrows(
        () => operands.numeric("relativeBranch", "0x180"),
        RangeError,
        "Operand out of range: should be relative branch to 7 bit range (-64 - 63) not 0x180"
    );
});

Deno.test("A relative branch should not be outside program memory", () => {
    blankSlate();
    state.pass.start(2);
    chooseDevice("dummy", { "programEnd": 0x20 });
    assertThrows(
        () => operands.numeric("relativeBranch", "0x11"),
        RangeError,
        "Operand out of range: should be within program memory 0 - 0x10 not 0x11"
    );
});
