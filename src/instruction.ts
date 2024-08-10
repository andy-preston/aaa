import { ContextHandler } from "./context/mod.ts";
import {
    type IndexingOperand,
    type Operands,
    indexingOperands
} from "./operands/mod.ts";

export type Instruction = {
    "mnemonic": string;
    "operands": Operands;
    "indexingOperand": IndexingOperand;
};

export const fromTokens = (
    contextHandler: ContextHandler,
    tokens: Array<string>
): Instruction => {
    let indexing = "";
    const mnemonic = tokens.shift()!.toUpperCase();
    const operands = tokens.filter((value) => {
        const indexMode = indexingOperands.includes(value as IndexingOperand);
        if (indexMode) {
            if (indexing != "") {
                throw new Error(
                    `${value} is invalid - instruction already has ${indexing}`
                );
            }
            indexing = value as IndexingOperand;
        }
        return !indexMode;
    }).map((value) => {
        return contextHandler.evaluate(value);
    }) as Operands;

    return instruction(mnemonic, operands, indexing as IndexingOperand);
};

export const instruction = (
    mnemonic: string,
    operands: Operands,
    indexingOperand?: IndexingOperand
) => ({
    "mnemonic": mnemonic,
    "operands": operands,
    "indexingOperand": indexingOperand == undefined ? "" : indexingOperand
});
