import { cli } from "./coupling/cli.ts";
import { blankSlate, coupling } from "./coupling/coupling.ts";

blankSlate();
coupling();
cli("./file1.txt");
