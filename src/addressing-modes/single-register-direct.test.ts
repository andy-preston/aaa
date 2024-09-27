import { createOurContext, theirContext } from "../context/mod.ts";
import { type Tests, testing } from "./testing.ts";

// The bytes for these tests were generated by the last version of GAVRAsm
// that I could get hold of.

const tests: Tests = [
    [["POP",  [     "R6" ]], [0x90, 0x6f]],
    [["PUSH", [     "R7" ]], [0x92, 0x7f]],
    [["LAC",  ["Z", "R20"]], [0x93, 0x46]],
    [["LAS",  ["Z", "R21"]], [0x93, 0x55]],
    [["LAT",  ["Z", "R22"]], [0x93, 0x67]],
    [["COM",  [     "R14"]], [0x94, 0xe0]],
    [["DEC",  [     "R22"]], [0x95, 0x6a]],
    [["INC",  [     "R20"]], [0x95, 0x43]],
    [["LSR",  [     "R6" ]], [0x94, 0x66]],
    [["ASR",  [     "R10"]], [0x94, 0xa5]],
    [["NEG",  [     "R11"]], [0x94, 0xb1]],
    [["SWAP", [     "R7" ]], [0x94, 0x72]],
    [["ROR",  [     "R19"]], [0x95, 0x37]],
    [["XCH",  ["Z", "R15"]], [0x92, 0xf4]]
];

testing(tests, createOurContext(theirContext()));
