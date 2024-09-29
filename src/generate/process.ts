import { deviceCheck, label } from "../context/mod.ts";
import { peek } from "./poke-buffer.ts";
import { programMemoryAddress, programMemoryStep } from "./program-memory.ts";
import { type Instruction, lineTokens, Mnemonic } from "../source-code/mod.ts";
import { type GeneratedCode, translate } from "./translate.ts";

type Address = number;
type ErrorMessages = Array<string>;
type Processed = [Address, GeneratedCode, ErrorMessages];
type ProcessGenerator = Generator<Processed, void, undefined>;

let errorMessages: Array<string>;

const translationWithError = (instruction: Instruction): GeneratedCode => {
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

const deviceWithError = (mnemonic: Mnemonic) => {
    const errorMessage = deviceCheck(mnemonic);
    if (errorMessage) {
        errorMessages.push(errorMessage);
    }
};

const nextInstruction = (line: string): Instruction => {
    const [label, mnemonic, operands] = lineTokens(line);
    labelWithError(label);
    return [mnemonic, operands];
}

export const process = function* (line: string): ProcessGenerator {
    errorMessages = [];
    // This has to come before ANY yields to make sure labels are handled
    // correctly for poke directives
    const instruction = nextInstruction(line);
    for (const block of peek()) {
        yield [programMemoryAddress(), block, []];
        programMemoryStep(block);
    }
    deviceWithError(instruction[0]);
    const code = translationWithError(instruction);
    yield [programMemoryAddress(), code, errorMessages]
    programMemoryStep(code);
};
