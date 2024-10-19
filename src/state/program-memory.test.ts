import { assertEquals, assertThrows } from "assert";
import { coupledProperty } from "../context/mod.ts";
import { blankSlate } from "../coupling/coupling.ts";
import { newState } from "./mod.ts";

Deno.test("a device must be selected before program memory can be set", () => {
    const state = newState();
    blankSlate();
    assertThrows(
        () => { state.programMemory.origin(10); },
        Error,
        "Without a device selected, it's not possible to determine size of Program Memory"
    );
});

Deno.test("org addresses can't be less than zero", () => {
    const state = newState();
    blankSlate();
    assertThrows(
        () => { state.programMemory.origin(-1); },
        Error,
        "Addresses must be positive"
    );
});

Deno.test("org addresses must be progmem size when a device is chosen", () => {
    const state = newState();
    blankSlate();
    state.device.choose("dummy", { "programEnd": 100 })
    assertThrows(
        () => { state.programMemory.origin(92); },
        Error,
        "92 beyond end of program memory (0x32)"
    );
});

Deno.test("programMemoryOrigin directive sets current address", () => {
    const state = newState();
    blankSlate();
    state.device.choose("dummy", { "programEnd": 100 })
    coupledProperty("progmemEnd", state.programMemory.end);
    state.programMemory.origin(0);
    assertEquals(0, state.programMemory.address());
    state.programMemory.origin(42);
    assertEquals(42, state.programMemory.address());
});
