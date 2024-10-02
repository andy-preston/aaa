import { assertEquals, assertThrows } from "assert";
import { checkOperandCount, numericOperand } from "./converter.ts";
import { setPass } from "./numeric.ts";
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
    setPass(1);
    assertEquals(0, numericOperand("byte", "notDefined"));
});
