# Plugin API - Commands
Zellij exports functions that allow plugins to control Zellij or change its behavior.

For more exact information, please see the `zellij-tile` API documentation.

## subscribe
This method is given a list of [events](./plugin-api-events.md) that the plugin is interested in. The plugin's [update](./plugin-api-lifecycle.md) method will be called with the events and its payload, if any.

## unsubscribe
Same as [subscribe](./#subscribe), only removes subscriptions to events.

## set_selectable
Sets the plugin as selectable or unselectable to the user. Unselectable plugins might be desired when they do not accept user input.

## get_plugin_ids
Returns the unique Zellij pane ID for the plugin as well as the Zellij process id.

## get_zellij_version
Returns the version of the running Zellij instance - can be useful to check plugin compatibility

## open_file
Open a file in the user's default `$EDITOR` in a new pane

## open_file_floating
Open a file in the user's default `$EDITOR` in a new floating pane

## open_file_with_line
Open a file to a specific line in the user's default `$EDITOR` (if it supports it, most do) in a new pane

## open_file_with_line_floating
Open a file to a specific line in the user's default `$EDITOR` (if it supports it, most do) in a new floating pane

## open_terminal
Open a new terminal pane to the specified location on the host filesystem

## open_terminal_floating
Open a new floating terminal pane to the specified location on the host filesystem

## open_command_pane
Open a new command pane with the specified command and args (this sort of pane allows the user to control the command, re-run it and see its exit status through the Zellij UI).

## open_command_pane_floating
Open a new floating command pane with the specified command and args (this sort of pane allows the user to control the command, re-run it and see its exit status through the Zellij UI).

## switch_tab_to
Change the focused tab to the specified index (corresponding with the default tab names, to starting at `1`, `0` will be considered as `1`).

## set_timeout
Set a timeout in seconds (or fractions thereof) after which the plugins [update](./plugin-api-events#update) method will be called with the [`Timer`](./plugin-api-events.md#timer) event.

## hide_self
Hide the plugin pane from the UI

## switch_to_input_mode
Switch to the specified Input Mode (eg. `Normal`, `Tab`, `Pane`)

## new_tabs_with_layout
Provide a stringified [`layout`](./layouts.md) to be applied to the current session. If the layout has multiple tabs, they will all be opened.

## new_tab
Open a new tab with the default layout

## go_to_next_tab
Change focus to the next tab or loop back to the first

## go_to_previous_tab
Change focus to the previous tab or loop back to the last

## resize_focused_pane
Either Increase or Decrease the size of the focused pane

## resize_focused_pane_with_direction
Either Increase or Decrease the size of the focused pane in a specified direction (eg. `Left`, `Right`, `Up`, `Down`).

## focus_next_pane
Change focus tot he next pane in chronological order

## focus_previous_pane
Change focus to the previous pane in chronological order

## move_focus
Change the focused pane in the specified direction

## move_focus_or_tab
Change the focused pane in the specified direction, if the pane is on the edge of the screen, the next tab is focused (next if right edge, previous if left edge).

## detach
Detach the user from the active session

## edit_scrollback
Edit the scrollback of the focused pane in the user's default `$EDITOR`

## write
Write bytes to the `STDIN` of the focused pane

## write_chars
Write characters to the `STDIN` of the focused pane

## toggle_tab
Focused the previously focused tab (regardless of the tab position)

## move_pane
Switch the position of the focused pane with a different pane

## move_pane_with_direction
Switch the position of the focused pane with a different pane in the specified direction (eg. `Down`, `Up`, `Left`, `Right`).

## clear_screen
Clear the scroll buffer of the focused pane

## scroll_up
Scroll the focused pane up 1 line

## scroll_down
Scroll the focused pane down 1 line

## scroll_to_top
Scroll the focused pane all the way to the top of the scrollbuffer

## scroll_to_bottom
Scroll the focused pane all the way to the bottom of the scrollbuffer

## page_scroll_up
Scroll the focused pane up one page

## page_scroll_down
Scroll the focused pane down one page

## toggle_focus_fullscreen
Toggle the focused pane to be fullscreen or normal sized

## toggle_pane_frames
Toggle the UI pane frames on or off

## toggle_pane_embed_or_eject
Embed the currently focused pane (make it stop floating) or turn it to a float pane if it is not

## close_focus
Close the focused pane

## toggle_active_tab_sync
Turn the `STDIN` synchronization of the current tab on or off

## close_focused_tab
Close the focused tab

## quit_zellij
Compeltely quit Zellij for this and all other connected clients

## previous_swap_layout
Change to the previous [swap layout](./swap-layouts.md)

## next_swap_layout
Change to the next [swap layout](./swap-layouts.md)

## go_to_tab_name
Change focus to the tab with the specified name

## focus_or_create_tab
Change focus to the tab with the specified name or create it if it does not exist

## post_message_to
Post a message to a worker of this plugin, for more information please see [Plugin Workers](./plugin-api-workers.md)

## post_message_to_plugin
Post a message to this plugin (usually used to communicate with the worker), for more information, please see [Plugin Workers](./plugin-api-workers.md)
