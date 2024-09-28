import type { Directive } from "../directives/mod.ts";
import { programMemoryAddress } from "./program-memory.ts";

type SimpleFunction = (_: number) => number;

export interface Context {
    "low": (n: number) => number;
    "high": (n: number) => number;
    "programEnd": number;
    [x: string]: number | SimpleFunction | Directive;
}

let context: Context;

export const newContext = () => {
    context = {
        "low": (n) => n & 0xff,
        "high": (n) => (n >> 8) & 0xff,
        // some devices have more flash than 0xffff
        // but our current .HEX output only goes that far :/
        "programEnd": Math.floor(0xffff / 2)
    };
    for (let r = 0; r < 32; r++) {
        addProperty(`R${r}`, r);
    }
    const specialRegisters: Array<[string, number]> = [
        ["X", 26],
        ["XL", 26],
        ["XH", 27],
        ["Y", 28],
        ["YL", 28],
        ["YH", 29],
        ["Z", 30],
        ["ZL", 30],
        ["ZH", 31]
    ];
    for (const [name, value] of specialRegisters) {
        addProperty(name, value);
    }
};

export const addDirective = (name: string, directive: Directive) => {
    context[name] = directive;
};

export const addProperty = (name: string, value: number) => {
    Object.defineProperty(context, name, {
        "configurable": false,
        "enumerable": true,
        "value": value,
        "writable": false
    });
};

type numericGetter = () => number;

export const addCoupledProperty = (name: string, getter: numericGetter) => {
    Object.defineProperty(context, name, {
        "configurable": false,
        "enumerable": true,
        "get": getter
    });
}

export const label = (name: string): void => {
    if (!Object.hasOwn(context, name)) {
        addProperty(name, programMemoryAddress());
    }
    else if (context[name] != programMemoryAddress()) {
        throw new ReferenceError(
            `label ${name} already exists (${context[name]!.toString(16)})`
        );
    }
};

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

export const execute = (jsSource: string): string => {
    const trimmed = jsSource.trim().replace(/;*$/, "").trim();
    if (trimmed == "") {
        return "";
    }
    try {
        const result = new Function(
            `with (this) { ${returnIfExpression(trimmed)}; }`
        ).call(context);
        return result == undefined ? "" : `${result}`;
    } catch (error) {
        if (error.name != "ReferenceError") {
            error.message = `Javascript error: ${error.message}`;
        }
        throw error;
    }
};
