import { createOurContext } from "../context/mod.ts";
import { type Tests, testing } from "./testing.ts";

// The bytes for these tests were generated by the last version of GAVRAsm
// that I could get hold of.

const tests: Tests = [
    [["BLD",  ["R11", "1"]], [0xf8, 0xb1]],
    [["BST",  ["R12", "3"]], [0xfa, 0xc3]],
    [["SBRC", ["R20", "3"]], [0xfd, 0x43]],
    [["SBRS", ["R21", "6"]], [0xff, 0x56]]
];

testing(tests, createOurContext());
