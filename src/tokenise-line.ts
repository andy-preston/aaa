const stripComment = (theLine: string): string => {
    const semicolon = theLine.indexOf(";");
    return semicolon == -1 ? theLine : theLine.substring(0, semicolon);
};

const preParse = (theLine: string): string =>
    stripComment(theLine).replace(/\s+/g, " ").trim();

const stripComma = (firstOperand: string): string => {
    const comma = firstOperand.slice(-1);
    if (comma != ",") {
        throw new Error("Comma expected after first operand");
    }
    return firstOperand.slice(0, -1);
};

export const parseLine = (theLine: string): Array<string> => {
    const tokens = preParse(theLine).split(" ");
    if (tokens.length > 2) {
        tokens[1] = stripComma(tokens[1]!);
    }
    return tokens;
};
