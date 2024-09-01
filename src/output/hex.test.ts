import { assert, assertEquals } from "assert";
import type { GeneratedCode } from "../generate/mod.ts";
import { intelHex } from "./hex.ts";

const recordLength = (dataBytes: number): number => {
    // specification from https://en.wikipedia.org/wiki/Intel_HEX
    const startCodeLength = 1;
    const byteCountLength = 2;
    const addressLength = 4;
    const recordTypeLength = 2;
    const dataLength = dataBytes * 2;
    const checksumLength = 2;
    // biome-ignore format:
    return startCodeLength + byteCountLength + addressLength +
        recordTypeLength + dataLength + checksumLength;
};

const mockFile = () => {
    const lines: Array<string> = [];
    return {
        "writeLine": (text: string) => lines.push(text),
        "lines": lines
    };
};

const testCode: Array<[number, GeneratedCode]> = [
    // As ever, obtained from my last, treasured version of GAVRASM
    [0x000000, [0x2c, 0x24]], //            MOV R2, R4
    [0x000001, [0x94, 0x53]], //            INC R5
    [0x000002, [0x94, 0x6a]], //            DEC R6
    [0x000003, [0x72, 0x03]], //            ANDI R16, 0x23
    [0x000004, [0x64, 0x22]], //            ORI R18, 0x42
    [0x000005, [0xe0, 0x15]], //            LDI R17, 5
    [0x000006, [0xb8, 0x0a]], //      path: OUT 10, R0
    [0x000007, [0xb2, 0x04]], //            IN R0, 20 /
    [0x000008, [0xf7, 0xe9]], //            BRNE path
    [0x000009, [0x94, 0x0c, 0x00, 0x14]] // JMP 20
];

Deno.test("Test data comes out the same as GAVRASM .HEX file", () => {
    const expectedResults = [
        ":020000020000FC",
        ":10000000242C53946A940372226415E00AB804B253",
        ":06001000E9F70C94140056",
        ":00000001FF"
    ];
    const file = mockFile();
    const hex = intelHex();
    for (const [address, code] of testCode) {
        hex.add(address, code);
    }
    hex.save(file.writeLine);
    for (const [index, line] of file.lines.entries()) {
        assertEquals(line, expectedResults[index]);
    }
});

Deno.test("Every file starts with an extended segment address of zero", () => {
    const file = mockFile();
    intelHex().save(file.writeLine);
    assertEquals(":020000020000FC", file.lines[0]);
});

Deno.test("Every file ends with an end-of-file marker", () => {
    const file = mockFile();
    intelHex().save(file.writeLine);
    assertEquals(":00000001FF", file.lines.pop());
});

Deno.test("Each record begins with a start code", () => {
    const file = mockFile();
    const hex = intelHex();
    for (const [address, code] of testCode) {
        hex.add(address, code);
    }
    hex.save(file.writeLine);
    for (const line of file.lines) {
        assert(line.startsWith(":"));
    }
});

Deno.test("Each record contains a maximum of 0x10 bytes", () => {
    const file = mockFile();
    const hex = intelHex();
    for (const [address, code] of testCode) {
        hex.add(address, code);
    }
    hex.save(file.writeLine);
    const firstRecord = file.lines[1]!;
    assertEquals("10", firstRecord.substring(1, 3));
    assertEquals(recordLength(16), firstRecord.length);
});

Deno.test("The remainder of the bytes form the last record", () => {
    const file = mockFile();
    const hex = intelHex();
    for (const [address, code] of testCode) {
        hex.add(address, code);
    }
    hex.save(file.writeLine);
    const lastRecord = file.lines[2]!;
    assertEquals("06", lastRecord.substring(1, 3));
    assertEquals(recordLength(6), lastRecord.length);
});

Deno.test("If the address jumps out of sequence, a new record starts", () => {
    // TODO:
});
