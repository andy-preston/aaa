import type { GeneratedCode } from "../generate/mod.ts";
import { defaults } from "./defaults.ts";

export const newContext = () => {
    const context = defaults();

    const autoReturn = (trimmedJs: string): string => {
        // This is both "magic" and "clever", so it could well turn out to
        // be a massive annoyance and have to be removed.
        const singleLine = trimmedJs.match(/\n/) == null;
        const noSemicolons = trimmedJs.match(/;/) == null;
        const noAssignments = trimmedJs.match(/[^!><=]=[^=]/) == null;
        const noExplicitReturn = trimmedJs.match(/^return/) == null;
        return singleLine && noSemicolons && noAssignments && noExplicitReturn
            ? `return ${trimmedJs}`
            : trimmedJs;
    };

    const execute = (jsSource: string): string => {
        const trimmed = jsSource.trim().replace(/;*$/, "").trim();
        if (trimmed == "") {
            return "";
        }
        const result = new Function(
            `with (this) { ${autoReturn(trimmed)}; }`
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
            context.flashOrg = (context.flashOrg as number) + code.length / 2;
        },
        "flashPos": (): number => context.flashOrg as number,
        "bound": context
    };
};

export type ContextHandler = ReturnType<typeof newContext>;
