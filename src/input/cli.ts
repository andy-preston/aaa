import { createOurContext } from "../context/mod.ts";
import { directives } from "../directives/list.ts";
import { generator } from "../generate/mod.ts";
import { outputter } from "../output/mod.ts";
import { lineTokens } from "../tokens/mod.ts";
import { fileLoader } from "./file-loader.ts";
import { lineLoader } from "./line-loader.ts";

const topFile = "./file1.txt";

const ourContext = createOurContext();
const output = outputter(topFile);
const loader = fileLoader(
    ourContext,
    lineLoader(ourContext),
    lineTokens,
    generator(ourContext),
    output.output
);
ourContext.addDirective(["include", loader.include]);
for (const directive of directives) {
    ourContext.addDirective(directive);
}
loader.load(topFile);
output.close();
