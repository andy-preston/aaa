import { newLine, type Line } from "./line.ts";

const activeMacro = false;

export const macroLines =
    function* (): Generator<Line, undefined, undefined> {
        if (activeMacro) {
            yield newLine("", 0, "");
        }
        return;
    };
