import type { Mnemonic } from "../source-code/mod.ts";

const instructionAlternatives = new Map([
    ["JMP", "RJMP"],
    ["CALL", "RCALL"],
    ["EICALL", "CALL or RCALL"],
    ["EIJMP", "JMP or RJMP"],
]);

export const unsupportedInstructionAlternative = (
    mnemonic: Mnemonic
): string => instructionAlternatives.has(mnemonic)
    ? `maybe you could try using ${instructionAlternatives.get(mnemonic)}`
    : "";

const ioAlternatives = new Map([
    ["SBI", "SBR and STS"],
    ["SBIC", "LDS and SBRC"],
    ["SBIS", "LDS and SBRS"],
    ["CBI", "CBR and STS"],
    ["IN", "LDS"],
    ["OUT", "STS"]
]);

export const ioOverflowAlternative = (
    mnemonic: Mnemonic
): string => ioAlternatives.has(mnemonic)
    // TODO: use correct terminology!
    ? `maybe you could try using ${ioAlternatives.get(mnemonic)} instead of ${mnemonic} to access data space beyond the usual IO area`
    : "";
