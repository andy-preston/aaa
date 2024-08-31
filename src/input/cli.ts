import { createOurContext } from "../context/mod.ts";
import { generator } from "../generate/mod.ts";
import { outputter } from "../output/mod.ts";
import { lineTokens } from "../tokens/mod.ts";
import { lineLoader } from "./line-loader.ts";
import { createLoader } from "./loader.ts";

const topFile = "./file1.txt";

const ourContext = createOurContext();
const output = outputter(topFile);
const loader = createLoader(
    ourContext,
    lineLoader(ourContext),
    lineTokens,
    generator(ourContext),
    output.output
);
ourContext.addDirective("include", loader.include);
loader.load(topFile);
output.close();
