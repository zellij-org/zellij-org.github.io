# Permissions
The plugin system provides a permission system to provide extra security and protection to the user.

The system places certain [Events](./plugin-api-events.md) and [Commands](./plugin-api-commands.md) behind certain permissions.
Plugins who want to listen to these events or use these commands should prompt the user to grant them these permissions with the `request_permission` command.

Each command and event page entry lists the permission it requires. A few commands require two permissions at once (eg. [`set_live_view`](./plugin-api-commands.md#set_live_view) needs both `ReadPaneContents` and `WriteToStdin`). Built-in plugins are granted every permission.

## Permissions
### ReadApplicationState
Access Zellij state (Panes, Tabs and UI)

### ChangeApplicationState
Change Zellij state (Panes, Tabs and UI)

### OpenFiles
Open files (eg. for editing)

### RunCommands
Run commands in panes or silently

### OpenTerminalsOrPlugins
Start new terminals and plugins. Also required to ask the user something with [`prompt`](./plugin-api-commands.md#prompt).

### WriteToStdin
Write to STDIN as if it were the user, including to panes of other sessions with [`write_to_session_pane`](./plugin-api-commands.md#write_to_session_pane) and [`send_key_to_session_pane`](./plugin-api-commands.md#send_key_to_session_pane).

### WebAccess
Make HTTP requests with [`web_request`](./plugin-api-commands.md#web_request).

### ReadCliPipes
Control CLI pipes: block and unblock their input, write to their output and set the exit code of the `zellij pipe` command (see [pipes](./plugin-pipes.md)).

### MessageAndLaunchOtherPlugins
Send messages to other plugins, launching them if they are not running (see [`pipe_message_to_plugin`](./plugin-api-commands.md#pipe_message_to_plugin)).

### Reconfigure
Change the [configuration](./configuration.md) (running and also saved in the configuration file) of Zellij. This includes the commands under [editing the configuration](./plugin-api-commands.md#editing-the-configuration), such as [`read_config`](./plugin-api-commands.md#read_config) and [`save_config`](./plugin-api-commands.md#save_config), and the `ConfigChangesDropped` and `ConfigFileChangedSinceRead` events.

### FullHdAccess
Access the full HD on the machine rather than just the folder in which Zellij was started.

### StartWebServer
Control (start, stop, get status, manage login tokens) the Zellij [web-server](./web-client.md)

### InterceptInput
Intercept user input (eg. keypresses), having all of this input sent to the plugin instead.

### ReadPaneContents
Read the contents of panes and the commands run in them. Required for:

- subscribing to the `PaneRenderReport`, `SessionPreview` and `LiveViewStateChanged` events
- reading pane scrollback with [`get_pane_scrollback`](./plugin-api-commands.md#get_pane_scrollback)
- showing a live view of another pane with [`set_live_view`](./plugin-api-commands.md#set_live_view) and [`set_live_view_input`](./plugin-api-commands.md#set_live_view_input) (together with `WriteToStdin`)

Plugins without this permission still receive pane and attention information, but without the text of the commands run in the panes: the command text is left out of the `attention` and `command_state` fields of [`PaneInfo`](./plugin-api-types.md#paneinfo) (in `PaneUpdate` and `SessionUpdate`), and out of the `PaneAttentionChanged`, `CommandStarted`, `CommandFinished` and `GlobalAttentionUpdate` events. Pane contents are also left out of `SavedSessionPreview`.

### RunActionsAsUser
Execute Zellij actions as if they were performed by the user. Required for the `run_action` and `run_context_menu_item` plugin API commands.

### WriteToClipboard
Write text directly to the user's clipboard.

### ReadSessionEnvironmentVariables
Read environment variables from the session context.

## Commands only built-in plugins may use
Some commands are refused to plugins that are not built in, whatever permissions they were granted:

- [`reply_to_prompt`](./plugin-api-commands.md#reply_to_prompt) only works for the built-in `zellij:prompt` plugin.
- [`request_desktop_integration`](./plugin-api-commands.md#request_desktop_integration) always answers other plugins with an error.
