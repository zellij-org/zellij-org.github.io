# Plugins

**Disclaimer: The plugin system is currently undergoing an overhaul, please expect breaking changes. The current system is unfortunately in minimal maintenance mode. We thank you for your patience and hope to have things stabilized in the coming months.**

One feature that makes Zellij unique is its [WebAssembly][wasm] plugin system. This allows plugin developers to write their plugin in any language that can run on [WASI][wasi]! Rust offers first-class [support for WASI][rust], but other languages like [C/C++][c], [AssemblyScript][asmscript], even [Python][python] should be supported.


[wasm]: https://webassembly.org/
[wasi]: https://wasi.dev/
[rust]: https://github.com/bytecodealliance/wasmtime/blob/main/docs/WASI-tutorial.md#from-rust
[c]: https://github.com/bytecodealliance/wasmtime/blob/main/docs/WASI-tutorial.md#from-c
[asmscript]: https://wasmbyexample.dev/examples/wasi-hello-world/wasi-hello-world.assemblyscript.en-us.html
[python]: https://wapm.io/package/rustpython
[pluginapi]: https://github.com/zellij-org/zellij/issues/280
