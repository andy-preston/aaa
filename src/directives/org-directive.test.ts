import { assertEquals, assertThrows } from "assert";
import { createOurContext } from "../context/mod.ts";
import { orgDirective } from "./org-directive.ts";

Deno.test("org addresses can't be less than zero", () => {
    const context = createOurContext();
    assertThrows(
        () => { orgDirective(context)(-1); },
        Error,
        "Addresses must be positive"
    );
});

Deno.test("org addresses must be below 0xffff/2 by default", () => {
    const context = createOurContext();
    assertThrows(
        () => { orgDirective(context)(32768); },
        Error,
        "32768 beyond programEnd (32767)"
    );
});

Deno.test("org addresses must be progmem size when a device is chosen", () => {
    const context = createOurContext();
    context.chooseDevice({"programEnd": 100})
    assertThrows(
        () => { orgDirective(context)(92); },
        Error,
        "92 beyond programEnd (50)"
    );
});

Deno.test("org directive sets current address", () => {
    const context = createOurContext();
    assertEquals(0, context.programMemoryPos);
    orgDirective(context)(53);
    assertEquals(53, context.programMemoryPos);
});
