import type { OurContext } from "../context/mod.ts";

const buffer = {
    "javascript": [] as Array<string>,
    "assembler": [] as Array<string>
};

type State = keyof typeof buffer;

export const newLineLoader = (ourContext: OurContext) => {
    let state: State = "assembler";

    const change = (token: string) => {
        const newState: State = token == "{{" ? "javascript" : "assembler";
        if (state == newState) {
            throw new SyntaxError(`"${token}" when already in ${state} mode`);
        }
        state = newState;
    };

    buffer.javascript = [];
    buffer.assembler = [];

    const usePart = (part: string) => {
        if (part == "{{") {
            change(part);
            buffer.javascript = [];
            return;
        }

        if (part == "}}") {
            change(part);
            buffer.assembler.push(
                ourContext.execute(
                    buffer.javascript.join("\n")
                )
            );
            return;
        }

        buffer[state].push(part);
    };

    return (line: string) => {
        line.split(/({{|}})/).forEach(usePart);
        const assembler = buffer.assembler.join("");
        buffer.assembler = [];
        return assembler;
    };
};
