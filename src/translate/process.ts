import { label } from "../context/mod.ts";
import { macroLines, type Line } from "../source-code/mod.ts";
import {
    programMemoryAddress, programMemoryStep, ignoreErrors, peek
} from "../state/mod.ts";
import { type GeneratedCode, translate } from "./translate.ts";

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

const translationWithError = (line: Line): GeneratedCode => {
    try {
        return translate(line);
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

export const process = function* (line: Line): ProcessGenerator {
    errorMessages = [];
    // Remember that labels must be processed before pokes!
    labelWithError(line.label);
    for (const block of peek()) {
        yield codeBlock(block, []);
    }
    yield codeBlock(
        translationWithError(line),
        errorMessages
    );
    for (const macroLine of macroLines()) {
        errorMessages = [];
        labelWithError(macroLine.label);
        yield codeBlock(
            translationWithError(macroLine),
            errorMessages
        );
    }
};
