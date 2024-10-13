import { assertEquals, assertThrows } from "assert";
import { startPass } from "../state/mod.ts";
import { checkOperandCount, numericOperand } from "./converter.ts";
import { InternalError } from "../errors/errors.ts";
import { blankSlate } from "../coupling/coupling.ts";

Deno.test("Symbolic is only used for Check Count", () => {
    blankSlate();
    startPass(2);
    assertThrows(
        () => numericOperand("symbolic", "anything"),
        InternalError,
        "symbolic is only for checkCount"
    );
    checkOperandCount(["A", "B"], ["symbolic", "symbolic"]);
});

Deno.test("Operands must be defined, at least on the second pass", () => {
    blankSlate();
    startPass(2);
    assertThrows(
        () => numericOperand("byte", "notDefined"),
        ReferenceError,
        "notDefined is not defined"
    );
    startPass(1);
    assertEquals(0, numericOperand("byte", "notDefined"));
});
