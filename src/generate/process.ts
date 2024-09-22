import { deviceChecker } from "../context/mod.ts";
import type { OurContext } from "../context/mod.ts";
import type { BufferPeek } from "./poke-buffer.ts";
import { translator } from "./translator.ts";
import type { GeneratedCode } from "./types.ts";
import { type Instruction, lineTokens } from "../source-line/mod.ts";
import type { OperandConverter } from "../operands/mod.ts";

type Address = number;
type ErrorMessage = string;
type Poked = boolean;
type Processed = [Address, GeneratedCode, ErrorMessage];

export const processor = (
    ourContext: OurContext,
    operandConverter: OperandConverter,
    peek: BufferPeek
) => {
    const deviceCheck = deviceChecker(ourContext);
    const translate = translator(ourContext, operandConverter);

    const nextInstruction = (line: string): Instruction => {
        const [label, mnemonic, operands] = lineTokens(line);
        if (label != "") {
            ourContext.label(label);
        }
        return [mnemonic, operands];
    }

    return function* (line: string): Generator<Processed, void, undefined> {
        // This has to come before ANY yields to make sure labels are handled
        // correctly for poke directives
        const instruction = nextInstruction(line);

        for (const block of peek()) {
            yield [ourContext.programMemoryPos, block, ""];
            ourContext.programMemoryStep(block);
        }
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
