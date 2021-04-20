# Plugins

One feature that makes Zellij unique is its [WebAssembly][wasm] plugin system. This allows plugin developers to write their plugin in anyu language that can run on [WASI][wasi]! Rust offers first-class [support for WASI][rust], but other languages like [C/C++][c], [AssemblyScript][asmscript], even [Python][python] should be supported.

**Disclaimer: The API for plugins is very much a work in progress. Don't be shy to request new features on our [tracking issue][pluginapi]!**

[wasm]: https://webassembly.org/
[wasi]: https://wasi.dev/
[rust]: https://github.com/bytecodealliance/wasmtime/blob/main/docs/WASI-tutorial.md#from-rust
[c]: https://github.com/bytecodealliance/wasmtime/blob/main/docs/WASI-tutorial.md#from-c
[asmscript]: https://wasmbyexample.dev/examples/wasi-hello-world/wasi-hello-world.assemblyscript.en-us.html
[python]: https://wapm.io/package/rustpython
[pluginapi]: https://github.com/zellij-org/zellij/issues/280
