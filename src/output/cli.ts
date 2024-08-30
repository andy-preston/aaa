import { createOurContext } from "../context/mod.ts";
import { includeDirective } from "../directives/include.ts";
import { newListing } from "./listing.ts";

const topFile = "./file1.txt";

const ourContext = createOurContext();
const listing = newListing(topFile);
const include = includeDirective(listing.line);
ourContext.addDirective("include", include);
ourContext.load(topFile);
listing.close();
