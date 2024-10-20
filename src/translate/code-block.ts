import { ErrorWithHint } from "../errors/errors.ts";
import { macroLines, type Line } from "../source-code/mod.ts";
import type { State } from "../state/mod.ts";
import { type GeneratedCode, translator } from "./translate.ts";

type Errors = Array<ErrorWithHint>;

export type CodeBlock = {
    address: number,
    code: GeneratedCode,
    errors: Errors
};

type CodeGenerator = Generator<CodeBlock, void, undefined>;

export const codeBlockGenerator = (state: State) => {
    let errors: Errors;
    const translate = translator(state);

    // deno-lint-ignore no-explicit-any
    const saveError = (error: any) => {
        if (!(error instanceof ErrorWithHint)) {
            console.error(`UNHINTED ${error.name} - ${error.message}`);
            throw error;
        }
        if (state.pass.showErrors()) {
            errors.push(error);
        }
    }

    const labelWithError = (line: Line) => {
        if (!line.label) {
            return;
        }
        try {
            state.context.property(line.label, state.programMemory.address());
        }
        catch (error) {
            saveError(error);
        }
    };

    const codeBlock = (code: GeneratedCode): CodeBlock => {
        const block = {
            "address": state.programMemory.address(),
            "code": code,
            "errors": errors
        };
        state.programMemory.step(code);
        errors = [];
        return block;
    }

    const translationWithError = (line: Line): CodeBlock | undefined => {
        try {
            const translation = translate(line);
            if (translation.length > 0) {
                return codeBlock(translation);
            }
        } catch (error) {
            saveError(error);
        }
        return undefined;
    };

    return function* (line: Line): CodeGenerator {
        errors = [];
        // Labels are processed before pokes because the label may refer to the poke
        labelWithError(line);
        yield* state.poke.peek().map(code => codeBlock(code));
        const block = translationWithError(line);
        if (block) {
            yield block;
        }
        for (const macroLine of macroLines()) {
            labelWithError(macroLine);
            const block = translationWithError(macroLine);
            if (block) {
                yield block;
            }
        }
    };
};
