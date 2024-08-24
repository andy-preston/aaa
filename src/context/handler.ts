import type { GeneratedCode } from "../generate/mod.ts";
import { defaults } from "./defaults.ts";

export const newContext = () => {
    const context = defaults();


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
            context[name] = context.flashOrg as number;
        },
        "flashStep": (code: GeneratedCode): void => {
            context.flashOrg = context.flashOrg as number + code.length / 2;
        },
        "flashPos": (): number => context.flashOrg as number,
        "bound": context
    };
};

export type ContextHandler = ReturnType<typeof newContext>;
