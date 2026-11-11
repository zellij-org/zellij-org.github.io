# Developing a Plugin in Other Languages
Here's a list of other SDKs for developing Zellij plugins in languages other than Rust:

1. [Go](https://gitlab.com/scabala/zelligo)
2. Your SDK?

## Notes for SDK authors

### The `zellij_plugin_contract` export
Zellij checks whether a plugin exports a function called `zellij_plugin_contract`. The function takes no arguments, returns nothing and does nothing. It only marks the plugin as built for `0.46.0` or later.

A plugin without this export is treated as built for `0.45`. Zellij then leaves out events and pipe messages that a `0.45` plugin could not read (see [Plugins compiled for older versions](./plugin-upgrading.md#plugins-compiled-for-older-versions)). SDKs that support the `0.46.0` API should export this function from every plugin. The Rust SDK does this in its `register_plugin!` macro.

### UI components
The built-in UI components are drawn by printing a private escape sequence to `STDOUT`. This includes interactive components (buttons, toggles, text inputs, number steppers, dropdowns, menus, side menus, scroll indicators and dialogs). Their encoding is described in [The Protocol](./plugin-ui-rendering.md#the-protocol).

Zellij only draws these components; it does not handle their input. In the Rust SDK, keyboard and mouse handling, focus, scrolling and hit-testing all happen inside the plugin (see [How interactive components work](./plugin-ui-rendering.md#how-interactive-components-work)), so an SDK needs to provide this logic itself.
