import { assertEquals, assertThrows } from "assert";
import { newContext } from "./handler.ts";

Deno.test("simple expressions do not require a `return`", () => {
    const handler = newContext();
    assertEquals(handler.execute("20 / 2"), "10");
});

Deno.test("but you can include one if you want", () => {
    const handler = newContext();
    assertEquals(handler.execute("return R20 / 2"), "10");
});

Deno.test("If the result is undefined, execute returns empty string", () => {
    const handler = newContext();
    assertEquals(handler.execute("undefined;"), "");
});

Deno.test("A plain assignment will not return a value", () => {
    const handler = newContext();
    assertEquals(handler.execute("this.test = 4;"), "");
});

Deno.test("Javascript can contain newlines", () => {
    const handler = newContext();
    assertEquals(handler.execute(
        "this.test1 = 4;\nthis.test2 = 6;\n return test1 + test2;"
    ), "10");
});

Deno.test("An unknown variable throws a reference error", () => {
    const handler = newContext();
    assertThrows(
        () => handler.execute("this.test = plop * 10;"),
        ReferenceError,
        "plop is not defined"
    );
});

Deno.test("Syntax errors get thrown too", () => {
    const handler = newContext();
    assertThrows(
        () => handler.execute("this is just nonsense"),
        SyntaxError,
        "Unexpected identifier 'is'"
    );
});
