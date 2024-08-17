import { type GeneratedCode, template } from "../generate/mod.ts";
import type {
    OperandConverter,
    OperandIndex,
    SymbolicOperands
} from "../operands/mod.ts";
import type { Mnemonic } from "../tokens/tokens.ts";

const mapping: Map<string, [string, OperandIndex, OperandIndex]> = new Map([
    ["IN", ["0", 0, 1]],
    ["OUT", ["1", 1, 0]]
]);

export const encode = (
    mnemonic: Mnemonic,
    operands: SymbolicOperands,
    convert: OperandConverter
): GeneratedCode | undefined => {
    if (!mapping.has(mnemonic)) {
        return undefined;
    }
    const [operationBit, register, port] = mapping.get(mnemonic)!;
    convert.checkCount(
        operands,
        register == 0 ? ["register", "port"] : ["port", "register"]
    );
    return template(`1011_${operationBit}AAd dddd_AAAA`, [
        ["d", convert.numeric("register", operands[register]!)],
        ["A", convert.numeric("port", operands[port]!)]
    ]);
};
