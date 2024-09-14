import { assertEquals, assertThrows } from "assert";
import { createOurContext } from "./our-context.ts";

Deno.test("Simple expressions do not require a `return`", () => {
    const ourContext = createOurContext();
    const result = ourContext.execute("20 / 2");
    assertEquals(result, "10");
});

Deno.test("...but you can include one if you want", () => {
    const ourContext = createOurContext();
    const result = ourContext.execute("return R20 / 2");
    assertEquals(result, "10");
});

Deno.test("If the result is undefined, execute returns empty string", () => {
    const ourContext = createOurContext();
    const result = ourContext.execute("undefined;");
    assertEquals(result, "");
});

Deno.test("A plain assignment will not return a value", () => {
    const ourContext = createOurContext();
    const result = ourContext.execute("this.test = 4;");
    assertEquals(result, "");
});

Deno.test("Javascript can contain newlines", () => {
    const ourContext = createOurContext();
    const result = ourContext.execute(
        "this.test1 = 4;\nthis.test2 = 6;\n return test1 + test2;"
    );
    assertEquals(result, "10");
});

Deno.test("An unknown variable throws a reference error", () => {
    const ourContext = createOurContext();
    assertThrows(
        () => ourContext.execute("this.test = plop * 10;"),
        ReferenceError,
        "plop is not defined"
    );
});

Deno.test("Any directives that are added can be called as functions", () => {
    let directiveParameter = "";
    const testDirective = (parameter: string): void => {
        directiveParameter = parameter;
    };
    const ourContext = createOurContext();
    ourContext.addDirective(["testDirective", testDirective]);
    ourContext.execute("testDirective('says hello')");
    assertEquals(directiveParameter, "says hello");
});

Deno.test("Syntax errors get thrown too", () => {
    const ourContext = createOurContext();
    assertThrows(
        () => ourContext.execute("this is just nonsense"),
        SyntaxError,
        "Unexpected identifier 'is'"
    );
});
