import { cli } from "./coupling/cli.ts";
import { blankSlate, coupling } from "./coupling/coupling.ts";

blankSlate();
cli(coupling(), "./file1.txt");
