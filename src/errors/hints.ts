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
