import type { GeneratedCode } from "../generate/mod.ts";
import { defaults } from "./defaults.ts";

export type ProgramCounter = number;

export const newContext = (initialProgramCounter: ProgramCounter) => {
    const context = defaults(initialProgramCounter);
    return {
        "evaluate": (jsExpression: string): number => {
            return new Function(
                `with (this) { return eval('"use strict"; ${jsExpression}'); }`
            ).call(context);
        },
        "label": (name: string): void => {
            if ("name" in context) {
                throw Error(`label ${name} already exists`);
            }
            context[name] = context.PC as number;
        },
        "origin": (newProgramCounter: ProgramCounter): void => {
            context.PC = newProgramCounter;
        },
        "step": (generatedCode: GeneratedCode): void => {
            context.PC = (context.PC as number) + (generatedCode.length / 2);
        },
        "org": (newProgramCounter: ProgramCounter): void => {
            context.PC = newProgramCounter;
        },
        "programCounter": (): ProgramCounter => context.PC as number
    };
};

export type ContextHandler = ReturnType<typeof newContext>;
