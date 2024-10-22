import { assertEquals, assertThrows } from "assert";
import { RedefinedError } from "../errors/errors.ts";
import { newContext } from "./context.ts";
import { newPass } from "./pass.ts";

Deno.test("A property can be defined and accessed", () => {
    const context = newContext(newPass(() => {}));
    context.property("plop", 57);
    assertEquals(context.value("plop"), "57");
});

Deno.test("A property can't be redefined to a new value", () => {
    const context = newContext(newPass(() => {}));
    context.property("plop", 0x57);
    assertThrows(
        () => { context.property("plop", 0x99); },
        RedefinedError,
        "plop already defined"
    );
});

Deno.test("... but it can be 'redefined' with the same value", () => {
    const context = newContext(newPass(() => {}));
    context.property("plop", 0x57);
    context.property("plop", 0x57);
});

