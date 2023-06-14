# Loading Plugins
Plugins can either be loaded through a [Layout](./creating-a-layout.md), through the [command line](./controlling-zellij-through-cli.md), from a [keybinding](keybindings.md) or even [from another plugin](./plugin-api-commands.md).

## Plugin URL schema
Plugins are referred to by URLs. Currently there are two supported schemas:
1. The file schema: `file:/absolute/path/to/my/plugin.wasm` - for reading plugins from the local HD
2. The built-in `zellij:` schema (eg. `zellij:tab-bar`) for loading built-in zellij plugins.

Loading plugins from the internet (eg. `https://` or `http://`) will be supported in the future.
