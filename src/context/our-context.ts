import type { Directive } from "../directives/mod.ts";
import type { GeneratedCode } from "../generate/mod.ts";
import { theirContext } from "./their-context.ts";

export const createOurContext = () => {
    const theirs = theirContext();

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
        try {
            const result = new Function(
                `with (this) { ${returnIfExpression(trimmed)}; }`
            ).call(theirs);
            return result == undefined ? "" : `${result}`;
        } catch (error) {
            error.message = `Javascript error: ${error.message}`;
            throw error;
        }
    };

    const addDirective = (name: string, directive: Directive) => {
        theirs[name] = directive;
    };

    const label = (name: string): void => {
        if ("name" in theirs) {
            throw Error(`label ${name} already exists`);
        }
        theirs[name] = theirs.flashOrg as number;
    };

    const flashStep = (code: GeneratedCode): void => {
        // Flash addresses are in 16-bit words, not bytes
        theirs.flashOrg = (theirs.flashOrg as number) + code.length / 2;
    };

    const flashPos = (): number => theirs.flashOrg as number;

    const ourContext = {
        "device": "",
        "unsupportedInstructions": [] as Array<string>,
        // This, at the very least, effects how the LDS/STS instructions
        // are generated.
        "reducedCore": false,
        "execute": execute,
        "addDirective": addDirective,
        "label": label,
        "flashStep": flashStep,
        "flashPos": flashPos,
        "theirs": theirs
    };

    return ourContext;
};

export type OurContext = ReturnType<typeof createOurContext>;
