import { newContext } from "../context/mod.ts";
import { generator } from "../generate/mod.ts";
import { testing, type Tests } from "./testing.ts";

const context = newContext(0);
context.label("branch")
context.org(3);

// The bytes for these tests were generated by the last version of GAVRAsm
// that I could get hold of.

const tests: Tests = [
    [["", "BRBC", ["4", "branch"]], [0xe4, 0xf7]],
    [["", "BRBS", ["3", "branch"]], [0xdb, 0xf3]],
    [["", "BRCC", ["branch"]], [0xd0, 0xf7]],
    [["", "BRCS", ["branch"]], [0xc8, 0xf3]],
    [["", "BREQ", ["branch"]], [0xc1, 0xf3]],
    [["", "BRGE", ["branch"]], [0xbc, 0xf7]],
    [["", "BRHC", ["branch"]], [0xb5, 0xf7]],
    [["", "BRHS", ["branch"]], [0xad, 0xf3]],
    [["", "BRID", ["branch"]], [0xa7, 0xf7]],
    [["", "BRIE", ["branch"]], [0x9f, 0xf3]],
    [["", "BRLO", ["branch"]], [0x90, 0xf3]],
    [["", "BRLT", ["branch"]], [0x8c, 0xf3]],
    [["", "BRMI", ["branch"]], [0x82, 0xf3]],
    [["", "BRNE", ["branch"]], [0x79, 0xf7]],
    [["", "BRPL", ["branch"]], [0x72, 0xf7]],
    [["", "BRSH", ["branch"]], [0x68, 0xf7]],
    [["", "BRTC", ["branch"]], [0x66, 0xf7]],
    [["", "BRTS", ["branch"]], [0x5e, 0xf3]],
    [["", "BRVC", ["branch"]], [0x53, 0xf7]],
    [["", "BRVS", ["branch"]], [0x4b, 0xf3]]
];

testing(tests, generator(context));
