import { macroLines, type Line } from "../source-code/mod.ts";
import { type ProgramMemory, type State } from "../state/mod.ts";
import { type GeneratedCode, translator } from "./translate.ts";

type ErrorMessages = Array<string>;

const codeBlock = (
    block: GeneratedCode,
    errorMessages: ErrorMessages,
    programMemory: ProgramMemory
) => {
    const result = {
        "address": programMemory.address(),
        "code": block,
        "errors": errorMessages
    };
    programMemory.step(block);
    return result;
}

export type CodeBlock = ReturnType<typeof codeBlock>;

type CodeGenerator = Generator<CodeBlock, void, undefined>;

export const codeBlockGenerator = (state: State) => {
    let errorMessages: ErrorMessages;
    const translate = translator(state);

    const labelWithError = (labelName: string) => {
        if (labelName == "") {
            return;
        }
        try {
            state.context.property(labelName, state.programMemory.address());
        }
        catch (error) {
            if (state.pass.showErrors() && error instanceof Error) {
                errorMessages.push(`${error.name}: ${error.message}`)
            }
        }
    };

    const translationWithError = (line: Line): GeneratedCode => {
        try {
            return translate(line);
        } catch (error) {
            if (state.pass.showErrors() && error instanceof Error) {
                errorMessages.push(`${error.name}: ${error.message}`);
            }
            return [];
        }
    };

    return function* (line: Line): CodeGenerator {
        errorMessages = [];
        // Labels are processed before pokes because the label may refer to the poke
        labelWithError(line.label);
        yield* state.poke.peek().map(code => codeBlock(
            code,
            [],
            state.programMemory
        ));
        yield codeBlock(
            translationWithError(line),
            errorMessages,
            state.programMemory
        );
        yield* macroLines().map(macroLine => {
            errorMessages = [];
            labelWithError(macroLine.label);
            return codeBlock(
                translationWithError(macroLine),
                errorMessages,
                state.programMemory
            );
        });
    };
};