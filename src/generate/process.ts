import { deviceChecker } from "../context/mod.ts";
import { OurContext } from "../context/mod.ts";
import { type BufferPeek, type GeneratedCode, translator } from "./mod.ts";
import { type Instruction, lineLoader, lineTokens } from "../source-line/mod.ts";

type Address = number;
type ErrorMessage = string;
type Poked = boolean;
type Processed = [Address, GeneratedCode, ErrorMessage, Poked];

export const processor = (ourContext: OurContext, peek: BufferPeek) => {
    const deviceCheck = deviceChecker(ourContext);
    const loadLine = lineLoader(ourContext);
    const translate = translator(ourContext);

    const nextInstruction = (rawLine: string): Instruction => {
        const [label, mnemonic, operands] = lineTokens(loadLine(rawLine));
        if (label != "") {
            ourContext.label(label);
        }
        return [mnemonic, operands];
    }

    return function* (rawLine: string): Generator<Processed, void, undefined> {
        for (const block of peek()) {
            yield [ourContext.programMemoryPos, block, "", true];
            ourContext.programMemoryStep(block);
        }
        const instruction = nextInstruction(rawLine);
        let errorMessage = deviceCheck(instruction[0]);
        let code: GeneratedCode = [];
        if (errorMessage == "") {
            try {
                code = translate(instruction);
            } catch (error) {
                errorMessage = `${error.name}: ${error.message}`;
            }
        }
        yield [ourContext.programMemoryPos, code, errorMessage, false]
        ourContext.programMemoryStep(code);
    };
};
