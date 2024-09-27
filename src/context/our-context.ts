import type { GeneratedCode } from "../generate/mod.ts";
import { type TheirContext, addProperty } from "./their-context.ts";

export const createOurContext = (theirs: TheirContext) => {
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
            if (error.name != "ReferenceError") {
                error.message = `Javascript error: ${error.message}`;
            }
            throw error;
        }
    };

    const chooseDevice = (deviceSpec: object) => {
        for (const [key, value] of Object.entries(deviceSpec)) {
            switch (key) {
                case "unsupportedInstructions":
                    ourContext[key] = value as Array<string>;
                    break;
                case "programEnd":
                    ourContext.theirs[key] = Math.floor(value as number / 2);
                    break;
                default:
                    addProperty(theirs, key, value as number);
                    break;
            }
        }
    }

    const label = (name: string): void => {
        if (!Object.hasOwn(theirs, name)) {
            addProperty(theirs, name, ourContext.programMemoryPos);
        }
        else if (theirs[name] != ourContext.programMemoryPos) {
            throw new ReferenceError(
                `label ${name} already exists (${theirs[name]!.toString(16)})`
            );
        }
    };

    const programMemoryStep = (code: GeneratedCode): void => {
        // Flash addresses are in 16-bit words, not bytes
        ourContext.programMemoryPos += code.length / 2;
    };

    const ourContext = {
        "device": "",
        "unsupportedInstructions": [] as Array<string>,
        "chooseDevice": chooseDevice,
        // This, at the very least, effects how the LDS/STS instructions
        // are generated.
        "reducedCore": false,
        "execute": execute,
        "label": label,
        "programMemoryPos": 0,
        "programMemoryStep": programMemoryStep,
        "theirs": theirs
    };

    return ourContext;
};

export type OurContext = ReturnType<typeof createOurContext>;
