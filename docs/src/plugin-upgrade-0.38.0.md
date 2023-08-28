# Plugin Upgrade Guide for version 0.38.0

Version 0.38.0 includes some breaking changes for plugins. This guide aims to provide a check list for plugin authors to quickly update their plugins:

## configuration
Plugins are now configurable. This means that the `load` lifecycle-method now includes an additional `configuration` parameter which is an arbitrary list of key/value strings. For more info, please see [configuration](./plugin-api-configuration.md).

If you don't want to use the configuration, you can include a second `configuration` parameter in the load function and not use it. For a rust example, see: https://github.com/zellij-org/rust-plugin-example/blob/main/src/main.rs#L17

## permission-system
Starting from this version, Zellij includes a permission system to give more power to users over the plugins they load. Many [Events](./plugin-api-events.md) and [Commands](./plugin-api-commands.md) now require certain permissions. If your plugin relies on these commands, you'll need to include a `request_permission` command in your `load` method to prompt the user to give your plugin these permissions. For a rust example, please see: https://github.com/zellij-org/rust-plugin-example/blob/main/src/main.rs#L22

## protocol buffers
Starting this version, plugins use protocol buffers to communicate across the wasm boundary. If you're using the official sdk (zellij-tile) this should be transparent to you, and you can remedy any issues by compiling against the latest zellij-tile version (0.38.0 as well).

The upshot of this is that this change should make plugins forwards compatible (barring API behavior change of course).
