import { inContext } from "../context/mod.ts";

const scriptDelimiter = /({{|}})/;

const buffer = {
    "javascript": [] as Array<string>,
    "assembler": [] as Array<string>
};

type State = keyof typeof buffer;

let state: State;

const change = (token: string) => {
    const newState: State = token == "{{" ? "javascript" : "assembler";
    if (state == newState) {
        throw new SyntaxError(`"${token}" when already in ${state} mode`);
    }
    state = newState;
};

const usePart = (part: string) => {
    if (part == "{{") {
        change(part);
        buffer.javascript = [];
        return;
    }
    if (part == "}}") {
        change(part);
        buffer.assembler.push(inContext(buffer.javascript.join("\n")));
        return;
    }
    buffer[state].push(part);
};

export const newSplitter = () => {
    state = "assembler";
    buffer.assembler = [];
};

export const languageSplit = (line: string): string => {
    line.split(scriptDelimiter).forEach(usePart);
    const assembler = buffer.assembler.join("").trim();
    buffer.assembler = [];
    return assembler;
};

export type LanguageSplit = typeof languageSplit;
