import { createOurContext } from "../context/mod.ts";
import { createGenerator } from "../generate/mod.ts";
import { createListing } from "../output/mod.ts";
import { lineTokens } from "../tokens/mod.ts";
import { createLineLoader } from "./line-loader.ts";
import { createLoader } from "./loader.ts";

const topFile = "./file1.txt";

const ourContext = createOurContext();
const listing = createListing(topFile);
const loader = createLoader(
    ourContext,
    createLineLoader(ourContext),
    lineTokens,
    createGenerator(ourContext),
    listing.line
);
ourContext.addDirective("include", loader.include);
loader.load(topFile);
listing.close();
