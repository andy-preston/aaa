import { programMemoryAddress } from "../generate/mod.ts";

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
        property(`R${r}`, r);
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
        property(name, value);
    }
};

type StringDirective = (s: string) => void;
type NumberDirective = (n: number) => void;
type ArrayDirective = (a: Array<number> | string) => void;
type Directive = StringDirective | NumberDirective | ArrayDirective;

export const directive = (name: string, directive: Directive) => {
    Object.defineProperty(context, name, {
        "configurable": false,
        "enumerable": true,
        "value": directive,
        "writable": false
    });
};

export const property = (name: string, value: number) => {
    Object.defineProperty(context, name, {
        "configurable": false,
        "enumerable": true,
        "value": value,
        "writable": false
    });
};

type numericGetter = () => number;

export const coupledProperty = (name: string, getter: numericGetter) => {
    Object.defineProperty(context, name, {
        "configurable": false,
        "enumerable": true,
        "get": getter
    });
}

export const label = (name: string): void => {
    if (!Object.hasOwn(context, name)) {
        property(name, programMemoryAddress());
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
    const functionBody = `with (this) { ${returnIfExpression(trimmed)}; }`;
    try {
        const result = new Function(functionBody).call(context);
        return result == undefined ? "" : `${result}`;
    } catch (error) {
        if (error.name != "ReferenceError") {
            error.message = `Javascript error: ${error.message}`;
        }
        throw error;
    }
};
