# CLI Recipes & Scripting

This page provides task-oriented examples for controlling Zellij from the command line and shell scripts. For a full reference of all available actions, see [CLI Actions](./cli-actions.md). For patterns oriented toward non-interactive, machine-driven control (output polling, event loops, concurrency), see [Programmatic Control](./programmatic-control.md).

---

- [Targeting Specific Panes and Tabs](#targeting-specific-panes-and-tabs)
- [Sending Input to Another Pane](#sending-input-to-another-pane)
- [Watching Pane Output in Real Time](#watching-pane-output-in-real-time)
- [Starting and Controlling Background Sessions](#starting-and-controlling-background-sessions)
- [Scripting Pane and Tab Creation](#scripting-pane-and-tab-creation)
- [Inspecting Session State](#inspecting-session-state)
- [Controlling Floating Panes](#controlling-floating-panes)
- [Borderless Panes](#borderless-panes)
- [Toggling Pane Visibility](#toggling-pane-visibility)
- [Changing Pane Colors](#changing-pane-colors)
- [Blocking Panes](#blocking-panes)
- [Scrollback and Screen Capture](#scrollback-and-screen-capture)
- [Session Management](#session-management)
- [Working with Plugins from the CLI](#working-with-plugins-from-the-cli)
- [Layout Overrides at Runtime](#layout-overrides-at-runtime)

---

## Targeting Specific Panes and Tabs

Many CLI actions accept `--pane-id` or `--tab-id` flags, allowing commands to be directed at specific panes or tabs without changing focus. This eliminates the need to switch focus before issuing a command.

### Pane IDs

Every terminal pane exposes its ID through the `$ZELLIJ_PANE_ID` environment variable. Pane IDs are specified as `terminal_N`, `plugin_N`, or a bare integer `N` (equivalent to `terminal_N`).

Discover all pane IDs in the current session:
```
zellij action list-panes
```

**Sample output:**
```
PANE_ID      TYPE      TITLE
terminal_1   terminal  /bin/bash
plugin_0     plugin    tab-bar
terminal_2   terminal  vim main.rs
```

Or as JSON for structured processing:
```
zellij action list-panes --json
```

**Sample output:**
```json
[
  {
    "id": 1,
    "is_plugin": false,
    "is_focused": true,
    "title": "/bin/bash",
    "is_floating": false,
    "tab_id": 0,
    "tab_name": "Tab #1",
    "pane_command": "bash",
    "pane_cwd": "/home/user/project"
  }
]
```
*(JSON output includes many additional fields — see [Inspecting Session State](#inspecting-session-state) for full details)*

### Tab IDs

Tab IDs can be discovered with:
```
zellij action list-tabs
```

**Sample output:**
```
TAB_ID  POSITION  NAME
0       0         Tab #1
1       1         editor
2       2         logs
```

Or as JSON:
```
zellij action list-tabs --json
```

**Sample output:**
```json
[
  {
    "position": 0,
    "name": "Tab #1",
    "active": true,
    "tab_id": 0
  }
]
```
*(JSON output includes many additional fields — see [Inspecting Session State](#inspecting-session-state) for full details)*

Or get the current tab info:
```
zellij action current-tab-info
```

**Sample output:**
```
name: Tab #1
id: 0
position: 0
```

### Examples

Clear a specific pane without focusing it:
```
zellij action clear --pane-id terminal_3
```

Scroll to the top of a specific pane:
```
zellij action scroll-to-top --pane-id terminal_5
```

Close a specific tab by its ID:
```
zellij action close-tab --tab-id 3
```

## Sending Input to Another Pane

Commands can be sent directly to any pane by ID. There is no need to change focus first.

Send keystrokes to a specific pane:
```
zellij action send-keys --pane-id terminal_3 "Enter" "ctrl c"
```

Write a string of characters one-by-one to a specific pane:
```
zellij action write-chars --pane-id terminal_3 "echo hello"
```

Paste text (using bracketed paste mode) to a specific pane (faster and more robust than write-chars):
```
zellij action paste --pane-id terminal_3 "multi-line\ntext content"
```

## Watching Pane Output in Real Time

The [zellij subscribe](./zellij-subscribe.md) command streams the rendered output of one or more panes to stdout. This is useful for monitoring builds, logs, or any running process without keeping the pane visible.

Monitor a pane's output:
```
zellij subscribe --pane-id terminal_1
```

Filter live output for errors using JSON mode and `jq`:
```
zellij subscribe --pane-id terminal_1 --format json | jq --unbuffered 'select(.event == "pane_update") | .viewport[] | select(test("ERROR"))'
```

Use JSON format with `jq` for structured processing:
```
zellij subscribe --pane-id terminal_1 --format json | jq 'select(.event == "pane_update") | .viewport[]'
```

Monitor multiple panes simultaneously:
```
zellij subscribe --pane-id terminal_1 --pane-id terminal_2 --format json
```

## Starting and Controlling Background Sessions

A Zellij session can be created in the background without attaching to it. This is useful for headless workflows, CI pipelines, and scripted environments.

Create a background session:
```
zellij attach --create-background my-session
```

Create a background session with a specific [layout](./creating-a-layout.md):
```
zellij attach --create-background my-session options --default-layout compact
```

Create a background session with a custom layout file:
```
zellij attach --create-background my-session options --default-layout /path/to/layout.kdl
```

Once a background session is running, actions can be issued against it using the global `--session` flag:

Send keystrokes to a pane in the background session:
```
zellij --session my-session action paste "make build" --pane-id terminal_1 &&
zellij --session my-session action send-keys --pane-id terminal_1 "Enter"
```

Open a new pane in the background session:
```
PANE_ID=$(zellij --session my-session action new-pane)
zellij --session my-session action paste "npm test" --pane-id $PANE_ID &&
zellij --session my-session action send-keys --pane-id $PANE_ID "Enter"
```

Subscribe to a pane's output in the background session (see [Zellij Subscribe](./zellij-subscribe.md)):
```
zellij --session my-session subscribe --pane-id terminal_1 --format json
```

Dump the screen of a specific pane in the background session:
```
zellij --session my-session action dump-screen --pane-id terminal_1 --full
```

### Full Scripted Workflow Example

```bash
#!/bin/bash

# Create a background session with a layout
zellij attach --create-background ci-runner options --default-layout compact

# Open a pane and capture its ID
BUILD_PANE=$(zellij --session ci-runner action new-pane --name "build")

# Start a build
zellij --session ci-runner action paste --pane-id $BUILD_PANE "cargo build 2>&1" &&
zellij --session ci-runner action send-keys --pane-id $BUILD_PANE "Enter"

# Monitor the build output for relevant lines, exit when the pane closes
zellij --session ci-runner subscribe --pane-id $BUILD_PANE --format json \
  | jq --unbuffered 'select(.event == "pane_update") | .viewport[] | select(test("error|warning|Finished"))'
```

## Scripting Pane and Tab Creation

Several CLI actions return the ID of the created pane or tab, making it possible to chain commands in scripts.

Actions that return a pane ID:
- `new-pane`
- `edit`
- `launch-plugin`
- `launch-or-focus-plugin`
- `toggle-floating-panes` (when a new floating pane is created, this happens when no floating panes exist in that tab)
- `show-floating-panes` (when a new floating pane is created, this happens when no floating panes exist in that tab)

Actions that return a tab ID:
- `new-tab`
- `go-to-tab-name --create` (when a new tab is created)

Capture a new pane ID and send commands to it:
```bash
PANE_ID=$(zellij action new-pane --name "my worker")
zellij action paste --pane-id $PANE_ID "python worker.py" &&
zellij action send-keys --pane-id $PANE_ID "Enter"
```

Create a floating pane with specific coordinates and use its ID:
```bash
PANE_ID=$(zellij action new-pane --floating --width 80 --height 24 --x 10% --y 10%)
zellij action paste --pane-id $PANE_ID "htop" &&
zellij action send-keys --pane-id $PANE_ID "Enter"
```

Create a tab and capture its ID:
```bash
TAB_ID=$(zellij action new-tab --name "tests" --layout /path/to/test-layout.kdl)
```

## Inspecting Session State

Information about the current session can be queried for use in scripts or external status bars. For a full reference of these commands, see the [CLI Actions](./cli-actions.md) page.

### Listing Panes

List all panes with full details:
```
zellij action list-panes --all
```

**Sample output:**
```
TAB_ID  TAB_POS  TAB_NAME  PANE_ID      TYPE      TITLE          COMMAND        CWD                      FOCUSED  FLOATING  EXITED  X  Y   ROWS  COLS
0       0        Tab #1    terminal_1   terminal  /bin/bash      bash           /home/user/project       true     false     false   0  1   24    80
0       0        Tab #1    plugin_0     plugin    tab-bar        zellij:tab-bar -                        false    false     false   0  0   1     80
1       1        Tab #2    terminal_2   terminal  vim main.rs    vim main.rs    /home/user/project/src   true     false     false   0  1   24    80
```

Get JSON output for programmatic use:
```
zellij action list-panes --json | jq '.[] | select(.is_focused == true)'
```

**Sample output:**
```json
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
}
```

### Listing Tabs

List all tabs with state and layout info:
```
zellij action list-tabs --state --layout
```

**Sample output:**
```
TAB_ID  POSITION  NAME    ACTIVE  FULLSCREEN  SYNC_PANES  FLOATING_VIS  SWAP_LAYOUT  LAYOUT_DIRTY
0       0         Tab #1  true    false       false       false         default      false
1       1         editor  false   false       false       false         -            false
2       2         logs    false   false       false       true          default      true
```

Get JSON output:
```
zellij action list-tabs --json
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
  }
]
```

### Current Tab Info

Get information about the currently active tab:
```
zellij action current-tab-info
```

**Sample output:**
```
name: Tab #1
id: 0
position: 0
```

Get full details as JSON:
```
zellij action current-tab-info --json
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

### Other Queries

List connected clients:
```
zellij action list-clients
```

Query all tab names:
```
zellij action query-tab-names
```

## Controlling Floating Panes

Create a floating pane with specific coordinates:
```
zellij action new-pane --floating --x 10% --y 10% --width 80% --height 80%
```

Show or hide all floating panes:
```
zellij action show-floating-panes
zellij action hide-floating-panes
```

Pin a floating pane so it stays on top:
```
zellij action toggle-pane-pinned --pane-id terminal_5
```

Reposition and resize a floating pane:
```
zellij action change-floating-pane-coordinates --pane-id terminal_5 --x 20 --y 10 --width 50% --height 50%
```

## Borderless Panes

A pane can be created without a border using the `--borderless` flag. Combined with `--pinned`, this creates a persistent overlay that appears as part of the terminal UI itself — with no visible frame separating it from the rest of the screen.

For example, a small pane pinned to the top-right corner that continuously displays the current git branch and status:

```bash
zellij action new-pane --floating --borderless true --pinned true \
--width "20%" --height 1 --x "75%" --y 2 \
-- bash -c 'while true; do printf "\r%-40s" "$(git -C /home/user/project branch --show-current) $(git -C /home/user/project status --short | wc -l) changed"; sleep 5; done'
```
This creates a single-line overlay that stays on top of all other panes, has no border, and continuously refreshes — functioning like a custom status bar element.

Another example — a persistent resource monitor pinned to a corner:
```
zellij action new-pane --floating --borderless true --pinned true \
    --width 30 --height 5 --x "100%" --y "100%" \
    -- watch -n2 -t "free -h | head -3"
```

Toggle the borderless state of an existing pane:
```
zellij action toggle-pane-borderless --pane-id terminal_5
```

Explicitly set the borderless state:
```
zellij action set-pane-borderless --pane-id terminal_5 --borderless true
```

## Toggling Pane Visibility

A tiled pane can be floated and a floating pane can be embedded. This is useful for background tasks — a long-running process can be kept in a floating pane whose visibility is toggled as needed, keeping the main workspace uncluttered.

Float a tiled pane or embed a floating pane:
```
zellij action toggle-pane-embed-or-floating --pane-id terminal_3
```

Toggle the visibility of all floating panes in the current tab:
```
zellij action toggle-floating-panes
```

A common pattern is to start a background task in a floating pane, hide floating panes to keep the workspace clean, and show them again when the task needs attention:
```bash
# Start a long-running build in a floating pane
PANE_ID=$(zellij action new-pane --floating --name "build")
zellij action paste --pane-id $PANE_ID "cargo build --release 2>&1" &&
zellij action send-keys --pane-id $PANE_ID "Enter"

# Hide floating panes to focus on other work
zellij action hide-floating-panes

# Later, show them again to check progress
zellij action show-floating-panes
```

## Changing Pane Colors

The foreground and background colors of a pane can be changed at runtime with `set-pane-color`. Colors are specified as hex (eg. `"#00e000"`) or rgb notation (eg. `"rgb:00/e0/00"`). This can be used to visually distinguish panes, flash a pane to get the user's attention, or color-code panes by purpose.

Set both foreground and background:
```
zellij action set-pane-color --pane-id terminal_3 --fg "#00e000" --bg "#001a3a"
```

Set only the background:
```
zellij action set-pane-color --pane-id terminal_3 --bg "#3a0000"
```

Reset colors back to the terminal defaults:
```
zellij action set-pane-color --pane-id terminal_3 --reset
```

Flash a pane red briefly to get attention (from a script):
```bash
zellij action set-pane-color --pane-id terminal_3 --bg "#5a0000"
sleep 1
zellij action set-pane-color --pane-id terminal_3 --reset
```

When no `--pane-id` is specified, the command defaults to the pane identified by the `$ZELLIJ_PANE_ID` environment variable, making it easy to use from within a pane's own shell:
```
zellij action set-pane-color --bg "#001a3a"
```

## Blocking Panes

A pane can be opened with blocking flags that cause the calling process to wait until the command in the pane completes. This is powerful for scripting multi-step workflows where each step depends on the previous one.

### Waiting for a Command to Finish

Block until the command exits and the user closes the pane (by pressing `Ctrl-c`):
```
zellij action new-pane --blocking -- cargo test
```

Or equivalently with `zellij run`:
```
zellij run --blocking -- cargo test
```

The calling shell will not continue until the pane has been closed. The user can review the output, then press `Ctrl-c` to close the pane and unblock.

### Waiting for Success or Failure

The `--block-until-exit-success` flag unblocks only when the command exits with status 0. If it fails, the pane stays open and the user can press `Enter` to retry — the calling process remains blocked until the command succeeds (or the pane is closed manually):

```
zellij action new-pane --block-until-exit-success -- cargo build
echo "Build succeeded, continuing..."
```

If `cargo build` fails, the pane will display the error and wait. The user can fix the issue in another pane, then go back and press `Enter` to retry. The script only continues once the build passes.

This retry can also be triggered remotely from another pane or script:
```
zellij action send-keys --pane-id terminal_3 "Enter"
```

Similarly, `--block-until-exit-failure` unblocks only when the command exits with a non-zero status:
```
zellij action new-pane --block-until-exit-failure -- ./run-server.sh
echo "Server crashed, running cleanup..."
```

And `--block-until-exit` unblocks when the command exits regardless of its status:
```
zellij action new-pane --block-until-exit -- ./my-task.sh
echo "Task finished (exit status does not matter), moving on..."
```

### Scripted Multi-Step Workflows with Human Intervention

These flags are especially useful for workflows that may require human intervention at certain steps. The script pauses at each blocking pane, and the user can inspect, fix, and retry as needed before the script continues:

```bash
#!/bin/bash

# Step 1: run tests — retry until they pass
zellij action new-pane --block-until-exit-success --name "tests" -- cargo test

# Step 2: build release — retry until it succeeds
zellij action new-pane --block-until-exit-success --name "release build" -- cargo build --release

# Step 3: deploy — wait for it to finish regardless of outcome
zellij action new-pane --block-until-exit --name "deploy" -- ./deploy.sh

echo "Pipeline complete."
```

At each step, if the command fails, the pane remains open. The user can investigate the failure, make fixes in other panes, and press `Enter` in the blocking pane to retry. The script advances only after each step succeeds (or completes, for `--block-until-exit`).

### Blocking Panes in New Tabs

The same blocking flags are available on `new-tab` for its initial command:

```
zellij action new-tab --block-until-exit-success -- cargo test
```

## Scrollback and Screen Capture

Dump the viewport of the focused pane to stdout:
```
zellij action dump-screen
```

Dump full scrollback with ANSI styling to a file:
```
zellij action dump-screen --path /tmp/capture.txt --full --ansi
```

Dump a specific pane's content:
```
zellij action dump-screen --pane-id terminal_3 --full
```

Open the scrollback of a specific pane in the default editor:
```
zellij action edit-scrollback --pane-id terminal_3
```

## Session Management

Rename the current session:
```
zellij action rename-session "my-project"
```

Save session state immediately (for [session resurrection](./session-resurrection.md)):
```
zellij action save-session
```

Switch to a different session:
```
zellij action switch-session other-session
```

Detach from the current session:
```
zellij action detach
```

## Working with Plugins from the CLI

Launch a new plugin instance:
```
zellij action launch-plugin file:/path/to/plugin.wasm --floating
```

Send data to a plugin via [pipe](./zellij-plugin-and-pipe.md#zellij-pipe):
```
echo "some data" | zellij pipe --name my-pipe --plugin "my-plugin-alias"
```

Reload a plugin during development (see [Plugin Development](./plugin-development.md)):
```
zellij action start-or-reload-plugin file:/path/to/plugin.wasm
```

## Layout Overrides at Runtime

Replace the current tab's [layout](./creating-a-layout.md) with a different one:
```
zellij action override-layout /path/to/new-layout.kdl
```

Keep existing panes that do not fit the new layout:
```
zellij action override-layout /path/to/layout.kdl --retain-existing-terminal-panes --retain-existing-plugin-panes
```

Apply the layout only to the active tab:
```
zellij action override-layout /path/to/layout.kdl --apply-only-to-active-tab
```
