import type { SymbolicOperands } from "../operands/mod.ts";

export type Mnemonic = string;

type Label = string;

type Tokens = [Label, Mnemonic, SymbolicOperands];

const stripComment = (raw: string): string => {
    const semicolon = raw.indexOf(";");
    return semicolon == -1 ? raw : raw.substring(0, semicolon);
};

const split = (
    keep: "before" | "after",
    marker: string,
    raw: string
): [string, string] => {
    const position = raw.indexOf(marker);
    if (position == -1) {
        return keep == "before" ? [raw, ""] : ["", raw];
    }
    return [raw.substring(0, position), raw.substring(position + 1).trim()];
};

const forbidWhitespace = (suspect: string) => {
    if (suspect.indexOf(" ") != -1) {
        throw new SyntaxError("Label must not contain whitespace");
    }
};

const clean = (theLine: string): string =>
    stripComment(theLine).replace(/\s+/g, " ").trim();

const expandIndexOffsetOperands = (operands: Array<string>) => {
    const found = (position: number): boolean =>
        operands.length > position &&
            operands[position]!.startsWith("Z+") &&
            operands[position]!.length > 2;

    const expand = (position: 0 | 1) => {
        operands[position] = operands[position]!.substring(2);
        operands.splice(position, 0, "Z+");
    };

    let second = 1;
    if (operands.length > 0 && found(0)) {
        expand(0);
        second = 2;
    }
    if (operands.length > second && found(second)) {
        if (second == 2) {
            throw SyntaxError(
                "An instruction can only have 1 index offset (Z+qq) operand"
            );
        }
        expand(1);
    }
};

export const lineTokens = (theLine: string): Tokens => {
    const cleaned = clean(theLine);
    const [label, withoutLabel] = split("after", ":", cleaned);
    forbidWhitespace(label);
    const [mnemonic, operandsText] = split("before", " ", withoutLabel);
    const operandsList = split("before", ",", operandsText).filter(
        (operand: string) => operand != ""
    );
    expandIndexOffsetOperands(operandsList);
    return [label, mnemonic.toUpperCase(), operandsList as SymbolicOperands];
};

