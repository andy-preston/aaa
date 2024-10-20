import { assertEquals, assertThrows } from "assert";
import { InternalError, NotDefinedError } from "../errors/errors.ts";
import { newState } from "../state/mod.ts";
import { operandConverter } from "./converter.ts";

const state = newState();
const operands = operandConverter(state);

Deno.test("Symbolic is only used for Check Count", () => {
    state.pass.start(2);
    assertThrows(
        () => operands.numeric("symbolic", "anything"),
        InternalError,
        "symbolic is only for checkCount"
    );
    operands.checkCount(["A", "B"], ["symbolic", "symbolic"]);
});

Deno.test("Operands must be defined, at least on the second pass", () => {
    state.pass.start(2);
    assertThrows(
        () => operands.numeric("byte", "notDefined"),
        NotDefinedError,
        "notDefined is not defined"
    );
    state.pass.start(1);
    assertEquals(0, operands.numeric("byte", "notDefined"));
});
