import type { DirectiveHandler } from "../directives/mod.ts";
import type { GeneratedCode } from "../generate/mod.ts";
import { createTheirContext } from "./their-context.ts";

export const createOurContext = () => {
    const theirContext = createTheirContext();

    const returnIfExpression = (trimmedJs: string): string => {
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
            `with (this) { ${returnIfExpression(trimmed)}; }`
        ).call(theirContext);
        return result == undefined ? "" : `${result}`;
    };

    const addDirective = (name: string, directive: DirectiveHandler) => {
        theirContext[name] = directive;
    };

    const label = (name: string): void => {
        if ("name" in theirContext) {
            throw Error(`label ${name} already exists`);
        }
        theirContext[name] = theirContext.flashOrg as number;
    };

    const flashStep = (code: GeneratedCode): void => {
        // Flash addresses are in 16-bit words, not bytes
        theirContext.flashOrg =
            (theirContext.flashOrg as number) + code.length / 2;
    };

    const flashPos = (): number => theirContext.flashOrg as number;

    const ourContext = {
        "execute": execute,
        "addDirective": addDirective,
        "label": label,
        "flashStep": flashStep,
        "flashPos": flashPos,
        "theirs": theirContext
    };

    return ourContext;
};

export type OurContext = ReturnType<typeof createOurContext>;
