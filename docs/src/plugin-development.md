# Developing a Plugin

This section talks about developing a Zellij plugin in Rust.

- [Development Environment](./plugin-dev-env.md): walks through the example Rust plugin, this will explain how to create a local environment to iterate over plugin development.
- [Plugin Lifecycle](./plugin-lifecycle.md): talks about the plugin interface and zellij-tile - the Rust library Zellij provides to facilitate development
- [Rendering a UI](./plugin-ui-rendering.md): Talks about the implicit contracts Zellij has with plugins in regards to ANSI rendering, and about the built-in UI components - both the display components (tables, lists, text) and the interactive ones (buttons, text inputs, dropdowns, menus, dialogs) with their keyboard, mouse and focus handling
- [Upgrading and Backwards Compatibility](./plugin-upgrading.md): Gives instructions on how to upgrade Zellij plugins when a new Zellij version comes out, and when this needs to be done
