import { inContext } from "../context/mod.ts";
import { Line } from "../line.ts";

const scriptDelimiter = /({{|}})/;

type Buffer = {
    "javascript": Array<string>,
    "assembler": Array<string>
};

type State = keyof Buffer;

type SplitLanguages = {
    state: State,
    buffer: Buffer
};

export const newSplitter = (): SplitLanguages => {
    return {
        "state": "assembler",
        "buffer": {
            "javascript": [],
            "assembler": []
        }
    };
};

export const languageSplit = (splitLanguages: SplitLanguages, line: Line) => {
    const change = (token: string) => {
        const newState: State = token == "{{" ? "javascript" : "assembler";
        if (splitLanguages.state == newState) {
            throw new SyntaxError(
                `"${token}" when already in ${splitLanguages.state} mode`
            );
        }
        splitLanguages.state = newState;
    };

    const usePart = (part: string) => {
        if (part == "{{") {
            change(part);
            splitLanguages.buffer.javascript = [];
            return;
        }
        if (part == "}}") {
            change(part);
            splitLanguages.buffer.assembler.push(
                inContext(splitLanguages.buffer.javascript.join("\n"))
            );
            return;
        }
        splitLanguages.buffer[splitLanguages.state].push(part);
    };

    line.rawLine.split(scriptDelimiter).forEach(usePart);
    const assembler = splitLanguages.buffer.assembler.join("").trim();
    splitLanguages.buffer.assembler = [];
    line.rawLine = assembler;
};

export type LanguageSplit = typeof languageSplit;
