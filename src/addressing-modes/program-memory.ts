import { ProgramCounter } from "../context/mod.ts";
import { type GeneratedCode, template } from "../generate/mod.ts";
import { check, NumericOperands, SymbolicOperands } from "../operands/mod.ts";
import { Mnemonic } from "../tokens/tokens.ts";

const mapping: Map<string, string> = new Map([
    ["SPM",     "1001_0101 111b_1000"], // Implied Z OR explicit Z+
    ["ELPM",    "1001_0101 1101_1000"], // Implied [RAMPZ + Z]   -> R0
    ["ELPM.Z",  "1001_000d dddd_0110"], //         [RAMPZ + Z]   -> Rd
    ["ELPM.Z+", "1001_000d dddd_0111"], //         [RAMPZ + Z++] -> Rd
    ["LPM",     "1001_0101 1100_1000"], // Implied [Z]           -> R0
    ["LPM.Z",   "1001_000d dddd_0100"], //         [Z]           -> Rd
    ["LPM.Z+",  "1001_000d dddd_0101"]  //         [Z++]         -> Rd
]);

export const encode = (
    mnemonic: Mnemonic,
    numericOperands: NumericOperands,
    symbolicOperands: SymbolicOperands,
    _programCounter: ProgramCounter
): GeneratedCode | undefined => {
    if (!mapping.has(mnemonic)) {
        return undefined;
    }
    const isStore = mnemonic == "SPM";
    const validOperands = isStore ? ["Z+"] : ["Z", "Z+"];
    const valid = symbolicOperands.length == 0 || (
        symbolicOperands.length == (isStore ? 1 : 2)
            && validOperands.includes(symbolicOperands[isStore ? 0 : 1]!)
    );
    if (!valid) {
        const valid = validOperands.join(" or ");
        throw new SyntaxError(
            `${mnemonic} can only have either no operands or ${valid}`
        );
    }
    if (!isStore && numericOperands.length == 2) {
        check("register", 1, numericOperands[0]!);
    }
    if (isStore) {
        return template(mapping.get(mnemonic)!, [
            ["b", symbolicOperands[0] == "Z+" ? 1 : 0]
        ]);
    }
    if (numericOperands.length == 2) {
        // This is still a bit horrible and needs more work
        return template(mapping.get(`${mnemonic}.${symbolicOperands[1]}`)!, [
            ["d", numericOperands[0]!]
        ]);
    }
    return template(mapping.get(mnemonic)!, []);
};
