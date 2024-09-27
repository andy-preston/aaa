import type { OurContext } from "../context/mod.ts";
import { type GeneratedCode, template } from "../generate/mod.ts";
import type { OperandConverter } from "../operands/mod.ts";
import type { Instruction } from "../source-code/mod.ts";

const mapping: Map<string, string> = new Map([
    ["SBI", "10"],
    ["SBIC", "01"],
    ["SBIS", "11"],
    ["CBI", "00"]
]);

export const encode = (
    instruction: Instruction,
    convert: OperandConverter,
    _ourContext: OurContext
): GeneratedCode | undefined => {
    const [ mnemonic, operands ] = instruction;
    if (!mapping.has(mnemonic)) {
        return undefined;
    }
    convert.checkCount(operands, ["port", "bitIndex"]);
    const operationBits = mapping.get(mnemonic)!;
    return template(`1001_10${operationBits} AAAA_Abbb`, [
        ["A", convert.numeric("port", operands[0]!)],
        ["b", convert.numeric("bitIndex", operands[1]!)]
    ]);
};
