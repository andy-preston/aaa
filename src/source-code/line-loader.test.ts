import { assertEquals } from "assert";
import { newContext } from "../context/mod.ts";
import { lineLoader } from "./line-loader.ts";

Deno.test(
    "Javascript can be delimited with moustaches on the same line",
    () => {
        const loader = lineLoader(newContext());
        assertEquals(
            loader("MOV {{ this.test = 27; this.test; }}, R2"),
            "MOV 27, R2"
        );
    }
);

Deno.test(
    "Javascript can be delimited by moustaches across several lines",
    () => {
        const loader = lineLoader(newContext());
        assertEquals(
            loader("some ordinary stuff {{ this.test = 27;").trim(),
            "some ordinary stuff"
        );
        assertEquals(
            loader("this.andThat = \"hello\";"),
            ""
        );
        assertEquals(
            loader("this.andThat; }} matey!"),
            "hello matey!"
        );
    }
);
