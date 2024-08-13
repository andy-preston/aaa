import type { GeneratedCode } from "../generate/mod.ts";
import { defaults } from "./defaults.ts";

export interface ContextHandler {
    "evaluate": (jsExpression: string) => number;
    "label": (name: string) => void;
    "origin": (newValue: number) => void;
    "step": (generatedCode: GeneratedCode) => void;
    "org": (newProgramCounter: number) => void;
    "programCounter": () => number;
}

export const newContext = (initialProgramCounter: number): ContextHandler => {
    const context = defaults(initialProgramCounter);
    return {
        "evaluate": (jsExpression: string): number => {
            return new Function(
                `with (this) { return eval('"use strict"; ${jsExpression}'); }`
            ).call(context);
        },
        "label": (name: string) => {
            if ("name" in context) {
                throw Error(`label ${name} already exists`);
            }
            context[name] = context.PC as number;
        },
        "origin": (newValue: number) => {
            context.PC = newValue;
        },
        "step": (generatedCode: GeneratedCode) => {
            context.PC = (context.PC as number) + (generatedCode.length / 2);
        },
        "org": (newProgramCounter: number) => {
            context.PC = newProgramCounter;
        },
        "programCounter": (): number => context.PC as number
    };
};
