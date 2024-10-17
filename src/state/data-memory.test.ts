import { assertEquals, assertThrows } from "assert";
import { blankSlate } from "../coupling/coupling.ts";
import { alloc, allocStack } from "./data-memory.ts";
import { chooseDevice } from "../context/mod.ts";
import { newState } from "./mod.ts";

const state = newState();

Deno.test("A device must be selected before SRAM can be allocated", () => {
    blankSlate();
    assertThrows(
        () => { alloc(23); },
        Error,
        "Without a device selected, it's not possible to determine size of Data Memory"
    );
});

Deno.test("A stack allocation can't be beyond available SRAM", () => {
    blankSlate();
    chooseDevice("dummy", { "ramEnd": 20 });
    assertThrows(
        () => { allocStack(23); },
        Error,
        "Can't allocate 23 bytes in SRAM, there are only 20 available"
    );
});

Deno.test("A memory allocation can't be beyond available SRAM", () => {
    blankSlate();
    chooseDevice("dummy", { "ramEnd": 20 });
    assertThrows(
        () => { alloc(23); },
        Error,
        "Can't allocate 23 bytes in SRAM, there are only 20 available"
    );
});

Deno.test("Memory allocations start at the top of SRAM and work down", () => {
    blankSlate();
    chooseDevice("dummy", { "ramEnd": 100 });
    assertEquals(alloc(25), 0);
    assertEquals(alloc(25), 25);
    assertEquals(alloc(25), 50);
});

Deno.test("Stack and memory allocations both decrease the available SRAM", () => {
    blankSlate();
    chooseDevice("dummy", { "ramEnd": 50 });
    assertEquals(alloc(25), 0);
    allocStack(25);
    assertThrows(
        () => { alloc(23); },
        Error,
        "Can't allocate 23 bytes in SRAM, there are only 0 available"
    );
});

Deno.test("Allocations don't get repeated on the second pass", () => {
    blankSlate();
    chooseDevice("dummy", { "ramEnd": 50 });
    state.pass.start(1);
    assertEquals(alloc(25), 0);
    assertEquals(alloc(25), 25);
    state.pass.start(2);
    assertEquals(alloc(25), 0);
    assertEquals(alloc(25), 25);
});
