import { assertEquals, assertThrows } from "assert";
import { newContext } from "./handler.ts";

Deno.test("execute returns a string from the last expression evaluated", () => {
    const handler = newContext();
    assertEquals(
        handler.execute('"simple test";'),
        "simple test"
    );
    assertEquals(
        handler.execute("'simple ' + \"test\";"),
        "simple test"
    );
    assertEquals(
        handler.execute('"simple " + \'test\';'),
        "simple test"
    );
    assertEquals(
        handler.execute("20 / 2;"),
        "10"
    );
});

Deno.test("If the result is undefined, execute returns empty string", () => {
    const handler = newContext();
    assertEquals(
        handler.execute("undefined;"),
        ""
    );
    assertEquals(
        handler.execute("let x = 4;"),
        ""
    );
});

Deno.test("Javascript can contain newlines", () => {
    const handler = newContext();
    assertEquals(
        handler.execute("let x = 4;\nlet y = 6;\nx + y;"),
        "10"
    );
});

Deno.test("An unknown variable throws a reference error", () => {
    const handler = newContext();
    assertThrows(
        () => handler.execute("let x = plop * 10;"),
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

Deno.test("evaluate returns an integer from the last expression", () => {
    const handler = newContext();
    assertEquals(
        handler.evaluate("20 / 2"),
        10
    );
});

Deno.test("evaluate throws if it doesn't return a number", () => {
    const handler = newContext();
    assertThrows(
        () => handler.evaluate('"no" + " " + "use!"'),
        TypeError,
        '{"no" + " " + "use!"} does not have an integer result: "no use!"'
    );
});

Deno.test("evaluate throws on Javascript errors", () => {
    const handler = newContext();
    assertThrows(
        () => handler.evaluate("plop * 10;"),
        ReferenceError,
        "plop is not defined"
    );
});
