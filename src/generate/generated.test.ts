/*
const expectedResults: Array<Expected> = [
    [[0x0E, 0x94, 0x0C, 0x00], "CALL", [branch]],
    [[0x0C, 0x94, 0x0C, 0x00], "JMP", [branch]],
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
    // Need a better test for relative stuffs
    // [[0xB7, 0xDF], "RCALL", [branch]],
    // Need a better test for relative stuffs
    // [[0xB4, 0xCF], "RJMP", [branch]],
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
    // XCH.Z
];
*/