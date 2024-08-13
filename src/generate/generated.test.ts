/*
import { assertEquals, assertThrows } from "assert";
import { type GeneratedCode, littleEndian } from "./generated-code.ts";
import { type Instruction, instruction } from "../instruction/mod.ts";
import type { Operands } from "../operands/mod.ts";
import { encoder } from "./encode.ts";

const R0 = 0;
const R1 = 1;
const R2 = 2;
const R3 = 3;
const R4 = 4;
const R5 = 5;
const R6 = 6;
const R7 = 7;
const R8 = 8;
const R9 = 9;
const R10 = 10;
const R11 = 11;
const R12 = 12;
const R13 = 13;
const R14 = 14;
const R15 = 15;
const R16 = 16;
const R17 = 17;
const R18 = 18;
const R19 = 19;
const R20 = 20;
const R21 = 21;
const R22 = 22;
const R23 = 23;
// const R24 = 24;
// const R25 = 25;
const R26 = 26;
const R30 = 30;
const R31 = 31;
const Z = R30;
const branch = 0x00000C;

type Expected = [GeneratedCode, string, Operands];

// The initial test results come from assembly with the last edition of
// GAVRAsm that I could get hold of.
const expectedResults: Array<Expected> = [
    [[0x12, 0x1C], "ADC", [R1, R2]],
    [[0x34, 0x0C], "ADD", [R3, R4]],
    [[0x15, 0x96], "ADIW", [R26, 5]],
    [[0x78, 0x20], "AND", [R7, R8]],
    [[0xA5, 0x94], "ASR", [R10]],
    [[0xF8, 0x94], "BCLR", [7]],
    [[0xB1, 0xF8], "BLD", [R11, 1]],
    [[0x18, 0x94], "BSET", [1]],
    [[0xC3, 0xFA], "BST", [R12, 3]],
    [[0x0E, 0x94, 0x0C, 0x00], "CALL", [branch]],
    [[0xF1, 0x98], "CBI", [30, 1]],
    [[0x88, 0x94], "CLC", []],
    [[0xD8, 0x94], "CLH", []],
    [[0xF8, 0x94], "CLI", []],
    [[0xA8, 0x94], "CLN", []],
    [[0xEE, 0x24], "CLR", [R14]],
    [[0xC8, 0x94], "CLS", []],
    [[0xE8, 0x94], "CLT", []],
    [[0xB8, 0x94], "CLV", []],
    [[0x98, 0x94], "CLZ", []],
    [[0xE0, 0x94], "COM", [R14]],
    [[0xF0, 0x16], "CP", [R15, R16]],
    [[0x12, 0x07], "CPC", [R17, R18]],
    [[0x45, 0x13], "CPSE", [R20, R21]],
    [[0x6A, 0x95], "DEC", [R22]],
    [[0x70, 0x25], "EOR", [R23, R0]],
    [[0x35, 0xB7], "IN", [R19, 53]],
    [[0x43, 0x95], "INC", [R20]],
    [[0x0C, 0x94, 0x0C, 0x00], "JMP", [branch]],
    [[0x46, 0x93], "LAC", [Z, R20]],
    [[0x55, 0x93], "LAS", [Z, R21]],
    [[0x67, 0x93], "LAT", [Z, R22]],
    [[0xec, 0x90], "LD.X", [R14]], // LD R14, X
    [[0xfd, 0x90], "LD.X+", [R15]], // LD R15, X+
    [[0x0e, 0x91], "LD.-X", [R16]], // LD R16, -X
    [[0x18, 0x81], "LD.Y", [R17]], // LD R17, Y
    [[0x29, 0x91], "LD.Y+", [R18]], // LD R18, Y+
    [[0x3a, 0x91], "LD.-Y", [R19]], // LD R19, -Y
    // [[0x48, 0x85], "LDD.Y", [R20, 8]], // LDD R20, Y+8
    [[0x50, 0x81], "LD.Z", [R21]], // LD R21, Z
    [[0x61, 0x91], "LD.Z+", [R22]], // LD R22, Z+
    [[0x72, 0x91], "LD.-Z", [R23]], // LD R23, -Z
    // [[0x86, 0x81], "LDD.Z", [R24, 6]], // LDD R24, Z+6
    [[0x55, 0x0C], "LSL", [R5]],
    [[0x66, 0x94], "LSR", [R6]],
        [["", "MUL", ["R8", "R16"]], [0x80, 0x9E]],

    [[0x78, 0x2C], "MOV", [R7, R8]],
    [[0x45, 0x01], "MOVW", [R8, R10]],
    [[0xB1, 0x94], "NEG", [R11]],
    [[0xCD, 0x28], "OR", [R12, R13]],
    [[0x09, 0xBB], "OUT", [25, R16]],
    [[0x6F, 0x90], "POP", [R6]],
    [[0x7F, 0x92], "PUSH", [R7]],
    // Need a better test for relative stuffs
    // [[0xB7, 0xDF], "RCALL", [branch]],
    // Need a better test for relative stuffs
    // [[0xB4, 0xCF], "RJMP", [branch]],
    [[0x44, 0x1F], "ROL", [R20]],
    [[0x37, 0x95], "ROR", [R19]],
    [[0x42, 0x09], "SBC", [R20, R2]],
    [[0xE5, 0x9A], "SBI", [28, 5]],
    [[0xEC, 0x99], "SBIC", [29, 4]],
    [[0xF3, 0x9B], "SBIS", [30, 3]],
    [[0xD9, 0x97], "SBIW", [R26, 57]],
    [[0x43, 0xFD], "SBRC", [R20, 3]],
    [[0x56, 0xFF], "SBRS", [R21, 6]],
    [[0x08, 0x94], "SEC", []],
    [[0x58, 0x94], "SEH", []],
    [[0x78, 0x94], "SEI", []],
    [[0x28, 0x94], "SEN", []],
    [[0x48, 0x94], "SES", []],
    [[0x68, 0x94], "SET", []],
    [[0x38, 0x94], "SEV", []],
    [[0x18, 0x94], "SEZ", []],
    [[0x0c, 0x92], "ST.X", [R0]], // ST X, R0
    [[0x1d, 0x92], "ST.X+", [R1]], // ST X+, R1
    [[0x2e, 0x92], "ST.-X", [R2]], // ST -X, R2
    [[0x38, 0x82], "ST.Y", [R3]], // ST Y, R3
    [[0x49, 0x92], "ST.Y+", [R4]], // ST Y+, R4
    [[0x5a, 0x92], "ST.-Y", [R5]], // ST -Y, R5
    // [[0x69, 0x86], "STD.Y", [R6, 9]], // STD Y+9, R6
    [[0x70, 0x82], "ST.Z", [R7]], // ST Z, R7
    [[0x81, 0x92], "ST.Z+", [R8]], // ST Z+, R8
    [[0x92, 0x92], "ST.-Z", [R9]], // ST -Z, R9
    // [[0xa5, 0x86], "STD.Z", [R10, 13]], // STD Z+13, R10
    [[0x12, 0x18], "SUB", [R1, R2]],
    [[0x72, 0x94], "SWAP", [R7]],
    [[0x88, 0x20], "TST", [R8]],
    // XCH.Z
];

const testEncode = (
    instruction: Instruction,
    programCounter: number
): GeneratedCode | undefined => {
    try {
        return littleEndian(encode(instruction, programCounter));
    } catch (error) {
        throw new Error(
            `error testing ${instruction.mnemonic}`,
            {"cause": error}
        );
    }
};

Deno.test("Code generation is the same as GAVRAsm", () => {
    let programCounter = 0;
    for (const test of expectedResults) {
        const [expected, mnemonic, operands] = test;
        const generatedCode = testEncode(
            instruction(mnemonic, operands),
            programCounter
        );
        assertEquals(
            generatedCode,
            expected,
            `Code generation failed for ${mnemonic} ${operands}`
        );
        programCounter += generatedCode!.length / 2;
    }
});
*/