import { newContext, newDeviceChecker } from "../context/mod.ts";
import { setPass } from "./numeric.ts";

export const setupTest = () => {
    newContext();
    newDeviceChecker();
    setPass(2);
}
