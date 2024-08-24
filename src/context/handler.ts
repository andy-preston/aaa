import type { GeneratedCode } from "../generate/mod.ts";
import { defaults } from "./defaults.ts";

export type ProgramCounter = number;

export const newContext = (initialProgramCounter: ProgramCounter) => {
    const context = defaults(initialProgramCounter);

    const boundEval = eval.bind(context);

    return {
        "evaluate": (jsExpression: string): number => {
            const result = new Function(
                `with (this) { return eval('"use strict"; ${jsExpression}'); }`
            ).call(context);
            const numeric = parseInt(result);
            if (`${numeric}` != `${result}`) {
                throw new TypeError(
                    `{${jsExpression}} does not have an integer result: "${result}"`
                );
            }
            return numeric;
        },
        "execute": (jsSource: string): string => {
            const result = boundEval(jsSource);
            return result == undefined ? "" : `${result}`;
        },
        "label": (name: string): void => {
            if ("name" in context) {
                throw Error(`label ${name} already exists`);
            }
            context[name] = context.PC as number;
        },
        "step": (generatedCode: GeneratedCode): void => {
            context.PC = (context.PC as number) + generatedCode.length / 2;
        },
        "origin": (newProgramCounter: ProgramCounter): void => {
            context.PC = newProgramCounter;
        },
        "org": (newProgramCounter: ProgramCounter): void => {
            context.PC = newProgramCounter;
        },
        "programCounter": (): ProgramCounter => context.PC as number
    };
};

export type ContextHandler = ReturnType<typeof newContext>;
