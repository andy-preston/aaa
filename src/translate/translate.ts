import { deviceName } from "../context/mod.ts";
import { InternalError } from "../errors/errors.ts";
import { operandConverter } from "../operands/converter.ts";
import type { Line, Mnemonic } from "../source-code/mod.ts";
import type { State } from "../state/mod.ts";
import { addressingModeList } from "./addressing-modes.ts";

export type GeneratedCode =
    | []
    | [number, number]
    | [number, number, number, number];

let unsupportedInstructions: Array<Mnemonic> = [];

const unsupportedInstructionGroups: Map<string, Array<Mnemonic>> = new Map([
    ["multiply", ["MUL", "MULS", "MULSU", "FMUL", "FMULS", "FMULSU"]],
    ["readModifyWrite", ["LAC", "LAS", "LAT", "XCH"]],
    ["DES", ["DES"]],
    ["FlashMore128", ["EICALL", "EIJMP"]],
    ["FlashMore8", ["CALL", "JMP"]],
    // We need to understand this better to explain WHY some devices have
    // SPM but not SPM.Z
    ["SPM.Z", ["SPM.Z"]],
    // ELPM needs more study!
    ["ELPM", ["ELPM", "ELPM.Z"]]
]);

export const setUnsupportedInstructions = (groups: Array<string>) => {
    unsupportedInstructions = groups.flatMap((group) => {
        if (!unsupportedInstructionGroups.has(group)) {
            throw new InternalError(
                `Unknown unsupported instruction group: ${group}`
            );
        }
        return unsupportedInstructionGroups.get(group)!;
    });
};

export const translator = (state: State) => {
    const addressingModes = addressingModeList(operandConverter(state));

    return (line: Line): GeneratedCode => {
        if (line.mnemonic == "") {
            return [];
        }
        const device = deviceName("determine which instructions are available");
        if (unsupportedInstructions.includes(line.mnemonic)) {
            throw new Error(`${line.mnemonic} is not available on ${device}`);
        }
        let code: GeneratedCode | undefined;
        addressingModes.find(addressingMode => {
            code = addressingMode(line);
            return code != undefined
        });
        if (code == undefined) {
            throw new SyntaxError(`unknown instruction ${line.mnemonic}`);
        }
        return code;
    };
};
