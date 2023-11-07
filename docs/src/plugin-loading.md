# Loading Plugins
Plugins can either be loaded through a [Layout](./creating-a-layout.md#plugin), through the [command line](./cli-actions.md#launch-or-focus-plugin), or from a [keybinding](keybindings-possible-actions.md#launchorfocusplugin).

## Plugin URL schema
Plugins are referred to by URLs. Currently there are two supported schemas:
1. The file schema: `file:/absolute/path/to/my/plugin.wasm` - for reading plugins from the local HD
2. The built-in `zellij:` schema (eg. `zellij:tab-bar`) for loading built-in zellij plugins.
3. Urls (`http(s)://path/to/my/plugin.wasm`)
