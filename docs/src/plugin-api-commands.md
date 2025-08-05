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

## open_file_near_plugin
* Requires the `OpenFiles` [permission](./plugin-api-permissions.md)

Open a file in the user's default `$EDITOR` in the same tab as the plugin as a tiled pane, regardless of the user's focus

## open_file_floating_near_plugin
* Requires the `OpenFiles` [permission](./plugin-api-permissions.md)

Open a file in the user's default `$EDITOR` in the same tab as the plugin as a floating pane, regardless of the user's focus

## open_file_in_place_of_plugin
* Requires the `OpenFiles` [permission](./plugin-api-permissions.md)

Open a file in the user's default `$EDITOR`, temporarily replacing the plugin, regardless of the user's focus.

## open_terminal
* Requires the `OpenTerminalsOrPlugins` [permission](./plugin-api-permissions.md)

Open a new terminal pane to the specified location on the host filesystem

## open_terminal_floating
* Requires the `OpenTerminalsOrPlugins` [permission](./plugin-api-permissions.md)

Open a new floating terminal pane to the specified location on the host filesystem

## open_terminal_in_place
* Requires the `OpenTerminalsOrPlugins` [permission](./plugin-api-permissions.md)

Open a new terminal pane to the specified location on the host filesystem, temporarily replacing the focused pane

## open_terminal_near_plugin
* Requires the `OpenTerminalsOrPlugins` [permission](./plugin-api-permissions.md)

Open a new tiled terminal in the tab where the plugin resides, regardless of the user's focus.

## open_terminal_floating_near_plugin
* Requires the `OpenTerminalsOrPlugins` [permission](./plugin-api-permissions.md)

Open a new floating terminal in the tab where the plugin resides, regardless of the user's focus.

## open_terminal_in_place_of_plugin
* Requires the `OpenTerminalsOrPlugins` [permission](./plugin-api-permissions.md)

Open a new terminal on top of the plugin, temporarily replacing it. Regardless of the user's focus.

## open_command_pane
* Requires the `RunCommands` [permission](./plugin-api-permissions.md)
Open a new command pane with the specified command and args (this sort of pane allows the user to control the command, re-run it and see its exit status through the Zellij UI).

## open_command_pane_floating
* Requires the `RunCommands` [permission](./plugin-api-permissions.md)

Open a new floating command pane with the specified command and args (this sort of pane allows the user to control the command, re-run it and see its exit status through the Zellij UI).

## open_command_pane_in_place
* Requires the `RunCommands` [permission](./plugin-api-permissions.md)

Open a new command pane with the specified command and args (this sort of pane allows the user to control the command, re-run it and see its exit status through the Zellij UI), temporarily replacing the focused pane

## open_command_pane_near_plugin
* Requires the `RunCommands` [permission](./plugin-api-permissions.md)

Open a new command pane with the specified command and args (this sort of pane allows the user to control the command, re-run it and see its exit status through the Zellij UI), as a tiled pane in the same tab as the plugin, regardless of the user's focus.

## open_command_pane_floating_near_plugin
* Requires the `RunCommands` [permission](./plugin-api-permissions.md)

Open a new command pane with the specified command and args (this sort of pane allows the user to control the command, re-run it and see its exit status through the Zellij UI), as a floating pane in the same tab as the plugin, regardless of the user's focus.

## open_command_pane_in_place_of_plugin
* Requires the `RunCommands` [permission](./plugin-api-permissions.md)

Open a new command pane with the specified command and args (this sort of pane allows the user to control the command, re-run it and see its exit status through the Zellij UI), on top of the plugin, temporarily replacing it, regardless of the user's focus.

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

## new_tabs_with_layout_info
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Provide a [`layout`](./layouts.md) name or file path to be applied to the current session. If the layout has multiple tabs, they will all be opened.

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

## reconfigure
* Requires the `Reconfigure` [permission](./plugin-api-permissions.md)

Provide a stringified [configuration](./configuration.md) to be "merged" with the configuration of the current session. Optionally also written to disk and so applied to all other sessions listening to the same configuration file.

### Use this command to bind global keys to the plugin
It's possible to use the `reconfigure` command to bind the special `MessagePluginId` temporary keybinding (which will not be saved to disk). This keybind, along with the plugin's id obtained from `get_plugin_ids` can be used to bind a user key to trigger this plugin with a [pipe](./plugin-pipes.md).

Example:
```rust
let config = format!(r#"
keybinds {{
    shared {{
        bind "Ctrl Shift r" {{
            MessagePluginId {} {{
                name "my_message_name"
            }}
        }}
    }}
}}"#);
reconfigure(config, false)
// now, whenever a user pressed `Ctrt Shift r` anywhere in the app, the plugin's pipe method will trigger with the "my_message_name" message
```

## hide_pane_with_id
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Hide a pane (suppress id) with the specified id.

## show_pane_with_id
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Show a pane with the specified id, unsuppress it if it is suppressed, focus it and switch to its tab.

## open_command_pane_background
* Requires the `RunCommands` [permission](./plugin-api-permissions.md)

Open a new hidden (background) command pane with the specified command and args (this sort of pane allows the user to control the command, re-run it and see its exit status through the Zellij UI).

## rerun_command_pane
* Requires the `RunCommands` [permission](./plugin-api-permissions.md)

Re-run command in a command pane (similar to a user focusing on it and pressing `<ENTER>`).

## resize_pane_with_id
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Change the size of the specified pane (optionally in a specific direction).

## edit_scrollback_for_pane_with_id
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Edit the scrollback of the specified pane in the user's default `$EDITOR`

## write_to_pane_id
* Requires the `WriteToStdin` [permission](./plugin-api-permissions.md)

Write bytes to the `STDIN` of the specified pane

