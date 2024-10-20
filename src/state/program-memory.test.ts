import { assertEquals, assertThrows } from "assert";
import { newState } from "./mod.ts";
import { DeviceSelectionError, NumericError, ProgramMemoryError } from "../errors/errors.ts";

Deno.test("a device must be selected before program memory can be set", () => {
    const state = newState();
    assertThrows(
        () => { state.programMemory.origin(10); },
        DeviceSelectionError,
        "No device selected - can't determine size of Program Memory"
    );
});

Deno.test("org addresses can't be less than zero", () => {
    const state = newState();
    assertThrows(
        () => { state.programMemory.origin(-1); },
        NumericError,
        "-1 must be: >= 0"
    );
});

Deno.test("org addresses must be progmem size when a device is chosen", () => {
    const state = newState();
    state.device.choose("dummy", { "programEnd": 100 })
    assertThrows(
        () => { state.programMemory.origin(92); },
        ProgramMemoryError,
        "0x5c beyond end of program memory (0x32)"
    );
});

Deno.test("programMemoryOrigin directive sets current address", () => {
    const state = newState();
    state.device.choose("dummy", { "programEnd": 100 })
    state.context.coupledProperty("progmemEnd", state.programMemory.end);
    state.programMemory.origin(0);
    assertEquals(0, state.programMemory.address());
    state.programMemory.origin(42);
    assertEquals(42, state.programMemory.address());
});
