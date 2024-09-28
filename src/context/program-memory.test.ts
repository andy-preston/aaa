import { assertEquals, assertThrows } from "assert";
import { chooseDevice, newDeviceChecker } from "./device.ts";
import { programMemoryAddress, programMemoryOrigin } from "./program-memory.ts";
import { addCoupledProperty, newContext } from "./context.ts";
import { getProgramMemoryEnd } from "./program-memory.ts";

Deno.test("org addresses can't be less than zero", () => {
    assertThrows(
        () => { programMemoryOrigin(-1); },
        Error,
        "Addresses must be positive"
    );
});

Deno.test("org addresses must be below 0xffff/2 by default", () => {
    assertThrows(
        () => { programMemoryOrigin(32768); },
        Error,
        "32768 beyond programEnd (32767)"
    );
});

Deno.test("org addresses must be progmem size when a device is chosen", () => {
    newDeviceChecker();
    chooseDevice("dummy", { "programEnd": 100 })
    assertThrows(
        () => { programMemoryOrigin(92); },
        Error,
        "92 beyond programEnd (50)"
    );
});

Deno.test("org directive sets current address", () => {
    newContext();
    addCoupledProperty("progmemEnd", getProgramMemoryEnd);
    programMemoryOrigin(0);
    assertEquals(0, programMemoryAddress());
    programMemoryOrigin(42);
    assertEquals(42, programMemoryAddress());
});