## write_chars_to_pane_id
* Requires the `WriteToStdin` [permission](./plugin-api-permissions.md)

Write characters to the `STDIN` of the specified pane

## move_pane_with_pane_id
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Switch the position of the specified pane with a different pane

## move_pane_with_pane_id_in_direction
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Switch the position of the specified pane with a different pane in the specified direction (eg. `Down`, `Up`, `Left`, `Right`).

## clear_screen_for_pane_id
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Clear the scroll buffer of the specified pane

## scroll_up_in_pane_id
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Scroll the specified pane up 1 line

## scroll_down_in_pane_id
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Scroll the specified pane down 1 line

## scroll_to_top_in_pane_id
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Scroll the specified pane all the way to the top of the scrollbuffer

## scroll_to_bottom
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Scroll the specified pane all the way to the bottom of the scrollbuffer

## page_scroll_up_in_pane_id
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Scroll the specified pane up one page

## page_scroll_down_in_pane_id
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Scroll the specified pane down one page

## toggle_pane_id_fullscreen
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Toggle the specified pane to be fullscreen or normal sized

## toggle_pane_embed_or_eject_for_pane_id
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Embed the specified pane (make it stop floating) or turn it to a float pane if it is not

## close_tab_with_index
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Close the focused tab

## break_panes_to_new_tab
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Create a new tab that includes the specified pane ids

## break_panes_to_tab_with_index
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Move the specified pane ids to the tab with the specified index

## reload_plugin
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Reload the plugin with the specified id

## load_new_plugin
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Load a new plugin

## rebind_keys
* Requires the `Reconfigure` [permission](./plugin-api-permissions.md)

Given a set of keys to unbind and a set of keys to bind (in that order), this will apply them to the current session - or optionally also save them to the configuration file.

## list_clients
* Requires the `ReadApplicationState` [permission](./plugin-api-permissions.md)

List information about clients connected to this session. Including their ID, their focused pane id, the command or plugin running in that pane id (if any) and whether they are the current plugin. This will be returned as the `ListClients` [Event](./plugin-api-events.md) that must be subscribed to beforehand.

## change_host_folder
* Requires the `FullHdAccess` [permission](./plugin-api-permissions.md)

Change the location of the `/host` folder from the perspective of the plugin to somewhere else on the filesystem.

## set_floating_pane_pinned
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Make a floating pane pinned or unpinned (always on top).

## stack_panes
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Given a list of pane ids, turns them into a stack.

## change_floating_panes_coordinates
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Given a list of pane ids and corresponding coordinates (x, y, width, height) will change the location of all of these IDs to the desired coordinates.

## group_and_ungroup_panes
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Accepts two lists of panes, first one to group, second one to ungroup (in this logical order). Grouping is performed for the benefit of the "multiple-select" functionality.

## highlight_and_unhighlight_panes
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Accepts two lists of panes, first one to group, second one to ungroup (in this logical order). The highlight is cosmetic and is meant to help mark panes.

## close_multiple_panes
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Accepts a list of pane ids to close.

## float_multiple_panes
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Accepts a list of pane ids to make floating (ignores panes that are already floating).

## embed_multiple_panes
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Accepts a list of pane ids to embed (not floating). Ignores panes that are already floating.

## start_web_server
* Requires the `StartWebServer` [permission](./plugin-api-permissions.md)

Start the Zellij [web-server](./web-client.md).

## stop_web_server
* Requires the `StartWebServer` [permission](./plugin-api-permissions.md)

Stop the Zellij [web-server](./web-client.md).

## share_current_session
* Requires the `StartWebServer` [permission](./plugin-api-permissions.md)

Allows the current session to be shared (attached to) on the Zellij [web-server](./web-client.md).

## stop_sharing_current_session
* Requires the `StartWebServer` [permission](./plugin-api-permissions.md)

Removes permission for the current session to be shared (attached to) on the Zellij [web-server](./web-client.md), also disconnects current web clients.

## query_web_server_status
* Requires the `StartWebServer` [permission](./plugin-api-permissions.md)

Queries the status of the Zellij [web-server](./web-client.md), response will be returned as the `WebServerStatus` [event](./plugin-api-events.md) (which must also be subscribed to).

## generate_web_login_token
* Requires the `StartWebServer` [permission](./plugin-api-permissions.md)

Generates (and returns) a new web login token, optionally with a provided name as a String. (This token is hashed in a local DB, so can never be displayed again).

## revoke_web_login_token
* Requires the `StartWebServer` [permission](./plugin-api-permissions.md)

Revoked an existing web login token by its name.

## revoke_all_web_login_tokens
* Requires the `StartWebServer` [permission](./plugin-api-permissions.md)

Revokes all web login tokens.

## list_web_login_tokens
* Requires the `StartWebServer` [permission](./plugin-api-permissions.md)

Returns a list of existing web login tokens (their names, the tokens themselves cannot be displayed) and their creation times.

## rename_web_login_token
* Requires the `StartWebServer` [permission](./plugin-api-permissions.md)

Rename a web login token by providing its existing name.

## intercept_key_presses
* Requires the `InterceptInput` [permission](./plugin-api-permissions.md)

Intercept all user input, having it sent to the plugin as an `InterceptedKeyPress` [event](./plugin-api-events.md)

## clear_key_presses_intercepts
* Requires the `InterceptInput` [permission](./plugin-api-permissions.md)

Clear the interception of key presses, having them return to being sent to the application itself. This happens automatically when the plugin is unloaded.

## replace_pane_with_existing_pane
* Requires the `ChangeApplicationState` [permission](./plugin-api-permissions.md)

Replaces a specific pane (denoted by is PaneId) with another existing pane (also denoted by its PaneId)
