import { assertEquals, assertThrows } from "assert";
import { newState } from "./mod.ts";
import { AllocationError, DeviceSelectionError } from "../errors/errors.ts";

Deno.test("A device must be selected before SRAM can be allocated", () => {
    const state = newState();
    state.pass.start(2);
    assertThrows(
        () => { state.dataMemory.alloc(23); },
        DeviceSelectionError,
        "No device selected - can't determine size of SRAM"
    );
});

Deno.test("A stack allocation can't be beyond available SRAM", () => {
    const state = newState();
    state.device.choose("dummy", { "ramEnd": 0x20 });
    state.pass.start(2);
    assertThrows(
        () => { state.dataMemory.allocStack(0x23); },
        AllocationError,
        "Can't allocate 0x23 bytes in SRAM, there are only 0x20 available"
    );
});

Deno.test("A memory allocation can't be beyond available SRAM", () => {
    const state = newState();
    state.device.choose("dummy", { "ramEnd": 0x20 });
    state.pass.start(2);
    assertThrows(
        () => { state.dataMemory.allocStack(0x23); },
        AllocationError,
        "Can't allocate 0x23 bytes in SRAM, there are only 0x20 available"
    );
});

Deno.test("Memory allocations start at the top of SRAM and work down", () => {
    const state = newState();
    state.device.choose("dummy", { "ramEnd": 100 });
    state.pass.start(2);
    assertEquals(state.dataMemory.alloc(25), 0);
    assertEquals(state.dataMemory.alloc(25), 25);
    assertEquals(state.dataMemory.alloc(25), 50);
});

Deno.test("Stack and memory allocations both decrease the available SRAM", () => {
    const state = newState();
    state.device.choose("dummy", { "ramEnd": 50 });
    state.pass.start(2);
    assertEquals(state.dataMemory.alloc(25), 0);
    state.dataMemory.allocStack(25);
    assertThrows(
        () => { state.dataMemory.alloc(23); },
        AllocationError,
        "Can't allocate 0x17 bytes in SRAM, there are only 0x0 available"
    );
});

Deno.test("Allocations don't get repeated on the second pass", () => {
    const state = newState();
    state.device.choose("dummy", { "ramEnd": 50 });
    state.pass.start(1);
    assertEquals(state.dataMemory.alloc(25), 0);
    assertEquals(state.dataMemory.alloc(25), 25);
    state.pass.start(2);
    assertEquals(state.dataMemory.alloc(25), 0);
    assertEquals(state.dataMemory.alloc(25), 25);
});
