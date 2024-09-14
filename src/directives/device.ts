import type { InstructionSet, OurContext } from "../context/mod.ts";

export const deviceDirective = (context: OurContext) =>
    (name: string): void => {
        ////////////////////////////////////////////////////////////////////////
        //
        // As the device files haven't been imported yet. This is an interim
        // implementation that accepts an instruction set name as a parameter
        // rather than a device name
        //
        ////////////////////////////////////////////////////////////////////////
        context.instructionSet.choose(name as InstructionSet);
    };
