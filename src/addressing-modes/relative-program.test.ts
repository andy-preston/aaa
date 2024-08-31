import { assertThrows } from "assert";
import { createOurContext } from "../context/mod.ts";
import { generator } from "../generate/mod.ts";
import { type Tests, testing } from "./testing.ts";

const context = createOurContext();
context.label("branch");
context.theirs.flashOrg = 3;
const generate = generator(context);

// The bytes for these tests were generated by the last version of GAVRAsm
// that I could get hold of.

// Need a better test for all of this stuff but especially anything relative

const tests: Tests = [
    [
        ["", "RCALL", ["branch"]],
        [0xfc, 0xdf]
    ],
    [
        ["", "RJMP", ["branch"]],
        [0xfb, 0xcf]
    ]
];

testing(tests, generate);

Deno.test("Absolute address too high on RJMP instruction", () => {
    assertThrows(
        () => generate(["", "RJMP", ["0x1111"]]),
        RangeError,
        "Operand out of range - expecting branch to 12 bit range (0 - 0x1000) (4 K) not 0x1111"
    );
});

Deno.test("Absolute address too low on RCALL instruction", () => {
    assertThrows(
        () => generate(["", "RCALL", ["-10"]]),
        RangeError,
        "Operand out of range - expecting branch to 12 bit range (0 - 0x1000) (4 K) not -10"
    );
});
