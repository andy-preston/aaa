import type { OurContext } from "../context/mod.ts";
import { deviceDirective } from "./device.ts";

export const addDirectives = (context: OurContext) => {
    context.addDirective("device", deviceDirective(context));
};
