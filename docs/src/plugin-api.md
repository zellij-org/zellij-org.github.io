# Plugin API

**Please also see the Rust-specific documentation: [zellij-tile](https://docs.rs/zellij-tile/latest/zellij_tile/).**

The plugin API provides plugins with several capabilities:

* [Events](./plugin-api-events.md) - A plugin can subscribe to one or more of these and receive an update whenever they happen.
* [Commands](./plugin-api-commands.md) - These are functions exported to the plugin, allowing it to affect Zellij and add functionality to it.
* [Accessing the HD](./plugin-api-file-system.md) - A plugin can use its development language's own standard library to access the filesystem folder in which Zellij was opened.
* [Workers for Async Tasks](./plugin-api-workers.md) - A plugin can have multiple workers to which it can offload heavy or long-running tasks without blocking its own rendering.
* [Log debug or error messages](./plugin-api-logging.md) - A plugin can log messages to STDERR which will appear in the Zellij logs.
