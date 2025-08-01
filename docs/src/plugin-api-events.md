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

## RunCommandResult
Returned after the `RunCommand` [plugin command](./plugin-api-commands.md). Containing the exit status, STDIN and STDOUT of the command as well as the context (an arbitrary string dictionary) provided when initiating the command.

## WebRequestResult
Returned after the `WebRequest` [plugin command](./plugin-api-commands.md). Containing the status code and body of the request as well as the context (an arbitrary string dictionary) provided when initiating the command.

## CommandPaneOpened
* Requires the `ReadApplicationState` [permission](./plugin-api-permissions.md)

Returned after a pane opened with the `OpenCommandPane` [plugin command](./plugin-api-commands.md) is opened. Contains the terminal pane id of the pane, the context (an arbitrary string dictionary) provided when initiating the command.

## CommandPaneExited
* Requires the `ReadApplicationState` [permission](./plugin-api-permissions.md)

Returned after a pane opened with the `OpenCommandPane` [plugin command](./plugin-api-commands.md) has exited. Note that this does not mean the pane is closed, it only means the command inside it has exited. This can happen multiple times if (for example) the user reruns the command by pressing `Enter` when focused on the command pane. Contains the terminal pane id of the pane, the command's numeric exit code (if there was one) as well as the context (an arbitrary string dictionary) provided when initiating the command.

## PaneClosed
* Requires the `ReadApplicationState` [permission](./plugin-api-permissions.md)

A pane inside the current session was closed. Includes the pane's id.

## EditPaneOpened
* Requires the `ReadApplicationState` [permission](./plugin-api-permissions.md)

Returned after a pane opened with the `OpenFile` [plugin command](./plugin-api-commands.md) is opened. Contains the terminal pane id of the editor pane, the context (an arbitrary string dictionary) provided when initiating the command.

## EditPaneExited
* Requires the `ReadApplicationState` [permission](./plugin-api-permissions.md)

Returned after a pane opened with the `OpenFile` [plugin command](./plugin-api-commands.md) has exited. Contains the terminal pane id of the editor pane, the editor's numeric exit code (if there was one) as well as the context (an arbitrary string dictionary) provided when initiating the command.

## CommandPaneReRun
* Requires the `ReadApplicationState` [permission](./plugin-api-permissions.md)

Returned after a pane opened with the `OpenCommandPane` [plugin command](./plugin-api-commands.md) has been re-run. This can happen multiple times and is often (but not necessarily) a result of the user pressing `Enter` when focused on the command pane. Contains the terminal pane id of the pane, the command's numeric exit code (if there was one) as well as the context (an arbitrary string dictionary) provided when initiating the command.

## FailedToWriteConfigToDisk
* Requires the `ReadApplicationState` [permission](./plugin-api-permissions.md)

After the plugin attempted writing the configuration to disk (with the `Reconfigure` [plugin command](./plugin-api-commands.md)) and there was an error (eg. the file was read-only), this event is sent - optionally with the relevant error.

## ListClients
The result of the `ListClients` [plugin command](./plugin-api-commands.md). Contains information about all connected clients in the session, including their id, their focused pane id, the stringified representation of the running command or plugin inside their focused pane (if any), as well as an indication of whether they are the current client or not.

## PastedText
The user just pasted the given text while focused on the plugin.

## ConfigWasWrittenToDisk
A new configuration was successfully saved in the configuration file listened to by the current session.

## WebServerStatus
This event is sent as a reply to the `QueryWebServer` command. It can be either online (and include the base url), offline or different_version (including the specified version).

## FailedToStartWebServer
This event is sent as a reply to the `StartWebServer` command, when Zellij failed to start the web server. It includes a String representing the error.

## BeforeClose
This event (if subscribed to) is called before a plugin is being unloaded, and is a chance for a plugin to do some cleanups.

## InterceptedKeyPress
This event is similar to the Key Event, but represent a keypress that was intercepted after the InterceptKeyPresses plugin command was issued.
