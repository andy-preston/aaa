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
}

const forbidWhitespace = (suspect: string) => {
    if (suspect.indexOf(" ") != -1) {
        throw new SyntaxError("Label must not contain whitespace")
    }
}

const clean = (theLine: string): string =>
    stripComment(theLine).replace(/\s+/g, " ").trim();

export const tokeniseLine = (theLine: string): Array<string> => {
    const cleaned = clean(theLine);
    const [label, withoutLabel] = split("after", ":", cleaned);
    forbidWhitespace(label);
    const [mnemonic, operands] = split("before", " ", withoutLabel);
    const [firstOperand, secondOperand] = split("before", ",", operands);
    return [label, mnemonic, firstOperand, secondOperand];
};
