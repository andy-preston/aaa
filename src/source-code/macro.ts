import type { Tokens } from "./tokens.ts";

const activeMacro = false;

export const macroLines =
    function* (): Generator<Tokens, undefined, undefined> {
        if (activeMacro) {
            yield ["", "MOV", ["R1", "R2"]];
        }
        return;
    };
