import { assertEquals, assertThrows } from "assert";
import { chooseDevice, coupledProperty } from "../context/mod.ts";
import {
    programMemoryEnd, programMemoryAddress, programMemoryOrigin
} from "../state/mod.ts";
import { blankSlate } from "../coupling/coupling.ts";

Deno.test("a device must be selected before program memory can be set", () => {
    blankSlate();
    assertThrows(
        () => { programMemoryOrigin(10); },
        Error,
        "Without a device selected, it's not possible to determine size of Program Memory"
    );
});

Deno.test("org addresses can't be less than zero", () => {
    blankSlate();
    assertThrows(
        () => { programMemoryOrigin(-1); },
        Error,
        "Addresses must be positive"
    );
});

Deno.test("org addresses must be progmem size when a device is chosen", () => {
    blankSlate();
    chooseDevice("dummy", { "programEnd": 100 })
    assertThrows(
        () => { programMemoryOrigin(92); },
        Error,
        "92 beyond end of program memory (0x32)"
    );
});

Deno.test("programMemoryOrigin directive sets current address", () => {
    blankSlate();
    chooseDevice("dummy", { "programEnd": 100 })
    coupledProperty("progmemEnd", programMemoryEnd);
    programMemoryOrigin(0);
    assertEquals(0, programMemoryAddress());
    programMemoryOrigin(42);
    assertEquals(42, programMemoryAddress());
});
