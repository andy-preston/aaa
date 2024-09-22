import { assertEquals } from "assert";
import { createOurContext } from "../context/mod.ts";
import { languageSplit } from "./language-split.ts";

Deno.test("JS can be delimited with moustaches on the same line", () => {
    const split = languageSplit(createOurContext());
    const result = split("MOV {{ this.test = 27; return this.test; }}, R2");
    assertEquals(result, "MOV 27, R2");
});

Deno.test("JS can use registers from the context", () => {
    const split = languageSplit(createOurContext());
    const result = split("MOV {{ R6 }}, R2");
    assertEquals(result, "MOV 6, R2");
});

Deno.test("JS can be delimited by moustaches across several lines", () => {
    const split = languageSplit(createOurContext());
    const firstResult = split("some ordinary stuff {{ this.test = 27;").trim();
    assertEquals(firstResult, "some ordinary stuff");
    const secondResult = split('this.andThat = "hello";');
    assertEquals(secondResult, "");
    const thirdResult = split("return this.andThat; }} matey!");
    assertEquals(thirdResult, "hello matey!");
});
