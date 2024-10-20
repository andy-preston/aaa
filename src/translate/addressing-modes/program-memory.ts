import { AssemblerSyntaxError } from "../../errors/errors.ts";
import type { OperandConverter, SymbolicOperands } from "../../operands/mod.ts";
import type { Line } from "../../source-code/mod.ts";
import type { OptionalCode } from "../addressing-modes.ts";
import { template } from "../template.ts";

const mapping: Map<string, string> = new Map([
    ["SPM", "1001_0101 111b_1000"], //     Implied Z OR explicit Z+
    ["ELPM", "1001_0101 1101_1000"], //    Implied [RAMPZ + Z]   -> R0
    ["ELPM.Z", "1001_000d dddd_0110"], //          [RAMPZ + Z]   -> Rd
    ["ELPM.Z+", "1001_000d dddd_0111"], //         [RAMPZ + Z++] -> Rd
    ["LPM", "1001_0101 1100_1000"], //     Implied [Z]           -> R0
    ["LPM.Z", "1001_000d dddd_0100"], //           [Z]           -> Rd
    ["LPM.Z+", "1001_000d dddd_0101"] //           [Z++]         -> Rd
]);

const validIndexOperand = (isStore: boolean, operands: SymbolicOperands) => {
    const allowedOperands = isStore ? ["Z+"] : ["Z", "Z+"];
    const hasExtraOperand = operands.length == (isStore ? 1 : 2);
    const hasAllowedOperand = allowedOperands.includes(
        operands[isStore ? 0 : 1]!
    );
    const valid =
        operands.length == 0 || (hasExtraOperand && hasAllowedOperand);
    if (!valid) {
        const allowed = allowedOperands.join(" or ");
        throw new AssemblerSyntaxError(
            `Can only have either no operands or ${allowed}`
        );
    }
};

export const encode = (operands: OperandConverter) =>
    (line: Line): OptionalCode => {
        if (!mapping.has(line.mnemonic)) {
            return undefined;
        }
        const isStore = line.mnemonic == "SPM";
        validIndexOperand(isStore, line.operands);
        const register =
            !isStore && line.operands.length == 2
                ? operands.numeric("register", line.operands[0]!)
                : undefined;
        if (isStore) {
            return template(mapping.get(line.mnemonic)!, [
                ["b", line.operands[0] == "Z+" ? 1 : 0]
            ]);
        }
        if (register == undefined) {
            return template(mapping.get(line.mnemonic)!, []);
        }
        // This is still a bit horrible and needs more work
        const index = operands.symbolic(line.operands[1]!);
        return template(mapping.get(`${line.mnemonic}.${index}`)!, [
            ["d", register]
        ]);
    };
