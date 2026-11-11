# Plugin API

**Please also see the Rust-specific documentation: [zellij-tile](https://docs.rs/zellij-tile/latest/zellij_tile/).**

The plugin API provides plugins with several capabilities:

* [Events](./plugin-api-events.md) - A plugin can subscribe to one or more of these and receive an update whenever they happen.
* [Commands](./plugin-api-commands.md) - These are functions exported to the plugin, allowing it to affect Zellij and add functionality to it.
* [Types](./plugin-api-types.md) - The data types used by commands and events.
* [Permissions](./plugin-api-permissions.md) - Which commands and events need the user's permission.
* [Configuration](./plugin-api-configuration.md) - How plugins receive their configuration.
* [Accessing the HD](./plugin-api-file-system.md) - A plugin can use its development language's own standard library to access the filesystem folder in which Zellij was opened.
* [Workers for Async Tasks](./plugin-api-workers.md) - A plugin can have multiple workers to which it can offload heavy or long-running tasks without blocking its own rendering.
* [Log debug or error messages](./plugin-api-logging.md) - A plugin can log messages to STDERR which will in the Zellij logs.

Plugins can also:

* Open [popups](./plugin-api-commands.md#popups--prompts) and ask the user questions with [`prompt`](./plugin-api-commands.md#prompt).
* Open Zellij's [context menu](./plugin-api-commands.md#context-menu) for a tab or a bar.
* Add an entry to the [settings screen](./plugin-api-commands.md#settings-screen-entry) that opens their own settings.
* [Read and edit the configuration](./plugin-api-commands.md#editing-the-configuration) the way the settings screen does.
* Give their space in the layout back while they have nothing to show, with [`set_self_collapsed`](./plugin-api-commands.md#set_self_collapsed).
* Serve many panes from a single instance, as [shared plugins](./plugin-lifecycle.md#shared-plugins).
* Follow the input mode and keybindings of [nested sessions](./plugin-api-commands.md#nested-sessions).
* Work with panes in [other sessions and their attention state](./plugin-api-commands.md#other-sessions--attention), and show a [live view](./plugin-api-commands.md#pane-mirror-live-view) of another pane.
