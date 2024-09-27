import { deviceChecker } from "../context/mod.ts";
import type { OurContext } from "../context/mod.ts";
import type { BufferPeek } from "./poke-buffer.ts";
import { translator } from "./translator.ts";
import type { GeneratedCode } from "./types.ts";
import { type Instruction, lineTokens, Mnemonic } from "../source-code/mod.ts";
import type { OperandConverter } from "../operands/mod.ts";

type Address = number;
type ErrorMessages = Array<string>;
type Processed = [Address, GeneratedCode, ErrorMessages];

export const processor = (
    ourContext: OurContext,
    operandConverter: OperandConverter,
    peek: BufferPeek
) => {
    const deviceCheck = deviceChecker(ourContext);
    const translation = translator(ourContext, operandConverter);
    let errorMessages: Array<string>;

    const translationWithError = (instruction: Instruction): GeneratedCode => {
        try {
            return translation(instruction);
        } catch (error) {
            errorMessages.push(`${error.name}: ${error.message}`);
            return [];
        }
    };

    const labelWithError = (label: string) => {
        if (label != "") {
            try {
                ourContext.label(label);
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

    return function* (line: string): Generator<Processed, void, undefined> {
        errorMessages = [];
        // This has to come before ANY yields to make sure labels are handled
        // correctly for poke directives
        const instruction = nextInstruction(line);
        for (const block of peek()) {
            yield [ourContext.programMemoryPos, block, []];
            ourContext.programMemoryStep(block);
        }
        deviceWithError(instruction[0]);
        const code = translationWithError(instruction);
        yield [ourContext.programMemoryPos, code, errorMessages]
        ourContext.programMemoryStep(code);
    };
};

export type ProcessGenerator = ReturnType<typeof processor>;
