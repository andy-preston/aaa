import type { OurContext } from "../context/mod.ts";

export const languageSplit = (ourContext: OurContext) => {
    const buffer = {
        "javascript": [] as Array<string>,
        "assembler": [] as Array<string>
    };

    type State = keyof typeof buffer;

    let state: State = "assembler";

    const scriptDelimiter = /({{|}})/;

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
            buffer.assembler.push(
                ourContext.execute(buffer.javascript.join("\n"))
            );
            return;
        }

        buffer[state].push(part);
    };

    return (line: string): string => {
        line.split(scriptDelimiter).forEach(usePart);
        const assembler = buffer.assembler.join("");
        buffer.assembler = [];
        return assembler;
    };
};

export type SplitLine = ReturnType<typeof languageSplit>;
