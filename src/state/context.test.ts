import { assertEquals, assertThrows } from "assert";
import { newContext } from "./context.ts";
import { newPass } from "./pass.ts";
import { newState } from "./mod.ts";

Deno.test("Simple expressions do not require a `return`", () => {
    const context = newContext(newPass(() => {}));
    const result = context.value("20 / 2");
    assertEquals(result, "10");
});

Deno.test("...but you can include one if you want", () => {
    const state = newState();
    state.device.choose("dummy", { "reducedCore": false });
    const result = state.context.value("return R20 / 2");
    assertEquals(result, "10");
});

Deno.test("If the result is undefined, inContext returns empty string", () => {
    const context = newContext(newPass(() => {}));
    const result = context.value("undefined;");
    assertEquals(result, "");
});

Deno.test("A plain assignment will not return a value", () => {
    const context = newContext(newPass(() => {}));
    const result = context.value("this.test = 4;");
    assertEquals(result, "");
});

Deno.test("Javascript can contain newlines", () => {
    const context = newContext(newPass(() => {}));
    const result = context.value(
        "this.test1 = 4;\nthis.test2 = 6;\n return test1 + test2;"
    );
    assertEquals(result, "10");
});

Deno.test("An unknown variable throws a reference error", () => {
    const context = newContext(newPass(() => {}));
    assertThrows(
        () => context.value("this.test = plop * 10;"),
        ReferenceError,
        "plop is not defined"
    );
});

Deno.test("Any directives that are added can be called as functions", () => {
    let directiveParameter = "";
    const testDirective = (parameter: string): void => {
        directiveParameter = parameter;
    };
    const context = newContext(newPass(() => {}));
    context.directive("testDirective", testDirective);
    context.value("testDirective('says hello')");
    assertEquals(directiveParameter, "says hello");
});

Deno.test("Syntax errors get thrown too", () => {
    const context = newContext(newPass(() => {}));
    assertThrows(
        () => context.value("this is just nonsense"),
        SyntaxError,
        "Unexpected identifier 'is'"
    );
});

Deno.test("Coupled properties can be an arrow function", () => {
    const aFunction = () => 57;
    const context = newContext(newPass(() => {}));
    context.coupledProperty("testProperty", aFunction);
    const result = context.value("testProperty");
    assertEquals(result, "57");
});
