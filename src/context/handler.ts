import { defaults } from "./defaults.ts";

export interface ContextHandler {
    "evaluate": (jsExpression: string) => number;
}

export const newContext = (): ContextHandler => {
    const context = defaults();
    return {
        "evaluate": (jsExpression: string): number => {
            return new Function(
                `with (this) { return eval('"use strict"; ${jsExpression}'); }`
            ).call(context);
        }
    };
};
