# Plugin API - Events
A plugin can [subscribe](./plugin-api-commands.md#subscribe) to multiple Events. These events will be sent to the plugin through its [update](./plugin-lifecycle.md#update) method.

For more detailed information, please see the [`zellij-tile`](https://docs.rs/zellij-tile/latest/zellij_tile/) API documentation.

## ModeUpdate
* Requires the `ReadApplicationState` [permission](./plugin-api-permissions.md)

Provides information about the input modes of Zellij (eg. `Normal`, `Locked`, `Pane`, `Tab`, etc.). It also provides information about the bound keys, the style (the active theme colors) and the session name.

## TabUpdate
* Requires the `ReadApplicationState` [permission](./plugin-api-permissions.md)

Provides information about the active tabs in Zellij, their position, name, whether they contain a pane in full screen, how many hidden panes they contain and information on the swap layouts.

## PaneUpdate
* Requires the `ReadApplicationState` [permission](./plugin-api-permissions.md)

Provides information about the active panes in Zellij, their title, command and exit code (if available), etc.

## SessionUpdate
* Requires the `ReadApplicationState` [permission](./plugin-api-permissions.md)

Provides information about the active sessions (of the current version) running on the machine.

## Key

A user pressed a key when focused to this plugin, this event also provides the key pressed.

## Mouse

A user issued a mouse action (click, scroll, etc.) while focused on the plugin, this event also provides the action in question.

## Timer
This event is fired when a timer the plugin set is expired. This corresponds to the `set_timeout` [plugin command](./plugin-api-commands.md#set_timeout);

## CopyToClipboard
* Requires the `ReadApplicationState` [permission](./plugin-api-permissions.md)

This event is fired when the user copies a String to their clipboard

## SystemClipboardFailure
* Requires the `ReadApplicationState` [permission](./plugin-api-permissions.md)

This event is fired when the user fails to copy a String to their clipboard

## InputReceived
This event is fired whenever any input is received in Zellij, but does not specify which input

## Visible
This event is fired when the current plugin becomes visible or invisible (eg. when switching a tab to and away from it).

## CustomMessage
This event corresponds to the `post_message_to` and `post_message_to_plugin` [plugin commands](./plugin-api-commands.md), used for a plugin and its workers to communicate. For more information, please see: [Workers for Async Tasks](./plugin-api-workers.md).

## FileSystemCreate, FileSystemRead, FileSystemUpdate, FileSystemDelete
These events are fired when the user creates a file, reads a file, updates a file or deletes a file in the folder in which Zellij was started. It includes a vector of the files in question.
