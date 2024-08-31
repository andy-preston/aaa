import { createOurContext } from "../context/mod.ts";
import { generator } from "../generate/mod.ts";
import { type Tests, testing } from "./testing.ts";

const context = createOurContext();
context.label("branch");
context.theirs.flashOrg = 3;

// The bytes for these tests were generated by the last version of GAVRAsm
// that I could get hold of.

const tests: Tests = [
    [
        ["", "CALL", ["branch"]],
        [0x0e, 0x94, 0, 0]
    ],
    [
        ["", "JMP", ["branch"]],
        [0x0c, 0x94, 0, 0]
    ]
];

testing(tests, generator(context));
