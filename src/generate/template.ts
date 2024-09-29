import type { GeneratedCode } from "./generated-code.ts";

type TemplateOperandKey =
    | "A"
    | "b"
    | "d"
    | "k"
    | "K"
    // In some of the places we've used "d", the official documentation
    // uses "r" but, for code simplicity, we're using "d" across the board
    // EXCEPT where there's a two-register operation, then one is "d" and the
    // other is "r".
    | "r"
    | "s"
    | "q";

type BinaryDigit = "0" | "1";
type Binary = Array<BinaryDigit>;

const bitsWithLeadingZeros = (operand: number) => {
    const bits = operand.toString(2).split("").reverse() as Binary;
    return (): BinaryDigit => (bits.length > 0 ? bits.shift()! : "0");
};

const substitutionMap = (operands: Array<[TemplateOperandKey, number]>) => {
    const bitSources = new Map(
        operands.map((operand) => [
            operand[0] as string,
            bitsWithLeadingZeros(operand[1])
        ])
    );
    return (templateDigit: string) =>
        bitSources.has(templateDigit)
            ? bitSources.get(templateDigit)!()
            : templateDigit;
};

export const template = (
    templateString: string, // format: "0101_011d dddd_0qqq"
    operands: Array<[TemplateOperandKey, number]>
): GeneratedCode => {
    const substitutions = substitutionMap(operands);
    const instructionBytes = templateString
        .replaceAll("_", "")
        .split("")
        .reverse()
        .map((digit) => substitutions(digit))
        .reverse()
        .join("")
        .split(" ")
        .map((byte) => Number.parseInt(byte, 2));
    return instructionBytes as GeneratedCode;
};
