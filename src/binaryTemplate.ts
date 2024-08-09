export type GeneratedCode = [number, number] | [number, number, number, number];

type TemplateOperandKey = "A" | "b" | "d" | "k" | "K" |
    // In some of the places we've used "d", the official documentation
    // uses "r" but, for code simplicity, we're using "d" across the board
    // EXCEPT where there's a two-register operation, then one is "d" and the
    // other is "r".
    "r" | "s" | "q";

export const template = (
    templateString: string,
    operands: Map<TemplateOperandKey, number>
): GeneratedCode => {
    const templateDigits = templateString.split("").reverse();
    operands.forEach((operand: number, key: TemplateOperandKey) => {
        const bin = operand
            .toString(2)
            .split("")
            .reverse()
            .concat(new Array(32).fill(0));
        for (let digit = 0; digit < templateDigits.length; digit++) {
            if (templateDigits[digit] == key) {
                templateDigits[digit] = bin.shift()!;
            }
        }
        if (bin[0]) {
            throw `Operand out of range: ${key} = ${operand} in ${templateString}`;
        }
    });
    const result = eval(`0b${templateDigits.reverse().join("")}`) as number;
    return result > 65535
        ? [
              (result >> 16) & 0xff,
              (result >> 24) & 0xff,
              result & 0xff,
              (result >> 8) & 0xff
          ]
        : [result & 0xff, (result >> 8) & 0xff];
};
