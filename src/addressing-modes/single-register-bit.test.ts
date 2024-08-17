import { newContext } from "../context/mod.ts";
import { generator } from "../generate/mod.ts";
import { type Tests, testing } from "./testing.ts";

const generate = generator(newContext(0));

// The bytes for these tests were generated by the last version of GAVRAsm
// that I could get hold of.

const tests: Tests = [
    [["", "BLD", ["R11", "1"]], [0xb1, 0xf8]],
    [["", "BST", ["R12", "3"]], [0xc3, 0xfa]],
    [["", "SBRC", ["R20", "3"]], [0x43, 0xfd]],
    [["", "SBRS", ["R21", "6"]], [0x56, 0xff]],
];

testing(tests, generate);
