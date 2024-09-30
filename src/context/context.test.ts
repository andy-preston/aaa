import { assertEquals, assertThrows } from "assert";
import { coupledProperty, directive, execute, newContext } from "./context.ts";

Deno.test("Simple expressions do not require a `return`", () => {
    newContext
    const result = execute("20 / 2");
    assertEquals(result, "10");
});

Deno.test("...but you can include one if you want", () => {
    newContext()
    const result = execute("return R20 / 2");
    assertEquals(result, "10");
});

Deno.test("If the result is undefined, execute returns empty string", () => {
    newContext();
    const result = execute("undefined;");
    assertEquals(result, "");
});

Deno.test("A plain assignment will not return a value", () => {
    newContext();
    const result = execute("this.test = 4;");
    assertEquals(result, "");
});

Deno.test("Javascript can contain newlines", () => {
    newContext();
    const result = execute(
        "this.test1 = 4;\nthis.test2 = 6;\n return test1 + test2;"
    );
    assertEquals(result, "10");
});

Deno.test("An unknown variable throws a reference error", () => {
    newContext();
    assertThrows(
        () => execute("this.test = plop * 10;"),
        ReferenceError,
        "plop is not defined"
    );
});

Deno.test("Any directives that are added can be called as functions", () => {
    let directiveParameter = "";
    const testDirective = (parameter: string): void => {
        directiveParameter = parameter;
    };
    newContext();
    directive("testDirective", testDirective);
    execute("testDirective('says hello')");
    assertEquals(directiveParameter, "says hello");
});

Deno.test("Syntax errors get thrown too", () => {
    newContext();
    assertThrows(
        () => execute("this is just nonsense"),
        SyntaxError,
        "Unexpected identifier 'is'"
    );
});

Deno.test("Coupled properties can be an arrow function", () => {
    const aFunction = () => 57;
    coupledProperty("testProperty", aFunction);
    const result = execute("testProperty");
    assertEquals(result, "57");
});
