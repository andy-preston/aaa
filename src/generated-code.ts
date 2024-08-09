export type GeneratedCode = [number, number] | [number, number, number, number];

type TemplateOperandKey = "A" | "b" | "d" | "k" | "K" |
    // In some of the places we've used "d", the official documentation
    // uses "r" but, for code simplicity, we're using "d" across the board
    // EXCEPT where there's a two-register operation, then one is "d" and the
    // other is "r".
    "r" | "s" | "q";

type Binary = ["0" | "1"];

const operandBits = (operand: number): Binary =>
    operand.toString(2).split("").reverse().concat(new Array(32).fill("0")) as Binary;

export const template = (
    templateString: string, // format: "0101_011d dddd_0qqq"
    operands: Map<TemplateOperandKey, number>
): GeneratedCode => {
    const templateDigits = templateString.split("").reverse();

    const substitute = (key: TemplateOperandKey, binary: Binary) => {
        templateDigits.forEach((digit, index) => {
            if (digit == key) {
                templateDigits[index] = binary.shift()!;
            }
        });
        for (const remaining of binary) {
            if (remaining != "0") {
                // This error message could be better and more useful. But it
                // may also have been made redundant by higher-level range
                // checking.
                throw new Error(
                    `Operand out of range: ${key} in ${templateString}`
                );
            }
        }
    };

    operands.forEach((operand, key) => {
        substitute(key, operandBits(operand));
    });
    return templateDigits.reverse().join("").split(" ").map(
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
