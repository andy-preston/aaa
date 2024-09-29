import { Tokens } from "../source-code/mod.ts";

const activeMacro = false;

export const macroLines =
    function* (): Generator<Tokens, undefined, undefined> {
        if (activeMacro) {
            yield ["", "MOV", ["R1", "R2"]];
        }
        return;
    };
