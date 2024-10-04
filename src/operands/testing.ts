import { newContext, newDeviceChecker } from "../context/mod.ts";
import { startPass } from "../process/mod.ts";

export const setupTest = () => {
    newContext();
    newDeviceChecker();
    startPass(2);
}
