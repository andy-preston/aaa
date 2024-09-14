import { assertEquals } from "assert";
import { createOurContext } from "../context/mod.ts";
import { lineLoader } from "./line-loader.ts";

Deno.test("JS can be delimited with moustaches on the same line", () => {
    const loader = lineLoader(createOurContext());
    const result = loader("MOV {{ this.test = 27; return this.test; }}, R2");
    assertEquals(result, "MOV 27, R2");
});

Deno.test("JS can use registers from the context", () => {
    const loader = lineLoader(createOurContext());
    const result = loader("MOV {{ R6 }}, R2");
    assertEquals(result, "MOV 6, R2");
});

Deno.test("JS can be delimited by moustaches across several lines", () => {
    const loader = lineLoader(createOurContext());
    const firstResult = loader("some ordinary stuff {{ this.test = 27;").trim();
    assertEquals(firstResult, "some ordinary stuff");
    const secondResult = loader('this.andThat = "hello";');
    assertEquals(secondResult, "");
    const thirdResult = loader("return this.andThat; }} matey!");
    assertEquals(thirdResult, "hello matey!");
});
