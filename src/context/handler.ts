import type { GeneratedCode } from "../generate/mod.ts";
import { defaults } from "./defaults.ts";

export const newContext = () => {
    const context = defaults();

    const execute = (jsSource: string): string => {
        const trimmed = jsSource.trim().replace(/;*$/g, "").trim() + ";"
        if (trimmed == ";") {
            return "";
        }
        const lines = (trimmed.match(/\n/g) || "").length + 1;
        const semicolons = (trimmed.match(/;/g) || "").length;
        const prefix = lines == 1 && semicolons == 1 ? "return " : "";
        const result = new Function(
            `with (this) { ${prefix}${trimmed }}`
        ).call(context);
        return result == undefined ? "" : `${result}`;
    };

    return {
        "execute": execute,
        "label": (name: string): void => {
            if ("name" in context) {
                throw Error(`label ${name} already exists`);
            }
            context[name] = context.flashOrg as number;
        },
        "flashStep": (code: GeneratedCode): void => {
            // Flash addresses are in 16-bit words, not bytes
            context.flashOrg = context.flashOrg as number + code.length / 2;
        },
        "flashPos": (): number => context.flashOrg as number,
        "bound": context
    };
};

export type ContextHandler = ReturnType<typeof newContext>;
