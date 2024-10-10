import { label } from "../context/mod.ts";
import { type GeneratedCode, translate } from "../generate/translate.ts";
import { type Instruction, lineTokens, macroLines } from "../source-code/mod.ts";
import { ignoreErrors } from "./pass.ts";
import { peek } from "./poke-peek.ts";
import { programMemoryAddress, programMemoryStep } from "./program-memory.ts";

type Address = number;
type ErrorMessages = Array<string>;
type Processed = [Address, GeneratedCode, ErrorMessages];
type ProcessGenerator = Generator<Processed, void, undefined>;

let errorMessages: Array<string>;

const labelWithError = (labelName: string) => {
    if (labelName == "") {
        return;
    }
    try {
        label(labelName);
    }
    catch (error) {
        if (!ignoreErrors() && error instanceof Error) {
            errorMessages.push(`${error.name}: ${error.message}`)
        }
    }
};

const translationWithError = (instruction: Instruction): GeneratedCode => {
    try {
        return translate(instruction);
    } catch (error) {
        if (!ignoreErrors() && error instanceof Error) {
            errorMessages.push(`${error.name}: ${error.message}`);
        }
        return [];
    }
};

const codeBlock = (
    block: GeneratedCode,
    errorMessages: ErrorMessages
): Processed => {
    const result: Processed = [programMemoryAddress(), block, errorMessages];
    programMemoryStep(block);
    return result;
}

export const process = function* (line: string): ProcessGenerator {
    errorMessages = [];
    // Remember that labels must be processed before pokes!
    const [label, mnemonic, operands] = lineTokens(line);
    labelWithError(label);
    for (const block of peek()) {
        yield codeBlock(block, []);
    }
    yield codeBlock(
        translationWithError([mnemonic, operands]),
        errorMessages
    );
    for (const [label, mnemonic, operands] of macroLines()) {
        errorMessages = [];
        labelWithError(label);
        yield codeBlock(
            translationWithError([mnemonic, operands]),
            errorMessages
        );
    }
};
