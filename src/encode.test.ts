import { assertEquals } from "assert";
import type { GeneratedCode } from "./binaryTemplate.ts";
import { type Instruction, encode, instruction } from "./instruction.ts";
import type { Operands } from "./operands.ts";

const R0 = 0;
const R1 = 1;
const R2 = 2;
const R3 = 3;
const R4 = 4;
const R5 = 5;
const R6 = 6;
const R7 = 7;
const R8 = 8;
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
const R26 = 26;
const R30 = 30;
const R31 = 31;
const Z = R30;
const branch = 0x00000C;
// cSpell:words GAVRAsm

type Expected = [number, GeneratedCode, string, Operands];

// The initial test results come from assembly with the last edition of
// GAVRAsm that I could get hold of.
const expectedResults: Array<Expected> = [
    [0x000000, [0x12, 0x1C], "ADC", [R1, R2]],
    [0x000001, [0x34, 0x0C], "ADD", [R3, R4]],
    [0x000002, [0x15, 0x96], "ADIW", [R26, 5]],
    [0x000003, [0x78, 0x20], "AND", [R7, R8]],
    [0x000004, [0x46, 0x70], "ANDI", [R20, 6]],
    [0x000005, [0xA5, 0x94], "ASR", [R10]],
    [0x000006, [0xF8, 0x94], "BCLR", [7]],
    [0x000007, [0x24, 0xF4], "BRBC", [4, branch]],
    [0x000008, [0x1B, 0xF0], "BRBS", [3, branch]],
    [0x000009, [0x10, 0xF4], "BRCC", [branch]],
    [0x00000A, [0x08, 0xF0], "BRCS", [branch]],
    [0x00000B, [0xB1, 0xF8], "BLD", [R11, 1]],
    [0x00000C, [0x98, 0x95], "BREAK", []],
    [0x00000D, [0xF1, 0xF3], "BREQ", [branch]],
    [0x00000E, [0xEC, 0xF7], "BRGE", [branch]],
    [0x00000F, [0xE5, 0xF7], "BRHC", [branch]],
    [0x000010, [0xDD, 0xF3], "BRHS", [branch]],
    [0x000011, [0xD7, 0xF7], "BRID", [branch]],
    [0x000012, [0xCF, 0xF3], "BRIE", [branch]],
    [0x000013, [0xC0, 0xF3], "BRLO", [branch]],
    [0x000014, [0xBC, 0xF3], "BRLT", [branch]],
    [0x000015, [0xB2, 0xF3], "BRMI", [branch]],
    [0x000016, [0xA9, 0xF7], "BRNE", [branch]],
    [0x000017, [0xA2, 0xF7], "BRPL", [branch]],
    [0x000018, [0x98, 0xF7], "BRSH", [branch]],
    [0x000019, [0x96, 0xF7], "BRTC", [branch]],
    [0x00001A, [0x8E, 0xF3], "BRTS", [branch]],
    [0x00001B, [0x83, 0xF7], "BRVC", [branch]],
    [0x00001C, [0x7B, 0xF3], "BRVS", [branch]],
    [0x00001D, [0x18, 0x94], "BSET", [1]],
    [0x00001E, [0xC3, 0xFA], "BST", [R12, 3]],
    [0x00001F, [0x0E, 0x94, 0x0C, 0x00], "CALL", [branch]],
    [0x000021, [0xF1, 0x98], "CBI", [30, 1]],
    [0x000022, [0x7F, 0x77], "CBR", [R23, 128]],
    [0x000023, [0x88, 0x94], "CLC", []],
    [0x000024, [0xD8, 0x94], "CLH", []],
    [0x000025, [0xF8, 0x94], "CLI", []],
    [0x000026, [0xA8, 0x94], "CLN", []],
    [0x000027, [0xEE, 0x24], "CLR", [R14]],
    [0x000028, [0xC8, 0x94], "CLS", []],
    [0x000029, [0xE8, 0x94], "CLT", []],
    [0x00002A, [0xB8, 0x94], "CLV", []],
    [0x00002B, [0x98, 0x94], "CLZ", []],
    [0x00002C, [0xE0, 0x94], "COM", [R14]],
    [0x00002D, [0xF0, 0x16], "CP", [R15, R16]],
    [0x00002E, [0x12, 0x07], "CPC", [R17, R18]],
    [0x00002F, [0x35, 0x33], "CPI", [R19, 53]],
    [0x000030, [0x45, 0x13], "CPSE", [R20, R21]],
    [0x000031, [0x6A, 0x95], "DEC", [R22]],
    [0x000032, [0xFB, 0x94], "DES", [15]],
    [0x000033, [0x19, 0x95], "EICALL", []],
    [0x000034, [0x19, 0x94], "EIJMP", []],
    // ELPM
    // ELPM.Z
    // ELPM.Z+
    [0x000035, [0x70, 0x25], "EOR", [R23, R0]],
    [0x000036, [0x0F, 0x03], "FMUL", [R16, R23]],
    [0x000037, [0x94, 0x03], "FMULS", [R17, R20]],
    [0x000038, [0xAD, 0x03], "FMULSU", [R18, R21]],
    [0x000039, [0x09, 0x95], "ICALL", []],
    [0x00003A, [0x09, 0x94], "IJMP", []],
    [0x00003B, [0x35, 0xB7], "IN", [R19, 53]],
    [0x00003C, [0x43, 0x95], "INC", [R20]],
    [0x00003D, [0x0C, 0x94, 0x0C, 0x00], "JMP", [branch]],
    [0x00003F, [0x46, 0x93], "LAC", [Z, R20]],
    [0x000040, [0x55, 0x93], "LAS", [Z, R21]],
    [0x000041, [0x67, 0x93], "LAT", [Z, R22]],
    [0x000042, [0x1D, 0xE4], "LDI", [R17, 77]],
    // LD.X
    // LD.X+
    // LD.-X
    // LD.Y
    // LD.Y+
    // LD.-Y
    // LDD.Y
    // LD.Z
    // LD.Z+
    // LD.-Z
    // LDD.Z
    [0x000043, [0xE0, 0x91, 0x00, 0x04], "LDS", [R30, 1024]],
    // LDS.RC
    [0x000045, [0xC8, 0x95], "LPM", []],
    // LPM.Z
    // LPM.Z+
    [0x000046, [0x55, 0x0C], "LSL", [R5]],
    [0x000047, [0x66, 0x94], "LSR", [R6]],
    [0x000048, [0x78, 0x2C], "MOV", [R7, R8]],
    [0x000049, [0x45, 0x01], "MOVW", [R8, R10]],
    [0x00004A, [0x80, 0x9E], "MUL", [R8, R16]],
    [0x00004B, [0x0F, 0x02], "MULS", [R16, R31]],
    [0x00004C, [0x02, 0x03], "MULSU", [R16, R18]],
    [0x00004D, [0xB1, 0x94], "NEG", [R11]],
    [0x00004E, [0x00, 0x00], "NOP", []],
    [0x00004F, [0xCD, 0x28], "OR", [R12, R13]],
    [0x000050, [0x16, 0x65], "ORI", [R17, 86]],
    [0x000051, [0x09, 0xBB], "OUT", [25, R16]],
    [0x000052, [0x6F, 0x90], "POP", [R6]],
    [0x000053, [0x7F, 0x92], "PUSH", [R7]],
    [0x000054, [0xB7, 0xDF], "RCALL", [branch]],
    [0x000055, [0x08, 0x95], "RET", []],
    [0x000056, [0x18, 0x95], "RETI", []],
    [0x000057, [0xB4, 0xCF], "RJMP", [branch]],
    [0x000058, [0x44, 0x1F], "ROL", [R20]],
    [0x000059, [0x37, 0x95], "ROR", [R19]],
    [0x00005A, [0x42, 0x09], "SBC", [R20, R2]],
    [0x00005B, [0x23, 0x41], "SBCI", [R18, 19]],
    [0x00005C, [0xE5, 0x9A], "SBI", [28, 5]],
    [0x00005D, [0xEC, 0x99], "SBIC", [29, 4]],
    [0x00005E, [0xF3, 0x9B], "SBIS", [30, 3]],
    [0x00005F, [0xD9, 0x97], "SBIW", [R26, 57]],
    [0x000060, [0x30, 0x64], "SBR", [R19, 64]],
    [0x000061, [0x43, 0xFD], "SBRC", [R20, 3]],
    [0x000062, [0x56, 0xFF], "SBRS", [R21, 6]],
    [0x000063, [0x08, 0x94], "SEC", []],
    [0x000064, [0x58, 0x94], "SEH", []],
    [0x000065, [0x78, 0x94], "SEI", []],
    [0x000066, [0x28, 0x94], "SEN", []],
    [0x000067, [0x3F, 0xEF], "LDI", [R19, 255]],
    [0x000067, [0x3F, 0xEF], "SER", [R19]],
    [0x000068, [0x48, 0x94], "SES", []],
    [0x000069, [0x68, 0x94], "SET", []],
    [0x00006A, [0x38, 0x94], "SEV", []],
    [0x00006B, [0x18, 0x94], "SEZ", []],
    [0x00006C, [0x88, 0x95], "SLEEP", []],
    [0x00006D, [0xE8, 0x95], "SPM", []],
    // SPM.Z+
    // ST.X
    // ST.X+
    // ST.-X
    // ST.Y
    // ST.Y+
    // ST.-Y
    // STD.Y
    // ST.Z
    // ST.Z+
    // ST.-Z
    // STD.Z
    [0x00006E, [0x80, 0x92, 0x00, 0x10], "STS", [4096, R8]],
    // STS.RC
    [0x000070, [0x12, 0x18], "SUB", [R1, R2]],
    [0x000071, [0x1F, 0x52], "SUBI", [R17, 47]],
    [0x000072, [0x72, 0x94], "SWAP", [R7]],
    [0x000073, [0x88, 0x20], "TST", [R8]],
    [0x000074, [0xA8, 0x95], "WDR", []]
    // XCH.Z
];

const testEncode = (
    instruction: Instruction,
    pc: number
): GeneratedCode | undefined => {
    try {
        return encode(instruction, pc);
    } catch (error) {
        throw new Error(
            `error testing ${instruction.mnemonic}`,
            {"cause": error}
        );
    }
};

Deno.test("Code generation is the same as GAVRAsm", () => {
    for (const test of expectedResults) {
        const [pc, expected, mnemonic, operands] = test;
        assertEquals(
            testEncode(instruction(mnemonic, operands), pc),
            expected,
            `Code generation failed for ${mnemonic} ${operands}`
        );
    }
});
