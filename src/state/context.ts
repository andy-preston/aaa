import { RedefinedError } from "../errors/errors.ts";
import { type Errors, errorResult, javaScriptError } from "../errors/result.ts";
import type { SymbolicOperand } from "../operands/mod.ts";
import { returnIfExpression } from "./context-magic.ts";
import type { Pass } from "./pass.ts";

type SimpleFunction = (n: number) => number;
type StringDirective = (s: string) => void;
type NumberDirective = (n: number) => void;
type ArrayDirective = (a: Array<number> | string) => void;
type Directive = StringDirective | NumberDirective | ArrayDirective;
type NumericGetter = () => number;
type ContextFields = SimpleFunction | Directive | number;

const contextValue = (value: string) => ({
    "which": "value" as const,
    "value": value
});

export type ContextValue = ReturnType<typeof contextValue>;

export const newContext = (pass: Pass) => {
    const context: Record<string, ContextFields> = {
        "low": (n: number) => n & 0xff,
        "high": (n: number) => (n >> 8) & 0xff
    };

    const value = (jsSource: string): ContextValue | Errors => {
        const trimmed = jsSource.trim().replace(/;*$/, "").trim();
        if (trimmed == "") {
            return contextValue("");
        }
        const functionBody = `with (this) { ${returnIfExpression(trimmed)}; }`;
        try {
            const result = new Function(functionBody).call(context);
            return contextValue(result == undefined ? "" : `${result}`.trim());
        } catch (exception) {
            if (exception instanceof Error) {
                return errorResult(javaScriptError(exception));
            }
            throw exception;
        }
    };

    const operand = (operand: SymbolicOperand): ContextValue | Errors => {
        const fromContext = value(operand);
        return fromContext.which == "errors" && pass.ignoreErrors()
            ? { "which": "value", "value": "0" }
            : fromContext;
    };

    const directive = (name: string, directive: Directive) => {
        Object.defineProperty(context, name, {
            "configurable": false,
            "enumerable": true,
            "value": directive,
            "writable": false
        });
    };

    const coupledProperty = (name: string, getter: NumericGetter) => {
        Object.defineProperty(context, name, {
            "configurable": false,
            "enumerable": true,
            "get": getter
        });
    };

    const property = (name: string, value: number): void => {
        if (!Object.hasOwn(context, name)) {
            Object.defineProperty(context, name, {
                "configurable": false,
                "enumerable": true,
                "value": value,
                "writable": false
            });
        }
        else if (context[name] != value) {
            throw new RedefinedError(name, context[name]!.toString(16));
        }
    };

    return {
        "operand": operand,
        "value": value,
        "property": property,
        "directive": directive,
        "coupledProperty": coupledProperty
    };
};

export type Context = ReturnType<typeof newContext>;
