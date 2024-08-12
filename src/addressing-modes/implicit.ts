import { type GeneratedCode, template } from "../generate/mod.ts";
import { ProgramCounter } from "../context/mod.ts";
import { checkCount, NumericOperands, SymbolicOperands } from "../operands/mod.ts";
import { Mnemonic } from "../tokens/tokens.ts";

const mapping: Map<string, string> = new Map([
    ["BREAK", "1001_0101 1001_1000"],
    ["NOP", "0000_0000 0000_0000"],
    ["RET", "1001_0101 0000_1000"],
    ["RETI", "1001_0101 0001_1000"],
    ["SLEEP", "1001_0101 1000_1000"],
    ["WDR", "1001_0101 1010_1000"],
    // Indirect Program Addressing
    ["IJMP", "1001_0100 0000_1001"],
    ["EIJMP", "1001_0100 0001_1001"],
    ["ICALL", "1001_0101 0000_1001"],
    ["EICALL", "1001_0101 0001_1001"]
]);

export const encode = (
    mnemonic: Mnemonic,
    _numericOperands: NumericOperands,
    symbolicOperands: SymbolicOperands,
    _programCounter: ProgramCounter
): GeneratedCode | undefined => {
    if (!mapping.has(mnemonic)) {
        return undefined;
    }
    checkCount(symbolicOperands, []);
    return template(mapping.get(mnemonic)!, []);
};
