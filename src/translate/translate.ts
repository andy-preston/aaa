import type { Line } from "../source-code/mod.ts";
import type { State } from "../state/mod.ts";
import { addressingModeList } from "./addressing-modes.ts";

export type GeneratedCode =
    | []
    | [number, number]
    | [number, number, number, number];

export const translator = (state: State) => {
    const addressingModes = addressingModeList(state);

    return (line: Line): GeneratedCode => {
        if (line.mnemonic == "") {
            return [];
        }
        const device = state.device.name(
            "determine which instructions are available"
        );
        if (state.device.isUnsupported(line.mnemonic)) {
            throw new Error(`${line.mnemonic} is not available on ${device}`);
        }
        let code: GeneratedCode | undefined;
        addressingModes.find(addressingMode => {
            code = addressingMode(line);
            return code != undefined
        });
        if (code == undefined) {
            throw new SyntaxError(`unknown instruction ${line.mnemonic}`);
        }
        return code;
    };
};
