export type GeneratedCode = [number, number] | [number, number, number, number];

type TemplateOperandKey = "A" | "b" | "d" | "k" | "K" |
    // In some of the places we've used "d", the official documentation
    // uses "r" but, for code simplicity, we're using "d" across the board
    // EXCEPT where there's a two-register operation, then one is "d" and the
    // other is "r".
    "r" | "s" | "q";

type BinaryDigit = "0" | "1";
type Binary = Array<BinaryDigit>;

const bitSource = (operand: number) => {
    const bits = operand.toString(2).split("").reverse() as Binary;
    return (): BinaryDigit => bits.length > 0 ? bits.shift()! : "0";
};

const substitutionMap = (operands: Array<[TemplateOperandKey, number]>) => {
    const theMap = new Map(operands.map(
        (operand) => [operand[0] as string, bitSource(operand[1])]
    ));
    return (templateDigit: string) =>
        theMap.has(templateDigit)
            ? theMap.get(templateDigit)!()
            : templateDigit;
};

export const template = (
    templateString: string, // format: "0101_011d dddd_0qqq"
    operands: Array<[TemplateOperandKey, number]>
): GeneratedCode => {
    const substitutions = substitutionMap(operands);
    const digits = templateString.split("").reverse().map(
        (digit) => substitutions(digit)
    );
    const bytes = digits.reverse().join("").split(" ");
    return bytes.map(
        // eval because parseInt doesn't like the underscore
        (byte: string) => eval(`0b${byte}`)
    ) as GeneratedCode;
};

export const littleEndian = (code: GeneratedCode): GeneratedCode => {
    const little: Array<number> = [];
    const values = code.values();
    for (;;) {
        const even = values.next();
        if (even.done) {
            return little as GeneratedCode;
        }
        little.push(values.next().value);
        little.push(even.value);
    }
};
