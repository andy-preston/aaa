import type { PipelineProcess } from "../assembler/data-types.ts";
import type { CurrentLine } from "../line/current-line.ts";

import { addFailure } from "../failure/add-failure.ts";
import { boringFailure } from "../failure/bags.ts";
import { splitSource } from "./split-source.ts";
import { upperCaseRegisters } from "./upper-case-registers.ts";

const anyWhitespace = /\s+/g;
const comment = /;.*$/;
const validLabel = /^\w*$/;

const clean = (sourceLine: string) =>
    sourceLine.replace(comment, "").replace(anyWhitespace, " ").trim();

const splitOperands = (text: string): Array<string> =>
    text == "" ? [] : text.split(",").map(operand => operand.trim());

export const tokens = (currentLine: CurrentLine): PipelineProcess => () => {
    const cleaned = clean(currentLine().assemblySource);

    const [label, withoutLabel] = splitSource("after", ":", cleaned);
    if (!validLabel.test(label)) {
        addFailure(currentLine().failures, boringFailure(
            "syntax_invalidLabel"
        ));
    }

    const mnemonicAndOperands = splitSource("before", " ", withoutLabel);
    const mnemonic = mnemonicAndOperands[0].toUpperCase();
    const operandsText = mnemonicAndOperands[1];

    if (mnemonic != "" && !mnemonic.match("^[A-Z]+$")) {
        addFailure(currentLine().failures, boringFailure(
            "syntax_invalidMnemonic"
        ));
    }

    const operandsList = splitOperands(operandsText);
    currentLine().operands = operandsList.map(upperCaseRegisters);
    currentLine().label = label;
    currentLine().mnemonic = mnemonic;
};
