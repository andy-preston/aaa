import type { FileName } from "./file-name.ts";
import { openOutput } from "./output/mod.ts";
import { newState, passes } from "./state/mod.ts";
import { sourceLines } from "./source-code/mod.ts";
import { codeBlockGenerator } from "./translate/mod.ts";

export const cli = (commandLineSourceFile: FileName) => {
    const state = newState();
    const source = sourceLines(state.context);
    const codeBlocksFrom = codeBlockGenerator(state);

    state.context.directive("include", source.includeFile);
    state.context.directive("device", state.device.directive);
    state.context.directive("org", state.programMemory.origin);
    state.context.directive("poke", state.poke.poke);
    state.context.directive("allocStack", state.dataMemory.allocStack);
    state.context.directive("alloc", state.dataMemory.alloc);
    state.context.coupledProperty("progmemEnd", state.programMemory.end);
    state.context.coupledProperty("ramStart", state.dataMemory.ramStart);
    state.context.coupledProperty("ramEnd", state.dataMemory.ramEnd);

    passes.forEach(pass => {
        state.pass.start(pass);
        const output = pass == 2
            ? openOutput(commandLineSourceFile)
            : undefined;
        source.lines(commandLineSourceFile).forEach(line => {
            output?.source(line);
            codeBlocksFrom(line).forEach(block => {
                output?.codeBlock(block);
            });
        });
        output?.close();
        source.check();
    });
};
