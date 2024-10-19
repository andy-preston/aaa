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

export const newContext = (pass: Pass) => {
    const context: Record<string, ContextFields> = {
        "low": (n: number) => n & 0xff,
        "high": (n: number) => (n >> 8) & 0xff
    };

    const value = (jsSource: string): string => {
        const trimmed = jsSource.trim().replace(/;*$/, "").trim();
        if (trimmed == "") {
            return "";
        }
        const functionBody = `with (this) { ${returnIfExpression(trimmed)}; }`;
        try {
            const result = new Function(functionBody).call(context);
            return result == undefined ? "" : `${result}`;
        } catch (error) {
            if (error instanceof ReferenceError) {
                error.message = `Javascript error: ${error.message}`;
            }
            throw error;
        }
    };

    const operand = (operand: SymbolicOperand): string => {
        try {
            return value(operand).trim();
        }
        catch (error) {
            if (pass.ignoreErrors() && error instanceof ReferenceError) {
                return "0";
            }
            throw error;
        }
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
            throw new ReferenceError(
                `label ${name} already exists (${context[name]!.toString(16)})`
            );
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