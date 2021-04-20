# Writing a Plugin in Another Language

This page is very much a work in progress! If you're familiar with WASM and Rust, then understanding the [`zellij-tile`][zellij-tile] library is a great place to start.

In short, Zellij expects your WASI module to export three functions:
- `main()` :: called once on plugin load
- `update()` :: called after event subscriptions are triggered
- `render(i32, i32)` :: called when the plugin needs to be rendered

The `render(i32, i32)` function is passed the size of the plugin pane, first the rows, then the columns – e.g. `render(rows, cols)`.

Complex types are sent over stdin as JSON objects. Before `update()` is called, Zellij writes an event to the plugin's stdin that can be read back in the `update()` function.

Host functions, for communicating with Zellij, are best documented by the `extern` section of [`zellij-tile::shim`][shim] and are found in a WASM module named `zellij`.

**Help Add More Language Guides!** If you'd like to contribute, either drop us a line on [Discord][discord] or open a PR improving [these docs][docs]!

[zellij-tile]: https://github.com/zellij-org/zellij/tree/main/zellij-tile
[shim]: https://github.com/zellij-org/zellij/blob/main/zellij-tile/src/shim.rs
[discord]: https://discord.gg/CrUAFH3
[docs]: https://github.com/zellij-org/zellij-org.github.io/tree/main/docs