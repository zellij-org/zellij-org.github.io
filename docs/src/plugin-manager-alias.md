# The plugin-manager alias

This alias, by default translated to the internal `zellij:plugin-manager` plugin url, is the plugin manager, loaded by default with `Ctrl o` + `p`. It lists the running plugins, and loads new ones in the background or the foreground. See [Loading Plugins](./plugin-loading.md#through-the-built-in-plugin-manager).

## Contract

Zellij loads the plugin manager as a floating pane. Zellij has no other expectations from this plugin, but users will probably expect it to list, load and reload plugins.
