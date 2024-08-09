const instructionSets = [
    "AVR",
    "AVRe",
    "AVRe+",
    "AVRrc",
    "AVRxm",
    "AVRxt"
] as const;

type InstructionSet = (typeof instructionSets)[number];

const short = (instructionSet: InstructionSet): string =>
    instructionSet.slice(-1).toLowerCase();

const missing: Map<string, string> = new Map([
    ["ADIW", "c"],
    ["BREAK", "r"],
    ["DES", "rc"],
    ["EICALL", "rec"],
    ["EIJMP", "rec"],
    ["ELPM", "rec"],
    ["ELPM.Z", "rec"],
    ["ELPM.Z+", "rec"],
    ["FMUL", "rec"],
    ["FMULS", "rec"],
    ["FMULSU", "rec"],
    ["JMP", "rc"],
    ["LAC", "e+tc"],
    ["LAS", "e+tc"],
    ["LAT", "e+tc"],
    ["LDD.Y", "c"],
    ["LDD.Z", "c"],
    ["LPM", "c"],
    ["LPM.Z", "rc"],
    ["LPM.Z+", "rc"],
    ["MOVW", "rc"],
    ["MUL", "rec"],
    ["MULS", "rec"],
    ["MULSU", "rec"],
    ["SBIW", "c"],
    ["SPM", "rc"],
    // TODO: there was a duplicate key here.
    // we need to work out what to do about it!
    ["SPM.Z+", "re+c"]
    // "x" isn't a valid option????
    //"SPM.Z+": "re+xc"
]);

export const isMissing = (
    opCode: string,
    instructionSet: InstructionSet
): boolean =>
    missing.has(opCode) && missing.get(opCode)!.includes(short(instructionSet));
