import { deviceChecker } from "../context/mod.ts";
import type { OurContext } from "../context/mod.ts";
import { type BufferPeek, type GeneratedCode, translator } from "./mod.ts";
import { type Instruction, lineTokens } from "../source-line/mod.ts";

type Address = number;
type ErrorMessage = string;
type Poked = boolean;
type Processed = [Address, GeneratedCode, ErrorMessage];

export const processor = (ourContext: OurContext, peek: BufferPeek) => {
    const deviceCheck = deviceChecker(ourContext);
    const translate = translator(ourContext);

    const nextInstruction = (line: string): Instruction => {
        const [label, mnemonic, operands] = lineTokens(line);
        if (label != "") {
            ourContext.label(label);
        }
        return [mnemonic, operands];
    }

    return function* (line: string): Generator<Processed, void, undefined> {
        for (const block of peek()) {
            yield [ourContext.programMemoryPos, block, ""];
            ourContext.programMemoryStep(block);
        }
        const instruction = nextInstruction(line);
        let errorMessage = deviceCheck(instruction[0]);
        let code: GeneratedCode = [];
        if (errorMessage == "") {
            try {
                code = translate(instruction);
            } catch (error) {
                errorMessage = `${error.name}: ${error.message}`;
            }
        }
        yield [ourContext.programMemoryPos, code, errorMessage]
        ourContext.programMemoryStep(code);
    };
};

export type ProcessGenerator = ReturnType<typeof processor>;
