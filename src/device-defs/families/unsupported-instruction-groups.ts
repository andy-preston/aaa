import { Mnemonic } from "../../source-line/tokens.ts";

const unsupportedInstructionGroups = {
    "multiply": ["MUL", "MULS", "MULSU", "FMUL", "FMULS", "FMULSU"],
    "readModifyWrite": ["LAC", "LAS", "LAT", "XCH"],
    "DES": ["DES"],
    "FlashMore128": ["EICALL", "EIJMP"],
    "FlashMore8": ["CALL", "JMP"],
    // We need to understand this better to explain WHY some devices have
    // SPM but not SPM.Z
    "SPM.Z": ["SPM.Z"],
    // ELPM needs more study!
    "ELPM": ["ELPM", "ELPM.Z"]
} as const satisfies Record<string, Array<Mnemonic>>;

export type UnsupportedInstructionGroup =
    keyof typeof unsupportedInstructionGroups;

export const unsupportedInstructionsFromGroups = (
    groups: Array<UnsupportedInstructionGroup>
): Array<string> =>
    groups.map(
        (group: UnsupportedInstructionGroup) =>
            unsupportedInstructionGroups[group]
    ).flat();
