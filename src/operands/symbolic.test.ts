import { assertEquals, assertThrows } from "assert";
import { newState } from "../state/mod.ts";
import { InternalError } from "../errors/errors.ts";
import { blankSlate } from "../coupling/coupling.ts";
import { operandConverter } from "./converter.ts";

const state = newState();
const operands = operandConverter(state);

Deno.test("Symbolic is only used for Check Count", () => {
    blankSlate();
    state.pass.start(2);
    assertThrows(
        () => operands.numeric("symbolic", "anything"),
        InternalError,
        "symbolic is only for checkCount"
    );
    operands.checkCount(["A", "B"], ["symbolic", "symbolic"]);
});

Deno.test("Operands must be defined, at least on the second pass", () => {
    blankSlate();
    state.pass.start(2);
    assertThrows(
        () => operands.numeric("byte", "notDefined"),
        ReferenceError,
        "notDefined is not defined"
    );
    state.pass.start(1);
    assertEquals(0, operands.numeric("byte", "notDefined"));
});
