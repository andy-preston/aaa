import { InternalError } from "../errors/errors.ts";
import type { Context } from "../state/context.ts";
import type { Line } from "./line.ts";

const buffer: Record<string, Array<string>> = {
    "javascript": [],
    "assembler": []
};

type BufferName = keyof typeof buffer;

const scriptDelimiter = /({{|}})/;

export const languageSplitter = (context: Context) => {
    let state: BufferName = "assembler";

    const change = (token: string) => {
        const newState: BufferName = token == "{{" ? "javascript" : "assembler";
        if (state == newState) {
            throw new SyntaxError(`"${token}" when already in ${state} mode`);
        }
        state = newState;
    };

    const contentsOf = (name: BufferName) => {
        const result = buffer[name]!.join(
            name == "javascript" ? "\n" : ""
        ).trim();
        buffer[name] = [];
        return result;
    };

    const check = () => {
        if (state != "assembler") {
            throw new Error("Final JavaScript block was not closed with \"}}\"");
        }
        for (const bufferName in buffer) {
            if (buffer[bufferName]!.length != 0) {
                throw new InternalError(`${bufferName} buffer not flushed!`);
            }
        }
    };

    const usePart = (part: string) => {
        if (part == "{{") {
            change(part);
            return;
        }
        if (part == "}}") {
            change(part);
            buffer.assembler!.push(context.value(contentsOf("javascript")));
            return;
        }
        buffer[state]!.push(part);
    };

    const split = (line: Line) => {
        line.rawLine.split(scriptDelimiter).forEach(usePart);
        line.assemblyLine = contentsOf("assembler");
    };

    return {
        "check": check,
        "split": split
    };
};