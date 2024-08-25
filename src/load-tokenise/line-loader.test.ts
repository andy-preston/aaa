import { assertEquals } from "assert";
import { newContext } from "../context/mod.ts";
import { newLineLoader } from "./line-loader.ts";

Deno.test(
    "Javascript can be delimited with moustaches on the same line",
    () => {
        const loader = newLineLoader(newContext());
        assertEquals(
            loader("MOV {{ this.test = 27; return this.test; }}, R2"),
            "MOV 27, R2"
        );
    }
);

Deno.test(
    "Javascript can use registers from the context",
    () => {
        const loader = newLineLoader(newContext());
        assertEquals(
            loader("MOV {{ R6 }}, R2"),
            "MOV 6, R2"
        );
    }
);

Deno.test(
    "Javascript can be delimited by moustaches across several lines",
    () => {
        const loader = newLineLoader(newContext());
        assertEquals(
            loader("some ordinary stuff {{ this.test = 27;").trim(),
            "some ordinary stuff"
        );
        assertEquals(
            loader("this.andThat = \"hello\";"),
            ""
        );
        assertEquals(
            loader("return this.andThat; }} matey!"),
            "hello matey!"
        );
    }
);
