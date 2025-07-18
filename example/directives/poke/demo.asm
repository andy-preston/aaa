    .device("AT Tiny 2313")

    ; Poke inserts bytes directly into the object file

    ; This odd number of bytes will be zero padded to word align
    .poke(1, 2, 3, 4, 5, 6, 7)
    .poke("Hello there!")

    ; It's OK to poke multiple times in a JavaScript block
    {{
        const stuff = [1, 2, 3, 4];
        poke(...stuff);
        poke(...stuff);
    }}

    ; Sorry, Any errors will be reported on the whole code block
    {{
        const stuff = [1, 2, 3, 4];
        poke(stuff);
        poke(...stuff);
    }}

    ; You can put a label on your data
here: .poke(0xff)
