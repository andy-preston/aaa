import { assertEquals } from "assert";
import { createOurContext } from "../context/mod.ts";
import { languageSplit, newSplitter } from "./language-split.ts";
import { theirContext } from "../context/their-context.ts";

Deno.test("JS can be delimited with moustaches on the same line", () => {
    newSplitter(createOurContext(theirContext()));
    const result = languageSplit(
        "MOV {{ this.test = 27; return this.test; }}, R2"
    );
    assertEquals(result, "MOV 27, R2");
});

Deno.test("JS can use registers from the context", () => {
    newSplitter(createOurContext(theirContext()));
    const result = languageSplit("MOV {{ R6 }}, R2");
    assertEquals(result, "MOV 6, R2");
});

Deno.test("JS can be delimited by moustaches across several lines", () => {
    newSplitter(createOurContext(theirContext()));
    const firstResult = languageSplit(
        "some ordinary stuff {{ this.test = 27;"
    );
    assertEquals(firstResult, "some ordinary stuff");
    const secondResult = languageSplit('this.andThat = "hello";');
    assertEquals(secondResult, "");
    const thirdResult = languageSplit("return this.andThat; }} matey!");
    assertEquals(thirdResult, "hello matey!");
});
