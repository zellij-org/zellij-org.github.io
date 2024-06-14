## CLI Actions

#### close-pane

Close the focused pane

eg.
```
$ zellij action close-pane
```

#### close-tab
Close the current tab

eg.
```
$ zellij action close-tab
```

#### dump-screen
Dumps the pane scrollback to a file

**ARGS**: The path to the file on the hard-drive (eg. `/tmp/screen-dump.txt`)

eg.
```
$ zellij action dump-screen /tmp/screen-dump.txt
```

#### edit
Open the specified file in a new zellij pane with your default EDITOR

**ARGS**: The path to the file to open (eg. `/tmp/my-file.rs`)

**OPTIONS**:
```
-d, --direction <DIRECTION> [right|down]
-f, --floating
-l, --line-number <LINE_NUMBER>
```

eg.
```
$ zellij action edit ./my-file.rs -f
```

**Note:** This can also be shortened to [`zellij edit`](zellij-edit.md)

eg.
```
$ zellij edit ./my-file.rs -f
```

#### dump-layout
Dumps the current [Layout](./creating-a-layout.md) of the session to STDOUT

eg.
```
$ zellij action dump-layout
```

#### edit-scrollback
Open the pane scrollback in your default editor

eg.
```
$ zellij action edit-scrollback
```

#### focus-next-pane
Change focus to the next pane

eg.
```
$ zellij action focus-next-pane
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

#### go-to-tab-name
Go to tab with name [name]

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

eg.
```
$ zellij action half-page-scroll-down
```

#### half-page-scroll-up
Scroll up half page in focus pane

eg.
```
$ zellij action half-page-scroll-up
```

#### launch-or-focus-plugin
Launch a plugin if it is not loaded somewhere in the session, focus it if it is.

**ARGS**: The [plugin URL](./plugin-loading.md#plugin-url-schema) (eg. `file:/path/to/my/plugin.wasm`)

**OPTIONS**:
```
-f, --floating      Will be used when launching the plugin if it is not already running
```

eg.
```
zellij action launch-or-focus-plugin zellij:strider --floating
```

#### list-clients
List all clients connected to the current session, their focused pane id and their running program (if it's not the default shell and if Zellij can detect it).

*A note about pane ids:* Since terminal panes and plugin panes can have overlapping IDs, they are differentiated by prefixing the pane type, eg. `terminal_1` is a different pane than `plugin_1`. The ID of terminal panes is the same one that can be discovered through the `ZELLIJ_PANE_ID` environment variable.

eg.
```
$ zellij action list-clients

CLIENT_ID ZELLIJ_PANE_ID RUNNING_COMMAND
1         plugin_2       zellij:session-manager
2         terminal_3     vim /tmp/my-file.txt
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

**ARGS**: The direction to move [right|left|up|down]

eg.
```
$ zellij action move-pane left
```

#### new-pane
Open a new pane in the specified direction or as a floating pane. If no is specified, will try to use the biggest available space.

**ARGS (optional)**: the command to run inside the pane in place of the default shell (must be preceeded by a double-dash `--`)
                                                                                                                                               
**OPTIONS**:
```
    -c, --close-on-exit            Close the pane immediately when its command exits
        --cwd <CWD>                Change the working directory of the new pane
    -d, --direction <DIRECTION>    Direction to open the new pane in
    -f, --floating                 Open the new pane in floating mode
    -h, --help                     Print help information
    -n, --name <NAME>              Name of the new pane
    -s, --start-suspended          Start the command suspended, only running after you first presses
```

eg.
```
$ zellij action new-pane -f # open a new floating pane with the default shell
$ zellij action new-pane --name "follow this log!" -- tail -f /tmp/my-log-file # open a new floating pane with the default shell
```

**Note:** This can also be shortened to [`zellij run`](zellij-run.md)

eg.
```
$ zellij run -- tail -f /tmp/my-log-file
```

#### new-tab
Create a new tab, optionally with a specified tab layout and name

Specifying a path to a layout file with `--layout` will start that tab with the specified layout.

If the `--cwd` flag if included with the `--layout` flag, all relative paths in that layout will start from this `cwd`. Replacing the global `cwd` in the layout if it exists.
See [layout CWD composition](./creating-a-layout.md#cwd-composition) for more info.

**OPTIONS**:
```
    -c, --cwd <CWD>
    -l, --layout <LAYOUT>
    -n, --name <NAME>
```

#### page-scroll-down
Scroll down one page in focus pane

eg.
```
$ zellij action page-scroll-down
```

#### page-scroll-up
Scroll up one page in focus pane

eg.
```
$ zellij action page-scroll-up
```

#### rename-pane
Renames the focused pane (title will appear on the pane frame)

**ARGS**: the pane name

eg.
```
$ zellij action rename-pane "alice the cat"
```

#### rename-tab
Renames the focused tab

**ARGS**: the tab name

eg.
```
$ zellij action rename-tab "alice the cat"
```

#### resize
Resize the focused pane in the specified direction.

**ARGS**: The resize direction [right|left|up|down|+|-]

eg.
```
$ zellij action resize left
```

#### scroll-down
Scroll down 1 line in the focused pane

eg.
```
$ zellij action scroll-down
```

#### scroll-to-bottom
Scroll down to bottom in the focused pane

eg.
```
$ zellij action scroll-to-bottom
```

#### scroll-up
Scroll up 1 line in the focused pane

eg.
```
$ zellij action scroll-up
```

#### start-or-reload-plugin
Launch a plugin if it is not loaded or reload it (skipping cache) if it is. Mostly useful for plugin development.

**ARGS**: The [plugin URL](./plugin-loading.md#plugin-url-schema) (eg. `file:/path/to/my/plugin.wasm`)

eg.
```
zellij action start-or-reload-plugin zellij:strider
```

#### switch-mode
Switch input mode of all connected clients

**ARGS**: The mode to switch to [locked|pane|tab|resize|move|search|session|tmux]

eg.
```
$ zellij action switch-mode locked
```

#### toggle-active-sync-tab
Toggle between sending text input to all panes in the current tab and just to the focused pane (the default)

eg.
```
$ zellij action toggle-active-sync-tab
```

#### toggle-floating-panes
Toggle the visibility of all floating panes in the current Tab, open one if none exist

eg.
```
$ zellij action toggle-floating-panes
```

#### toggle-fullscreen
Toggle between fullscreen focus pane and normal layout

eg.
```
$ zellij action toggle-fullscreen
```

#### toggle-pane-embed-or-floating
Embed focused pane if floating or float focused pane if embedded

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

#### undo-rename-pane
Remove a previously set pane name

eg.
```
$ zellij action undo-rename-pane
```

#### undo-rename-tab
Remove a previously set tab name

eg.
```
$ zellij action undo-rename-tab
```

#### query-tab-names
Query all tab names (receive a textual list on the command line)

eg.
```
$ zellij action query-tab-names
```

#### write
Write bytes to the focused pane

**ARGS**: An array of bytes to write

eg.
```
$ zellij action write 102 111 111
```

#### write-chars
Write characters to the focused pane

**ARGS**: A string of characters to write

eg.
```
$ zellij action write-chars "Hi there!"
```
