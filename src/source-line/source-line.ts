import { OurContext } from "../context/mod.ts";
import { lineLoader } from "./line-loader.ts";
import { lineTokens, type Tokens } from "./tokens.ts";

export const sourceTokens = (ourContext: OurContext) => {
    const loadLine = lineLoader(ourContext);
    return (rawLine: string): Tokens => lineTokens(loadLine(rawLine));
};
