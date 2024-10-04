import { assertEquals, assertThrows } from "assert";
import { startPass } from "../process/mod.ts";
import { checkOperandCount, numericOperand } from "./converter.ts";
import { setupTest } from "./testing.ts";

Deno.test("Symbolic is only used for Check Count", () => {
    setupTest();
    assertThrows(
        () => numericOperand("symbolic", "anything"),
        Error,
        "Internal error: symbolic is only for checkCount"
    );
    checkOperandCount(["A", "B"], ["symbolic", "symbolic"]);
});

Deno.test("Operands must be defined, at least on the second pass", () => {
    setupTest();
    assertThrows(
        () => numericOperand("byte", "notDefined"),
        ReferenceError,
        "notDefined is not defined"
    );
    startPass(1);
    assertEquals(0, numericOperand("byte", "notDefined"));
});
