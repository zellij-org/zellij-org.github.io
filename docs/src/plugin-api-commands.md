# Plugin API - Commands
Zellij exports functions that allow plugins to control Zellij or change its behavior.

For more exact information, please see the [`zellij-tile`](https://docs.rs/zellij-tile/latest/zellij_tile/) API documentation.

## subscribe
This method is given a list of [events](./plugin-api-events.md) that the plugin is interested in. The plugin's [update](./plugin-lifecycle.md#update) method will be called with the events and its payload, if any.

## unsubscribe
Same as subscribe, only removes subscriptions to events.

## request_permission
This command should be run in the `load` method of the plugin lifecycle, and contain one or more `PermissionType`s. This will ask the user to provide the plugin said permissions.

## set_selectable
Sets the plugin as selectable or unselectable to the user. Unselectable plugins might be desired when they do not accept user input.

## get_plugin_ids
Returns the unique Zellij pane ID for the plugin as well as the Zellij process id.

## get_zellij_version
Returns the version of the running Zellij instance - can be useful to check plugin compatibility

## open_file
* Requires the `OpenFiles` [permission](./plugin-api-permissions.md)

Open a file in the user's default `$EDITOR` in a new pane

## open_file_floating
* Requires the `OpenFiles` [permission](./plugin-api-permissions.md)

Open a file in the user's default `$EDITOR` in a new floating pane

## open_file_in_place
* Requires the `OpenFiles` [permission](./plugin-api-permissions.md)

Open a file in the user's default `$EDITOR`, temporarily replacing the focused pane

## open_file_with_line
* Requires the `OpenFiles` [permission](./plugin-api-permissions.md)

Open a file to a specific line in the user's default `$EDITOR` (if it supports it, most do) in a new pane

## open_file_with_line_floating
* Requires the `OpenFiles` [permission](./plugin-api-permissions.md)

Open a file to a specific line in the user's default `$EDITOR` (if it supports it, most do) in a new floating pane

## open_terminal
* Requires the `OpenTerminalsOrPlugins` [permission](./plugin-api-permissions.md)

Open a new terminal pane to the specified location on the host filesystem

## open_terminal_floating
* Requires the `OpenTerminalsOrPlugins` [permission](./plugin-api-permissions.md)

Open a new floating terminal pane to the specified location on the host filesystem

## open_terminal_in_place
* Requires the `OpenTerminalsOrPlugins` [permission](./plugin-api-permissions.md)

Open a new terminal pane to the specified location on the host filesystem, temporarily replacing the focused pane

## open_command_pane
* Requires the `RunCommands` [permission](./plugin-api-permissions.md)
Open a new command pane with the specified command and args (this sort of pane allows the user to control the command, re-run it and see its exit status through the Zellij UI).

## open_command_pane_floating
* Requires the `RunCommands` [permission](./plugin-api-permissions.md)

Open a new floating command pane with the specified command and args (this sort of pane allows the user to control the command, re-run it and see its exit status through the Zellij UI).

## open_command_pane_in_place
* Requires the `RunCommands` [permission](./plugin-api-permissions.md)

Open a new command pane with the specified command and args (this sort of pane allows the user to control the command, re-run it and see its exit status through the Zellij UI), temporarily replacing the focused pane

## run_command
* Requires the `RunCommands` [permission](./plugin-api-permissions.md)
Run this host command in the background on the host machine, optionally being notified of its output if subscribed to the [`RunCommandResult`](./plugin-api-events.md) Event. This API method includes a dictionary of arbitrary strings that will be returned verbatim with the `RunCommandResult` event. It can be used for things such as "request_id" to be able to identify the output of a command, or whatever else is needed.

## web_request
* Requires the `WebAccess` [permission](./plugin-api-permissions.md)
Make a web request, optionally being notified of its output if subscribed to the [`WebRequestResult`](./plugin-api-events.md) Event. This API method includes a dictionary of arbitrary strings that will be returned verbatim with the `WebRequestResult` event. It can be used for things such as "request_id" to be able to identify the output of a command, or whatever else is needed.

## switch_tab_to
Change the focused tab to the specified index (corresponding with the default tab names, to starting at `1`, `0` will be considered as `1`).

## set_timeout
Set a timeout in seconds (or fractions thereof) after which the plugins [update](./plugin-lifecycle.md#update) method will be called with the [`Timer`](./plugin-api-events.md#timer) event. Be sure to subscribe to it beforehand!

## hide_self
Hide the plugin pane (suppress it) from the UI

## show_self
Show the plugin pane (unsuppress it if it is suppressed), focus it and switch to its tab

## switch_to_input_mode
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Switch to the specified Input Mode (eg. `Normal`, `Tab`, `Pane`)

## new_tabs_with_layout
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Provide a stringified [`layout`](./layouts.md) to be applied to the current session. If the layout has multiple tabs, they will all be opened.

## new_tab
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Open a new tab with the default layout

## go_to_next_tab
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Change focus to the next tab or loop back to the first

## go_to_previous_tab
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Change focus to the previous tab or loop back to the last

## resize_focused_pane
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Either Increase or Decrease the size of the focused pane

## resize_focused_pane_with_direction
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Either Increase or Decrease the size of the focused pane in a specified direction (eg. `Left`, `Right`, `Up`, `Down`).

## focus_next_pane
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Change focus tot he next pane in chronological order

## focus_previous_pane
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Change focus to the previous pane in chronological order

## move_focus
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Change the focused pane in the specified direction

## move_focus_or_tab
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Change the focused pane in the specified direction, if the pane is on the edge of the screen, the next tab is focused (next if right edge, previous if left edge).

## detach
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Detach the user from the active session

## edit_scrollback
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Edit the scrollback of the focused pane in the user's default `$EDITOR`

## write
* Requires the `WriteToStdin` [permission](./plugin-api-permissions.md)

Write bytes to the `STDIN` of the focused pane

## write_chars
* Requires the `WriteToStdin` [permission](./plugin-api-permissions.md)

Write characters to the `STDIN` of the focused pane

## toggle_tab
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Focused the previously focused tab (regardless of the tab position)

## move_pane
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Switch the position of the focused pane with a different pane

## move_pane_with_direction
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Switch the position of the focused pane with a different pane in the specified direction (eg. `Down`, `Up`, `Left`, `Right`).

## clear_screen
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Clear the scroll buffer of the focused pane

## scroll_up
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Scroll the focused pane up 1 line

## scroll_down
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Scroll the focused pane down 1 line

## scroll_to_top
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Scroll the focused pane all the way to the top of the scrollbuffer

## scroll_to_bottom
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Scroll the focused pane all the way to the bottom of the scrollbuffer

## page_scroll_up
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Scroll the focused pane up one page

## page_scroll_down
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Scroll the focused pane down one page

## toggle_focus_fullscreen
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Toggle the focused pane to be fullscreen or normal sized

## toggle_pane_frames
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Toggle the UI pane frames on or off

## toggle_pane_embed_or_eject
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Embed the currently focused pane (make it stop floating) or turn it to a float pane if it is not

## close_focus
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Close the focused pane

## toggle_active_tab_sync
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Turn the `STDIN` synchronization of the current tab on or off

## close_focused_tab
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Close the focused tab

## quit_zellij
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Compeltely quit Zellij for this and all other connected clients

## previous_swap_layout
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Change to the previous [swap layout](./swap-layouts.md)

## next_swap_layout
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Change to the next [swap layout](./swap-layouts.md)

## go_to_tab_name
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Change focus to the tab with the specified name

## focus_or_create_tab
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Change focus to the tab with the specified name or create it if it does not exist

## post_message_to
Post a message to a worker of this plugin, for more information please see [Plugin Workers](./plugin-api-workers.md)

## post_message_to_plugin
Post a message to this plugin (usually used to communicate with the worker), for more information, please see [Plugin Workers](./plugin-api-workers.md)

## close_terminal_pane
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Closes a terminal pane with the specified id

## close_plugin_pane
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Closes a plugin pane with the specified id

## focus_terminal_pane
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Changes the focus to the terminal pane with the specified id, unsuppressing it if it was suppressed and switching to its tab and layer (eg. floating/tiled).

## focus_plugin_pane
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Changes the focus to the plugin pane with the specified id, unsuppressing it if it was suppressed and switching to its tab and layer (eg. floating/tiled).

## rename_terminal_pane
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Changes the name (the title that appears in the UI) of the terminal pane with the specified id.

## rename_plugin_pane
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Changes the name (the title that appears in the UI) of the plugin pane with the specified id.

## rename_tab
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Changes the name (the title that appears in the UI) of the tab with the specified position.

## switch_session
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Change the session to the specified one, creating it if it does not exist

## switch_session_with_focus
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Change the session to the specified one (creating it if it does not exist), if it does exist - focusing on a tab or a pane inside that session

## switch_session_with_layout
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Change the session to the specified one, creating it if it does not exist, using a specified layout and optionally also a cwd (working directory).

## block_cli_pipe_input
* Requires the `ReadCliPipes` [permission](./plugin-api-permissions.md)

Block the input side of a pipe, will only be released once this or another plugin unblocks it

(By default, pipes are unblocked after a plugin has handled a message unless this method is explicitly called).

## unblock_cli_pipe_input
* Requires the `ReadCliPipes` [permission](./plugin-api-permissions.md)

Unblock the input side of a pipe, requesting the next message be sent if there is one

## cli_pipe_output
* Requires the `ReadCliPipes` [permission](./plugin-api-permissions.md)

Send output to the output side of a pipe, ths does not affect the input side of same pipe

## pipe_message_to_plugin
* Requires the `MessageAndLaunchOtherPlugins` [permission](./plugin-api-permissions.md)

Send a message to a plugin, it will be launched if it is not already running

## delete_dead_session
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Delete a dead session (one that is not running but can be resurrected) with a specific name

## delete_all_dead_sessions
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Delete all dead sessions (sessions that are not running but can be resurrected)

## rename_session
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Rename the current session to a specific name

## disconnect_other_clients
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Disconnect all other clients attached to this session except the one making this call

## kill_sessions
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Kill all Zellij sessions in the list (can contain one or more session names)

## scan_host_folder
This is a stop-gap method that allows plugins to scan a folder on the `/host` [filesystem](./plugin-api-file-system.md) and get back a list of files. The reason this is done through the API is that at the time of development, doing this through our WASI runtime is extremely slow. We hope this method will not be needed in the future.

## dump_session_layout
* Requires the `ReadApplicationState` [permission](./plugin-api-permissions.md)

Request Zellij send back the serialized layout (in KDL format) of the current session. The layout will be sent back as a [`CustomMessage`](./plugin-api-events.md#custom-message) with the `session_layout` name and the stringified layout as the message payload.

## close_self
Will close the plugin and its pane. If the plugin is the only selectable pane in the session, the session will also exit.
