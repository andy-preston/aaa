import { assertEquals } from "assert";
import { preprocessor } from "./vento.ts";

Deno.test("Does Vento, at least work with my config", async () => {
    const processor = preprocessor();
    const result = await processor.runString(
        "{{ test }}",
        {"test": "testing"}
    );
    assertEquals(result.content, "testing");
});
