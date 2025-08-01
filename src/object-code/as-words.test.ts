import { expect } from "jsr:@std/expect/expect";
import { testSystem } from "./testing.ts";

Deno.test("code is chunked into byte pairs", () => {
    const systemUnderTest = testSystem();
    systemUnderTest.objectCode.poke(1, 2, 3, 4);
    expect(systemUnderTest.currentLine().code).toEqual([
        [1, 2], [3, 4]
    ]);
});

Deno.test("an odd number of bytes is zero padded", () => {
    const systemUnderTest = testSystem();
    systemUnderTest.objectCode.poke(1, 2, 3, 4, 5);
    expect(systemUnderTest.currentLine().code).toEqual([
        [1, 2], [3, 4], [5, 0]
    ]);
});
