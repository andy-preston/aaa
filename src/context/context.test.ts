import { assertEquals, assertThrows } from "assert";
import { coupledProperty, directive, inContext, newContext } from "./context.ts";

Deno.test("Simple expressions do not require a `return`", () => {
    newContext
    const result = inContext("20 / 2");
    assertEquals(result, "10");
});

Deno.test("...but you can include one if you want", () => {
    newContext()
    const result = inContext("return R20 / 2");
    assertEquals(result, "10");
});

Deno.test("If the result is undefined, inContext returns empty string", () => {
    newContext();
    const result = inContext("undefined;");
    assertEquals(result, "");
});

Deno.test("A plain assignment will not return a value", () => {
    newContext();
    const result = inContext("this.test = 4;");
    assertEquals(result, "");
});

Deno.test("Javascript can contain newlines", () => {
    newContext();
    const result = inContext(
        "this.test1 = 4;\nthis.test2 = 6;\n return test1 + test2;"
    );
    assertEquals(result, "10");
});

Deno.test("An unknown variable throws a reference error", () => {
    newContext();
    assertThrows(
        () => inContext("this.test = plop * 10;"),
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
    inContext("testDirective('says hello')");
    assertEquals(directiveParameter, "says hello");
});

Deno.test("Syntax errors get thrown too", () => {
    newContext();
    assertThrows(
        () => inContext("this is just nonsense"),
        SyntaxError,
        "Unexpected identifier 'is'"
    );
});

Deno.test("Coupled properties can be an arrow function", () => {
    const aFunction = () => 57;
    coupledProperty("testProperty", aFunction);
    const result = inContext("testProperty");
    assertEquals(result, "57");
});
