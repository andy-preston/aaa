export { passes } from "./pass.ts";

import { contextValue } from "./context-value.ts";
import { dataMemory } from "./data-memory.ts";
import { deviceChooser } from "./device-chooser.ts";
import {
    type DeviceProperties as DevicePropertiesPrivate, deviceProperties
} from "./device-properties.ts";
import { newPass } from "./pass.ts";
import { pokeBuffer } from "./poke-peek.ts";
import {
    type ProgramMemory as ProgramMemoryPrivate, programMemory
} from "./program-memory.ts";

export type DeviceProperties = DevicePropertiesPrivate["public"];
export type ProgramMemory = ProgramMemoryPrivate["public"];

export const newState = () => {
    const device = deviceProperties();
    const data = dataMemory(device.public);
    const program = programMemory(device.public);
    const poke = pokeBuffer();
    const chooser = deviceChooser(device, program, data);
    const pass = newPass(() => {
        program.public.origin(0);
        data.reset();
    });

    return {
        "pass": pass,
        "contextValue": contextValue(pass),
        "dataMemory": data.public,
        "programMemory": program.public,
        "poke": poke,
        "device": {...device.public, ...chooser}
    };
};

export type State = ReturnType<typeof newState>;
