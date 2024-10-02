import { deviceCheck, label } from "../context/mod.ts";
import { type GeneratedCode, translate } from "../generate/translate.ts";
import { type Instruction, lineTokens, macroLines } from "../source-code/mod.ts";
import { peek } from "./poke-buffer.ts";
import { programMemoryAddress, programMemoryStep } from "./program-memory.ts";

type Address = number;
type ErrorMessages = Array<string>;
type Processed = [Address, GeneratedCode, ErrorMessages];
type ProcessGenerator = Generator<Processed, void, undefined>;

let errorMessages: Array<string>;

const translationWithError = (instruction: Instruction): GeneratedCode => {
    const errorMessage = deviceCheck(instruction[0]);
    if (errorMessage) {
        errorMessages.push(errorMessage);
    }
    try {
        return translate(instruction);
    } catch (error) {
        errorMessages.push(`${error.name}: ${error.message}`);
        return [];
    }
};

const labelWithError = (labelName: string) => {
    if (labelName != "") {
        try {
            label(labelName);
        }
        catch (error) {
            errorMessages.push(`${error.name}: ${error.message}`)
        }
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
