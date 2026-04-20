## CLI Actions

*A note about pane ids:* Since terminal panes and plugin panes can have overlapping IDs, they are differentiated by prefixing the pane type, eg. `terminal_1` is a different pane than `plugin_1`. The ID of terminal panes is the same one that can be discovered through the `ZELLIJ_PANE_ID` environment variable. When a `--pane-id` flag accepts a pane id, it can be specified as `terminal_1`, `plugin_2`, or just `3` (equivalent to `terminal_3`).

---

- [are-floating-panes-visible](#are-floating-panes-visible)
- [change-floating-pane-coordinates](#change-floating-pane-coordinates)
- [clear](#clear)
- [close-pane](#close-pane)
- [close-tab](#close-tab)
- [close-tab-by-id](#close-tab-by-id)
- [current-tab-info](#current-tab-info)
- [detach](#detach)
- [dump-layout](#dump-layout)
- [dump-screen](#dump-screen)
- [edit](#edit)
- [edit-scrollback](#edit-scrollback)
- [focus-next-pane](#focus-next-pane)
- [focus-pane-id](#focus-pane-id)
- [focus-previous-pane](#focus-previous-pane)
- [go-to-next-tab](#go-to-next-tab)
- [go-to-previous-tab](#go-to-previous-tab)
- [go-to-tab](#go-to-tab)
- [go-to-tab-by-id](#go-to-tab-by-id)
- [go-to-tab-name](#go-to-tab-name)
- [half-page-scroll-down](#half-page-scroll-down)
- [half-page-scroll-up](#half-page-scroll-up)
- [hide-floating-panes](#hide-floating-panes)
- [launch-or-focus-plugin](#launch-or-focus-plugin)
- [launch-plugin](#launch-plugin)
- [list-clients](#list-clients)
- [list-panes](#list-panes)
- [list-tabs](#list-tabs)
- [move-focus](#move-focus)
- [move-focus-or-tab](#move-focus-or-tab)
- [move-pane](#move-pane)
- [move-pane-backwards](#move-pane-backwards)
- [move-tab](#move-tab)
- [new-pane](#new-pane)
- [new-tab](#new-tab)
- [next-swap-layout](#next-swap-layout)
- [override-layout](#override-layout)
- [page-scroll-down](#page-scroll-down)
- [page-scroll-up](#page-scroll-up)
- [paste](#paste)
- [pipe](#pipe)
- [previous-swap-layout](#previous-swap-layout)
- [query-tab-names](#query-tab-names)
- [rename-pane](#rename-pane)
- [rename-session](#rename-session)
- [rename-tab](#rename-tab)
- [rename-tab-by-id](#rename-tab-by-id)
- [resize](#resize)
- [save-session](#save-session)
- [scroll-down](#scroll-down)
- [scroll-to-bottom](#scroll-to-bottom)
- [scroll-to-top](#scroll-to-top)
- [scroll-up](#scroll-up)
- [send-keys](#send-keys)
- [set-pane-borderless](#set-pane-borderless)
- [set-pane-color](#set-pane-color)
- [show-floating-panes](#show-floating-panes)
- [start-or-reload-plugin](#start-or-reload-plugin)
- [stack-panes](#stack-panes)
- [switch-mode](#switch-mode)
- [switch-session](#switch-session)
- [toggle-active-sync-tab](#toggle-active-sync-tab)
- [toggle-floating-panes](#toggle-floating-panes)
- [toggle-fullscreen](#toggle-fullscreen)
- [toggle-pane-borderless](#toggle-pane-borderless)
- [toggle-pane-embed-or-floating](#toggle-pane-embed-or-floating)
- [toggle-pane-frames](#toggle-pane-frames)
- [toggle-pane-pinned](#toggle-pane-pinned)
- [undo-rename-pane](#undo-rename-pane)
- [undo-rename-tab](#undo-rename-tab)
- [write](#write)
- [write-chars](#write-chars)

---

#### are-floating-panes-visible
Check if floating panes are visible in the specified tab (or active tab). Prints "true" to stdout and exits 0 if visible. Prints "false" to stdout and exits 1 if not visible.

**OPTIONS**:
```
    -t, --tab-id <TAB_ID>    Target a specific tab by ID
```

eg.
```
$ zellij action are-floating-panes-visible
$ zellij action are-floating-panes-visible --tab-id 3
```

#### change-floating-pane-coordinates
Given a pane id, and coordinates, will change the coordinates of this pane.

**ARGS**: The pane id (see example below - these can be discovered through the `$ZELLIJ_PANE_ID` env var)
**OPTIONS:**

```
    -b, --borderless <BORDERLESS>  Change the border state of the pane
        --height <HEIGHT>          The height if the pane is floating as a bare integer (eg. 1) or
                                   percent (eg. 10%)
    -p, --pane-id <PANE_ID>        The pane_id of the floating pane, eg.  terminal_1, plugin_2 or 3
                                   (equivalent to terminal_3)
        --pinned <PINNED>          Whether to pin a floating pane so that it is always on top
        --width <WIDTH>            The width if the pane is floating as a bare integer (eg. 1) or
                                   percent (eg. 10%)
    -x, --x <X>                    The x coordinates if the pane is floating as a bare integer (eg. 1)
                                   or percent (eg. 10%)
    -y, --y <Y>                    The y coordinates if the pane is floating as a bare integer (eg. 1)
                                   or percent (eg. 10%)
```

eg.
```
zellij action change-floating-pane-coordinates --pane-id terminal_15 --height 10 --width 10 -x 10 -y 10
```

#### clear
Clear all buffers for a focused pane

**OPTIONS**:
```
    -p, --pane-id <PANE_ID>    Target a specific pane by ID (eg. terminal_1, plugin_2 or 3)
```

eg.
```
$ zellij action clear
$ zellij action clear --pane-id terminal_3
```

#### close-pane

Close the focused pane

**OPTIONS**:
```
    -p, --pane-id <PANE_ID>    Target a specific pane by ID (eg. terminal_1, plugin_2 or 3)
```

eg.
```
$ zellij action close-pane
$ zellij action close-pane --pane-id terminal_3
```

#### close-tab
Close the current tab

**OPTIONS**:
```
    -t, --tab-id <TAB_ID>    Target a specific tab by stable ID
```

eg.
```
$ zellij action close-tab
$ zellij action close-tab --tab-id 5
```

#### close-tab-by-id
Close a tab by its stable ID

**ARGS**: The tab ID (integer)

eg.
```
$ zellij action close-tab-by-id 5
```

#### current-tab-info
Get information about the currently active tab. Returns the tab name and ID by default.

**OPTIONS**:
```
    -j, --json    Output as JSON with full TabInfo
```

eg.
```
$ zellij action current-tab-info
```

**Sample output:**
```
name: Tab #1
id: 0
position: 0
```

With `--json`:
```
$ zellij action current-tab-info --json
```

**Sample output:**
```json
{
  "position": 0,
  "name": "Tab #1",
  "active": true,
  "panes_to_hide": 0,
  "is_fullscreen_active": false,
  "is_sync_panes_active": false,
  "are_floating_panes_visible": false,
  "other_focused_clients": [],
  "active_swap_layout_name": "default",
  "is_swap_layout_dirty": false,
  "viewport_rows": 24,
  "viewport_columns": 80,
  "display_area_rows": 26,
  "display_area_columns": 80,
  "selectable_tiled_panes_count": 2,
  "selectable_floating_panes_count": 0,
  "tab_id": 0,
  "has_bell_notification": false,
  "is_flashing_bell": false
}
```

#### detach
Detach from the current session, leaving it running in the background

eg.
```
$ zellij action detach
```

#### dump-layout
Dumps the current [Layout](./creating-a-layout.md) of the session to STDOUT

eg.
```
$ zellij action dump-layout
```

#### dump-screen
Dumps the viewport of a pane to a file or to STDOUT. Optionally includes the full scrollback.

**OPTIONS**:
```
        --path <PATH>          File path to dump content to (if omitted, prints to STDOUT)
    -f, --full                 Dump the pane with full scrollback
    -p, --pane-id <PANE_ID>    Target a specific pane by ID (if not specified, dumps the focused pane)
    -a, --ansi                 Preserve ANSI styling in the dump output
```

eg.
```
$ zellij action dump-screen --path /tmp/screen-dump.txt
$ zellij action dump-screen --full --ansi
$ zellij action dump-screen --pane-id terminal_3 --full
```

#### edit
Open the specified file in a new zellij pane with your default EDITOR. Returns the created pane ID.

**ARGS**: The path to the file to open (eg. `/tmp/my-file.rs`)

**OPTIONS**:
```
    -d, --direction <DIRECTION>    Direction to open [right|down] (conflicts with --floating)
    -f, --floating                 Open in floating mode
    -i, --in-place                 Open in place of the focused pane
        --close-replaced-pane      Close the replaced pane instead of suspending (requires --in-place)
    -l, --line-number <LINE_NUMBER>
        --cwd <CWD>               Working directory for the editor pane
    -x, --x <X>                    X coordinate for floating pane (requires --floating)
    -y, --y <Y>                    Y coordinate for floating pane (requires --floating)
        --width <WIDTH>            Width for floating pane (requires --floating)
        --height <HEIGHT>          Height for floating pane (requires --floating)
        --pinned <PINNED>          Pin the floating pane (requires --floating)
        --near-current-pane        Open near the current pane rather than following focus
        --tab-id <TAB_ID>         Target a specific tab by ID (conflicts with --in-place, --near-current-pane)
    -b, --borderless <BORDERLESS>  Start without a border
```

eg.
```
$ zellij action edit ./my-file.rs -f
$ zellij action edit ./my-file.rs --in-place
```

**Note:** This can also be shortened to [`zellij edit`](zellij-edit.md)

eg.
```
$ zellij edit ./my-file.rs -f
```

#### edit-scrollback
Open the pane scrollback in your default editor

**OPTIONS**:
```
    -p, --pane-id <PANE_ID>    Target a specific pane by ID
    -a, --ansi                 Preserve ANSI styling in the scrollback dump
```

eg.
```
$ zellij action edit-scrollback
$ zellij action edit-scrollback --pane-id terminal_3 --ansi
```

#### focus-next-pane
Change focus to the next pane

eg.
```
$ zellij action focus-next-pane
```

#### focus-pane-id
Focus a specific pane by its ID.

**ARGS**: The pane ID (eg. `terminal_1`, `plugin_2`, or `3` which is equivalent to `terminal_3`)

eg.
```
$ zellij action focus-pane-id terminal_1
$ zellij action focus-pane-id 3
```

#### focus-previous-pane
Change focus to the previous pane

eg.
```
$ zellij action focus-previous-pane
```

#### go-to-next-tab
Go to the next tab

eg.
```
$ zellij action go-to-next-tab
```

#### go-to-previous-tab
Go to the previous tab

eg.
```
$ zellij action go-to-previous-tab
```

#### go-to-tab
Go to tab with index [index]

**ARGS**: The tab index (eg. 1)

eg.
```
$ zellij action go-to-tab 1
```

#### go-to-tab-by-id
Go to a tab by its stable ID

**ARGS**: The tab ID (integer)

eg.
```
$ zellij action go-to-tab-by-id 5
```

#### go-to-tab-name
Go to tab with name [name]. When `--create` is used and a tab is created, outputs the new tab ID.

**ARGS**: The tab name (eg. "Tab #1")

**OPTIONS**:
```
    -c, --create        Create a tab if one does not exist
```

eg.
```
$ zellij action go-to-tab-name "Tab #1"
```

#### half-page-scroll-down
Scroll down half page in focus pane

**OPTIONS**:
```
    -p, --pane-id <PANE_ID>    Target a specific pane by ID
```

eg.
```
$ zellij action half-page-scroll-down
```

#### half-page-scroll-up
Scroll up half page in focus pane

**OPTIONS**:
```
    -p, --pane-id <PANE_ID>    Target a specific pane by ID
```

eg.
```
$ zellij action half-page-scroll-up
```

#### hide-floating-panes
Hide all floating panes in the specified tab (or active tab). Returns exit code 0 if changed, 2 if already hidden, 1 if the tab was not found.

**OPTIONS**:
```
    -t, --tab-id <TAB_ID>    Target a specific tab by ID
```

eg.
```
$ zellij action hide-floating-panes
$ zellij action hide-floating-panes --tab-id 3
```

#### launch-or-focus-plugin
Launch a plugin if it is not loaded somewhere in the session, focus it if it is. Returns the plugin pane ID.

**ARGS**: The [plugin URL](./plugin-loading.md#plugin-url-schema) (eg. `file:/path/to/my/plugin.wasm`)

**OPTIONS**:
```
    -f, --floating                 Open in floating mode when launching
    -i, --in-place                 Open in place of the focused pane when launching
        --close-replaced-pane      Close the replaced pane (requires --in-place)
    -m, --move-to-focused-tab      Move the plugin to the focused tab if already running
    -c, --configuration <CONFIG>   Plugin configuration (key=value pairs)
    -s, --skip-plugin-cache        Skip the plugin cache and force reloading
        --tab-id <TAB_ID>          Target a specific tab by ID (conflicts with --in-place)
```

eg.
```
zellij action launch-or-focus-plugin zellij:strider --floating
zellij action launch-or-focus-plugin zellij:strider --in-place --move-to-focused-tab
```

#### launch-plugin
Launch a new plugin instance. Unlike `launch-or-focus-plugin`, this always launches a new instance. Returns the plugin pane ID.

**ARGS**: The [plugin URL](./plugin-loading.md#plugin-url-schema) (eg. `file:/path/to/my/plugin.wasm`)

**OPTIONS**:
```
    -f, --floating                 Open in floating mode
    -i, --in-place                 Open in place of the focused pane
        --close-replaced-pane      Close the replaced pane (requires --in-place)
    -c, --configuration <CONFIG>   Plugin configuration (key=value pairs)
    -s, --skip-plugin-cache        Skip the plugin cache and force reloading
        --tab-id <TAB_ID>          Target a specific tab by ID (conflicts with --in-place)
```

eg.
```
zellij action launch-plugin file:/path/to/plugin.wasm --floating
```

#### list-clients
List all clients connected to the current session, their focused pane id and their running program (if it's not the default shell and if Zellij can detect it).

eg.
```
$ zellij action list-clients

CLIENT_ID ZELLIJ_PANE_ID RUNNING_COMMAND
1         plugin_2       zellij:session-manager
2         terminal_3     vim /tmp/my-file.txt
```

#### list-panes
List all panes in the current session with optional detail fields.

**OPTIONS**:
```
    -t, --tab          Include tab information
    -c, --command      Include running command information
    -s, --state        Include pane state (focused, floating, exited, etc.)
    -g, --geometry     Include geometry (position, size)
    -a, --all          Include all available fields
    -j, --json         Output as JSON
```

eg.
```
$ zellij action list-panes
```

**Sample output (default):**
```
PANE_ID      TYPE      TITLE
terminal_1   terminal  /bin/bash
plugin_0     plugin    tab-bar
terminal_2   terminal  vim main.rs
```

With `--all`:
```
$ zellij action list-panes --all
```

**Sample output:**
```
TAB_ID  TAB_POS  TAB_NAME  PANE_ID      TYPE      TITLE          COMMAND        CWD                      FOCUSED  FLOATING  EXITED  X  Y   ROWS  COLS
0       0        Tab #1    terminal_1   terminal  /bin/bash      bash           /home/user/project       true     false     false   0  1   24    80
0       0        Tab #1    plugin_0     plugin    tab-bar        zellij:tab-bar -                        false    false     false   0  0   1     80
1       1        Tab #2    terminal_2   terminal  vim main.rs    vim main.rs    /home/user/project/src   true     false     false   0  1   24    80
```

With `--json`:
```
$ zellij action list-panes --json
```

**Sample output:**
```json
[
  {
    "id": 1,
    "is_plugin": false,
    "is_focused": true,
    "is_fullscreen": false,
    "is_floating": false,
    "is_suppressed": false,
    "title": "/bin/bash",
    "exited": false,
    "exit_status": null,
    "is_held": false,
    "pane_x": 0,
    "pane_content_x": 1,
    "pane_y": 1,
    "pane_content_y": 2,
    "pane_rows": 24,
    "pane_content_rows": 22,
    "pane_columns": 80,
    "pane_content_columns": 78,
    "cursor_coordinates_in_pane": [0, 5],
    "terminal_command": null,
    "plugin_url": null,
    "is_selectable": true,
    "tab_id": 0,
    "tab_position": 0,
    "tab_name": "Tab #1",
    "pane_command": "bash",
    "pane_cwd": "/home/user/project"
  },
  {
    "id": 0,
    "is_plugin": true,
    "is_focused": false,
    "is_fullscreen": false,
    "is_floating": false,
    "is_suppressed": false,
    "title": "tab-bar",
    "exited": false,
    "exit_status": null,
    "is_held": false,
    "pane_x": 0,
    "pane_content_x": 0,
    "pane_y": 0,
    "pane_content_y": 0,
    "pane_rows": 1,
    "pane_content_rows": 1,
    "pane_columns": 80,
    "pane_content_columns": 80,
    "cursor_coordinates_in_pane": null,
    "terminal_command": null,
    "plugin_url": "zellij:tab-bar",
    "is_selectable": false,
    "tab_id": 0,
    "tab_position": 0,
    "tab_name": "Tab #1"
  }
]
```

#### list-tabs
List all tabs with their information.

**OPTIONS**:
```
    -s, --state         Include state information (active, fullscreen, sync, floating visibility)
    -d, --dimensions    Include dimension information
    -p, --panes         Include pane counts
    -l, --layout        Include layout information (swap layout name and dirty state)
    -a, --all           Include all available fields
    -j, --json          Output as JSON
```

eg.
```
$ zellij action list-tabs
```

**Sample output (default):**
```
TAB_ID  POSITION  NAME
0       0         Tab #1
1       1         editor
2       2         logs
```

With `--all`:
```
$ zellij action list-tabs --all
```

**Sample output:**
```
TAB_ID  POSITION  NAME    ACTIVE  FULLSCREEN  SYNC_PANES  FLOATING_VIS  VP_ROWS  VP_COLS  DA_ROWS  DA_COLS  TILED_PANES  FLOAT_PANES  HIDDEN_PANES  SWAP_LAYOUT  LAYOUT_DIRTY
0       0         Tab #1  true    false       false       false         24       80       26       80       2            0            0             default      false
1       1         editor  false   false       false       false         24       80       26       80       1            0            0             -            false
2       2         logs    false   false       false       true          24       80       26       80       1            1            0             default      true
```

With `--json`:
```
$ zellij action list-tabs --json
```

**Sample output:**
```json
[
  {
    "position": 0,
    "name": "Tab #1",
    "active": true,
    "panes_to_hide": 0,
    "is_fullscreen_active": false,
    "is_sync_panes_active": false,
    "are_floating_panes_visible": false,
    "other_focused_clients": [],
    "active_swap_layout_name": "default",
    "is_swap_layout_dirty": false,
    "viewport_rows": 24,
    "viewport_columns": 80,
    "display_area_rows": 26,
    "display_area_columns": 80,
    "selectable_tiled_panes_count": 2,
    "selectable_floating_panes_count": 0,
    "tab_id": 0,
    "has_bell_notification": false,
    "is_flashing_bell": false
  },
  {
    "position": 1,
    "name": "editor",
    "active": false,
    "panes_to_hide": 0,
    "is_fullscreen_active": false,
    "is_sync_panes_active": false,
    "are_floating_panes_visible": false,
    "other_focused_clients": [],
    "active_swap_layout_name": null,
    "is_swap_layout_dirty": false,
    "viewport_rows": 24,
    "viewport_columns": 80,
    "display_area_rows": 26,
    "display_area_columns": 80,
    "selectable_tiled_panes_count": 1,
    "selectable_floating_panes_count": 0,
    "tab_id": 1,
    "has_bell_notification": false,
    "is_flashing_bell": false
  }
]
```

#### move-focus
Move the focused pane in the specified direction.

**ARGS**: The direction to move [right|left|up|down]

eg.
```
$ zellij action move-focus left
```

#### move-focus-or-tab
Move focus to the pane or tab (if on screen edge) in the specified direction

**ARGS**: The direction to move [right|left|up|down]

eg.
```
$ zellij action move-focus-or-tab left
```

#### move-pane
Change the location of the focused pane in the specified direction

**ARGS (optional)**: The direction to move [right|left|up|down]

**OPTIONS**:
```
    -p, --pane-id <PANE_ID>    Target a specific pane by ID
```

eg.
```
$ zellij action move-pane left
$ zellij action move-pane --pane-id terminal_3 right
```

#### move-pane-backwards
Rotate the location of the focused pane backwards in the layout order

**OPTIONS**:
```
    -p, --pane-id <PANE_ID>    Target a specific pane by ID
```

eg.
```
$ zellij action move-pane-backwards
```

#### move-tab
Move the focused tab in the specified direction.

**ARGS**: The direction to move [right|left]

**OPTIONS**:
```
    -t, --tab-id <TAB_ID>    Target a specific tab by ID
```

eg.
```
$ zellij action move-tab right
$ zellij action move-tab left --tab-id 3
```

#### new-pane
Open a new pane in the specified direction or as a floating pane. If no direction is specified, will try to use the biggest available space. Returns the created pane ID.

**ARGS (optional)**: the command to run inside the pane in place of the default shell (must be preceded by a double-dash `--`)
                                                                                                                                                
**OPTIONS**:
```
    -c, --close-on-exit                Close the pane immediately when its command exits
        --cwd <CWD>                    Change the working directory of the new pane
    -d, --direction <DIRECTION>        Direction to open the new pane in (conflicts with --floating)
    -f, --floating                     Open the new pane in floating mode
    -i, --in-place                     Open in place of the focused pane (conflicts with --floating/--direction)
        --close-replaced-pane          Close the replaced pane instead of suspending (requires --in-place)
    -n, --name <NAME>                  Name of the new pane
    -p, --plugin <PLUGIN>              Plugin URL to load (conflicts with command and --direction)
        --configuration <CONFIG>       Plugin configuration (requires --plugin)
        --skip-plugin-cache            Skip the plugin cache (requires --plugin)
    -s, --start-suspended              Start the command suspended
    -x, --x <X>                        X coordinate for floating pane (requires --floating)
    -y, --y <Y>                        Y coordinate for floating pane (requires --floating)
        --width <WIDTH>                Width for floating pane (requires --floating)
        --height <HEIGHT>              Height for floating pane (requires --floating)
        --pinned <PINNED>              Pin the floating pane (requires --floating)
        --stacked                      Open in stacked mode (conflicts with --floating/--direction)
        --tab-id <TAB_ID>             Target a specific tab by ID (conflicts with --in-place, --near-current-pane)
    -b, --blocking                     Block until the pane exits
        --block-until-exit-success     Block until the command exits with status 0
        --block-until-exit-failure     Block until the command exits with non-zero status
        --block-until-exit             Block until the command exits regardless of status
        --near-current-pane            Open near the current pane rather than following focus
        --borderless <BORDERLESS>      Start without a border
```

eg.
```
$ zellij action new-pane -f # open a new floating pane with the default shell
$ zellij action new-pane --name "follow this log!" -- tail -f /tmp/my-log-file
$ zellij action new-pane --stacked
$ zellij action new-pane --in-place -- htop
$ zellij action new-pane --plugin zellij:strider --floating
```

**Note:** This can also be shortened to [`zellij run`](zellij-run.md)

eg.
```
$ zellij run -- tail -f /tmp/my-log-file
```

#### new-tab
Create a new tab, optionally with a specified tab layout and name. Returns the created tab's ID.

Specifying a path to a layout file with `--layout` will start that tab with the specified layout.

If the `--cwd` flag is included with the `--layout` flag, all relative paths in that layout will start from this `cwd`. Replacing the global `cwd` in the layout if it exists.
See [layout CWD composition](./creating-a-layout.md#cwd-composition) for more info.

**ARGS (optional)**: A command to run in the initial pane (must be preceded by a double-dash `--`, conflicts with `--initial-plugin`)

**OPTIONS**:
```
    -c, --cwd <CWD>                    Working directory for the new tab
    -l, --layout <LAYOUT>              Layout to use
        --layout-dir <LAYOUT_DIR>      Default folder for layouts (requires --layout)
        --layout-string <LAYOUT_STRING>  Raw KDL layout string to use directly (conflicts with --layout)
    -n, --name <NAME>                  Name of the new tab
        --initial-plugin <PLUGIN>      Plugin to load in the initial pane (conflicts with command)
        --close-on-exit                Close the initial pane when its command exits (requires command)
        --start-suspended              Start the command suspended (requires command)
        --block-until-exit-success     Block until the command exits with status 0
        --block-until-exit-failure     Block until the command exits with non-zero status
        --block-until-exit             Block until the command exits regardless of status
```

eg.
```
$ zellij action new-tab --layout /path/to/layout.kdl --name "my tab"
$ zellij action new-tab -- htop
```

#### next-swap-layout
Switch to the next swap layout for the current tab

**OPTIONS**:
```
    -t, --tab-id <TAB_ID>    Target a specific tab by ID
```

eg.
```
$ zellij action next-swap-layout
```

#### override-layout
Override the layout of the active tab with the specified layout file.

**ARGS**: Path to the layout file

**OPTIONS**:
```
        --layout-dir <LAYOUT_DIR>              Default folder for layouts
        --layout-string <LAYOUT_STRING>        Raw KDL layout string to use directly (conflicts with layout path arg)
        --retain-existing-terminal-panes       Retain existing terminal panes that do not fit the new layout
        --retain-existing-plugin-panes         Retain existing plugin panes that do not fit the new layout
        --apply-only-to-active-tab             Only apply the layout to the active tab
```

eg.
```
$ zellij action override-layout /path/to/layout.kdl
$ zellij action override-layout /path/to/layout.kdl --retain-existing-terminal-panes --apply-only-to-active-tab
```

#### page-scroll-down
Scroll down one page in focus pane

**OPTIONS**:
```
    -p, --pane-id <PANE_ID>    Target a specific pane by ID
```

eg.
```
$ zellij action page-scroll-down
```

#### page-scroll-up
Scroll up one page in focus pane

**OPTIONS**:
```
    -p, --pane-id <PANE_ID>    Target a specific pane by ID
```

eg.
```
$ zellij action page-scroll-up
```

#### paste
Paste text to the terminal using bracketed paste mode

**ARGS**: The text to paste

**OPTIONS**:
```
    -p, --pane-id <PANE_ID>    Target a specific pane by ID
```

eg.
```
$ zellij action paste "Hello, World!"
```

#### pipe
Send data to one or more plugins via a pipe. Plugins will be launched if they are not already running.

**ARGS (optional)**: Payload data to send. If blank, listens on STDIN.

**OPTIONS**:
```
    -n, --name <NAME>                        Name of the pipe
    -a, --args <ARGS>                        Arguments for the pipe (key=value pairs)
    -p, --plugin <PLUGIN>                    Plugin URL to direct the pipe to
    -c, --plugin-configuration <CONFIG>      Plugin configuration (key=value pairs)
    -l, --force-launch-plugin                Launch a new plugin even if one is already running
    -s, --skip-plugin-cache                  Skip the plugin cache and force reloading
    -f, --floating-plugin <BOOL>             Whether the launched plugin should be floating
    -i, --in-place-plugin <BOOL>             Launch plugin in place (conflicts with --floating-plugin)
    -w, --plugin-cwd <CWD>                   Working directory for the launched plugin
    -t, --plugin-title <TITLE>               Pane title for the launched plugin
```

eg.
```
$ zellij action pipe --name "my-pipe" --plugin "file:/path/to/plugin.wasm" "some payload"
$ echo "data from stdin" | zellij action pipe --name "my-pipe" --plugin "my-plugin-alias"
```

#### previous-swap-layout
Switch to the previous swap layout for the current tab

**OPTIONS**:
```
    -t, --tab-id <TAB_ID>    Target a specific tab by ID
```

eg.
```
$ zellij action previous-swap-layout
```

#### query-tab-names
Query all tab names (receive a textual list on the command line)

eg.
```
$ zellij action query-tab-names
```

#### rename-pane
Renames the focused pane (title will appear on the pane frame)

**ARGS**: the pane name

**OPTIONS**:
```
    -p, --pane-id <PANE_ID>    Target a specific pane by ID
```

eg.
```
$ zellij action rename-pane "alice the cat"
$ zellij action rename-pane --pane-id terminal_3 "my pane"
```

#### rename-session
Rename the current session

**ARGS**: The new session name

eg.
```
$ zellij action rename-session "my-new-session-name"
```

#### rename-tab
Renames the focused tab

**ARGS**: the tab name

**OPTIONS**:
```
    -t, --tab-id <TAB_ID>    Target a specific tab by ID
```

eg.
```
$ zellij action rename-tab "alice the cat"
$ zellij action rename-tab --tab-id 3 "my tab"
```

#### rename-tab-by-id
Rename a tab by its stable ID

**ARGS**: The tab ID (integer) followed by the new name (string)

eg.
```
$ zellij action rename-tab-by-id 5 "my new tab name"
```

#### resize
Resize the focused pane in the specified direction.

**ARGS**: The resize direction [right|left|up|down|+|-]

**OPTIONS**:
```
    -p, --pane-id <PANE_ID>    Target a specific pane by ID
```

eg.
```
$ zellij action resize left
$ zellij action resize --pane-id terminal_3 +
```

#### save-session
Save the current session state to disk immediately. Useful for triggering a manual serialization outside the automatic interval.

eg.
```
$ zellij action save-session
```

#### scroll-down
Scroll down 1 line in the focused pane

**OPTIONS**:
```
    -p, --pane-id <PANE_ID>    Target a specific pane by ID
```

eg.
```
$ zellij action scroll-down
```

#### scroll-to-bottom
Scroll down to bottom in the focused pane

**OPTIONS**:
```
    -p, --pane-id <PANE_ID>    Target a specific pane by ID
```

eg.
```
$ zellij action scroll-to-bottom
```

#### scroll-to-top
Scroll up to top in the focused pane

**OPTIONS**:
```
    -p, --pane-id <PANE_ID>    Target a specific pane by ID
```

eg.
```
$ zellij action scroll-to-top
```

#### scroll-up
Scroll up 1 line in the focused pane

**OPTIONS**:
```
    -p, --pane-id <PANE_ID>    Target a specific pane by ID
```

eg.
```
$ zellij action scroll-up
```

#### send-keys
Send one or more keys to the terminal. Keys are specified as space-separated names (eg. "Ctrl a", "F1", "Alt Shift b").

**ARGS**: One or more key names (space-separated)

**OPTIONS**:
```
    -p, --pane-id <PANE_ID>    Target a specific pane by ID
```

eg.
```
$ zellij action send-keys "Ctrl a"
$ zellij action send-keys --pane-id terminal_3 "Alt b" "Enter"
```

#### set-pane-borderless
Set the borderless state of a specific pane

**OPTIONS (required)**:
```
    -p, --pane-id <PANE_ID>        Target pane by ID (required)
    -b, --borderless <BORDERLESS>  Whether the pane should be borderless (required)
```

eg.
```
$ zellij action set-pane-borderless --pane-id terminal_3 --borderless true
```

#### set-pane-color
Set the default foreground and/or background color of a pane. Colors can be specified as hex (eg. "#00e000") or rgb notation (eg. "rgb:00/e0/00").

**OPTIONS**:
```
    -p, --pane-id <PANE_ID>    Target pane by ID (defaults to $ZELLIJ_PANE_ID)
        --fg <FG>              Foreground color (eg. "#00e000", "rgb:00/e0/00")
        --bg <BG>              Background color (eg. "#001a3a", "rgb:00/1a/3a")
        --reset                Reset pane colors to terminal defaults (conflicts with --fg, --bg)
```

eg.
```
$ zellij action set-pane-color --fg "#00e000" --bg "#001a3a"
$ zellij action set-pane-color --pane-id terminal_3 --reset
```

#### show-floating-panes
Show all floating panes in the specified tab (or active tab). Returns exit code 0 if changed, 2 if already visible, 1 if the tab was not found.

**OPTIONS**:
```
    -t, --tab-id <TAB_ID>    Target a specific tab by ID
```

eg.
```
$ zellij action show-floating-panes
$ zellij action show-floating-panes --tab-id 3
```

#### start-or-reload-plugin
Launch a plugin if it is not loaded or reload it (skipping cache) if it is. Mostly useful for plugin development.

**ARGS**: The [plugin URL](./plugin-loading.md#plugin-url-schema) (eg. `file:/path/to/my/plugin.wasm`)

**OPTIONS**:
```
    -c, --configuration <CONFIG>    Plugin configuration (key=value pairs)
```

eg.
```
zellij action start-or-reload-plugin zellij:strider
zellij action start-or-reload-plugin file:/path/to/plugin.wasm -c "key=value"
```

#### stack-panes
Given a list of pane ids, turns them into a stack. (pane ids can be discovered through the `$ZELLIJ_PANE_ID` env var).

**ARGS**: A list of panes (see example below)

eg.
```
# This will create a stack of 3 panes (terminal with ID 1, plugin with ID 1 and terminal with ID 2)
$ zellij action stack-panes -- terminal_1 plugin_1 terminal_2
```

#### switch-mode
Switch input mode of all connected clients

**ARGS**: The mode to switch to [locked|pane|tab|resize|move|search|session|tmux]

eg.
```
$ zellij action switch-mode locked
```

#### switch-session
Switch to a different session

**ARGS**: The session name to switch to

**OPTIONS**:
```
        --tab-position <TAB_POSITION>    Tab position to focus after switching
        --pane-id <PANE_ID>              Pane ID to focus after switching
    -l, --layout <LAYOUT>                Layout to apply when switching
        --layout-dir <LAYOUT_DIR>        Default folder for layouts (requires --layout)
        --layout-string <LAYOUT_STRING>  Raw KDL layout string to use directly (conflicts with --layout)
    -c, --cwd <CWD>                      Working directory when switching
```

eg.
```
$ zellij action switch-session my-other-session
$ zellij action switch-session my-session --tab-position 2 --layout /path/to/layout.kdl
```

#### toggle-active-sync-tab
Toggle between sending text input to all panes in the current tab and just to the focused pane (the default)

**OPTIONS**:
```
    -t, --tab-id <TAB_ID>    Target a specific tab by ID
```

eg.
```
$ zellij action toggle-active-sync-tab
```

#### toggle-floating-panes
Toggle the visibility of all floating panes in the current Tab, open one if none exist

**OPTIONS**:
```
    -t, --tab-id <TAB_ID>    Target a specific tab by ID
```

eg.
```
$ zellij action toggle-floating-panes
```

#### toggle-fullscreen
Toggle between fullscreen focus pane and normal layout

**OPTIONS**:
```
    -p, --pane-id <PANE_ID>    Target a specific pane by ID
```

eg.
```
$ zellij action toggle-fullscreen
```

#### toggle-pane-borderless
Toggle the borderless state of a specific pane

**OPTIONS (required)**:
```
    -p, --pane-id <PANE_ID>    Target pane by ID (required)
```

eg.
```
$ zellij action toggle-pane-borderless --pane-id terminal_3
```

#### toggle-pane-embed-or-floating
Embed focused pane if floating or float focused pane if embedded

**OPTIONS**:
```
    -p, --pane-id <PANE_ID>    Target a specific pane by ID
```

eg.
```
$ zellij action toggle-pane-embed-or-floating
```

#### toggle-pane-frames
Toggle frames around panes in the UI

**Note**: Zellij relies on frames to display parts of the UI, removing them might make certain things a little confusing to those not used to the app.

eg.
```
$ zellij action toggle-pane-frames
```

#### toggle-pane-pinned
If the current pane is a floating pane, toggle its pinned state (always on top).

**OPTIONS**:
```
    -p, --pane-id <PANE_ID>    Target a specific pane by ID
```

eg.
```
$ zellij action toggle-pane-pinned
```

#### undo-rename-pane
Remove a previously set pane name

**OPTIONS**:
```
    -p, --pane-id <PANE_ID>    Target a specific pane by ID
```

eg.
```
$ zellij action undo-rename-pane
```

#### undo-rename-tab
Remove a previously set tab name

**OPTIONS**:
```
    -t, --tab-id <TAB_ID>    Target a specific tab by ID
```

eg.
```
$ zellij action undo-rename-tab
```

#### write
Write bytes to the focused pane

**ARGS**: An array of bytes to write

**OPTIONS**:
```
    -p, --pane-id <PANE_ID>    Target a specific pane by ID
```

eg.
```
$ zellij action write 102 111 111
```

#### write-chars
Write characters to the focused pane

**ARGS**: A string of characters to write

**OPTIONS**:
```
    -p, --pane-id <PANE_ID>    Target a specific pane by ID
```

eg.
```
$ zellij action write-chars "Hi there!"
```
