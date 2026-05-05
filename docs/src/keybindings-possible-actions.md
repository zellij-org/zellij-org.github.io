# Possible Actions

## `Clear`

 Clear the scrollback buffer of the focused pane

**Possible arguments**: None

eg.
```javascript
    bind "a" { Clear; }
```

## `Copy`

 Copy the current text selection to the clipboard

**Possible arguments**: None

```javascript
    bind "a" { Copy; }
```

## `BreakPane`

 Break the focused pane out of its current tab into a new tab

**Possible arguments**: None

eg.
```javascript
    bind "a" { BreakPane; }
```

## `BreakPaneLeft`

 Break the focused pane out into a new tab to the left of the current tab

**Possible arguments**: None

eg.
```javascript
    bind "a" { BreakPaneLeft; }
```

## `BreakPaneRight`

 Break the focused pane out into a new tab to the right of the current tab

**Possible arguments**: None

eg.
```javascript
    bind "a" { BreakPaneRight; }
```

## `CloseFocus`

 Close the focused pane

**Possible arguments**: None

eg.
```javascript
    bind "a" { CloseFocus; }
```
## `CloseTab`

 Close the focused tab

**Possible arguments**: None

eg.
```javascript
    bind "a" { CloseTab; }
```
## `Detach`

 Detach from the current session, leaving it running in the background

**Possible arguments**: None

eg.
```javascript
    bind "a" { Detach; }
```
## `DumpScreen`

 Dump the contents of the focused pane, including its entire scrollback, to the specified file.

**Required arguments**: A path to a file on the hard-drive

**Optional arguments**: `full` - `true` or `false` (include full scrollback, default is `false`), `ansi` - `true` or `false` (preserve ANSI styling, default is `false`)

eg.
```javascript
    bind "a" { DumpScreen "/tmp/my-dump.txt"; }
```
## `EditScrollback`

 Edit the scrollback of the currently focused pane with the user's default editor.

**Optional arguments** (in child block):
  - `ansi` - `true` or `false` (preserve ANSI styling in the scrollback dump, default is `false`)

```javascript
    bind "a" { EditScrollback; }
```
or with ANSI styling preserved:
```javascript
    bind "a" { EditScrollback { ansi true; } }
```
## `FocusNextPane`

 Change focus to the next pane (order not guaranteed)

**Possible arguments**: None

```javascript
    bind "a" { FocusNextPane; }
```
## `FocusPreviousPane`

 Change focus to the previous pane (order not guaranteed)

**Possible arguments**: None

```javascript
    bind "a" { FocusPreviousPane; }
```
## `GoToNextTab`

 Change focus to the next tab

**Possible arguments**: None

```javascript
    bind "a" { GoToNextTab; }
```
## `GoToPreviousTab`

 Change focus to the previous tab

**Possible arguments**: None

```javascript
    bind "a" { GoToPreviousTab; }
```
## `GoToTab`

 Change focus to a tab with a specific index

**Required arguments**: numeric tab index (eg. 1)

```javascript
    bind "a" { GoToTab 1; }
```
## `HalfPageScrollDown`

 Scroll the focused pane half a page down

**Possible arguments**: None

```javascript
    bind "a" { HalfPageScrollDown; }
```
## `HalfPageScrollUp`

 Scroll the focused pane half a page up

**Possible arguments**: None

```javascript
    bind "a" { HalfPageScrollUp; }
```

## `HideFloatingPanes`

 Hide all floating panes in the current (or specified) tab

**Possible arguments**: An optional tab index (integer)

```javascript
    bind "a" { HideFloatingPanes; }
```
or:
```javascript
    bind "a" { HideFloatingPanes 2; }
```

## `LaunchOrFocusPlugin`

 Launch a plugin if it is not already loaded somewhere in the session, focus it if it is

**Required arguments**: The [plugin URL](./plugin-loading.md#plugin-url-schema) (eg. `file:/path/to/my/plugin.wasm`)

**Optional arguments**:
  - `floating` - `true` or `false` (default is `false`)
  - `in_place` - `true` or `false` (open in place of the focused pane, default is `false`)
  - `close_replaced_pane` - `true` or `false` (when using `in_place`, close the replaced pane instead of suspending it, default is `false`)
  - `move_to_focused_tab` - `true` or `false` (if the plugin is already running, move it to the focused tab, default is `false`)
  - `skip_plugin_cache` - `true` or `false` (skip the plugin cache and force reloading, default is `false`)

```javascript
    bind "a" {
        LaunchOrFocusPlugin "zellij:strider" {
            floating true
        }
    }
```
or:
```javascript
    bind "a" {
        LaunchOrFocusPlugin "zellij:strider" {
            in_place true
            move_to_focused_tab true
        }
    }
```

## `LaunchPlugin`

 Launch a new plugin instance. Unlike `LaunchOrFocusPlugin`, this always launches a new instance even if one is already running.

**Required arguments**: The [plugin URL](./plugin-loading.md#plugin-url-schema) (eg. `file:/path/to/my/plugin.wasm`)

**Optional arguments**:
  - `floating` - `true` or `false` (default is `false`)
  - `in_place` - `true` or `false` (open in place of the focused pane, default is `false`)
  - `close_replaced_pane` - `true` or `false` (when using `in_place`, close the replaced pane instead of suspending it, default is `false`)
  - `skip_plugin_cache` - `true` or `false` (skip the plugin cache and force reloading, default is `false`)
  - Additional key-value pairs are passed as plugin user configuration

```javascript
    bind "a" {
        LaunchPlugin "file:/path/to/my/plugin.wasm" {
            floating true
            skip_plugin_cache true
            my_config_key "my_config_value"
        }
    }
```

## `MessagePlugin`

Send a message to one or more plugins, using a [pipe](./plugin-pipes.md) - meaning the plugin will be launched if it is not already running.

**Required arguments**: None (with no options specified, this keybind will send an empty message to all plugins)

**Optional arguments:**:
    - `launch_new` (`true/false`): force a new plugin to launch even if one is already running
    - `skip_cache` (`true/false`): skip the plugin cache and force reloading (and re-download if the plugin is http), even if the plugin is already running or cached
    - `floating` (`true/false`): if launching a new plugin, should it be floating or tiled
    - `in_place` (`true/false`): if launching a new plugin, open it in place of the focused pane
    - `name` (`String`): The name of the message
    - `payload` (`String`): The payload of the message
    - `title` (`String`): The pane title of the pane if launching a new plugin instance
    - `cwd` (`String`): The working directory of the plugin if launching a new instance

```javascript
    bind "a" {
        MessagePlugin "file:/path/to/my/plugin.wasm" {
            name "message_name"
            payload "message_payload"
            cwd "/path/to/my/working/directory"
        }
    }
```

There is also `MessagePluginId` which sends a message to a specific running plugin by its numeric ID:

```javascript
    bind "a" {
        MessagePluginId 42 {
            name "message_name"
            payload "message_payload"
        }
    }
```

## `MoveFocus`

 Move focus in a specific direction

**Required arguments**: `Left` | `Right` | `Up` | `Down`

```javascript
    bind "a" { MoveFocus "Left"; }
```

## `MoveFocusOrTab`

 Move focus left or right, or to the next or previous tab if on screen edge

**Required arguments**: `Left` | `Right`

```javascript
    bind "a" { MoveFocusOrTab "Left"; }
```
## `MovePane`

 Move the position of the focused pane in the specific direction

**Required arguments**: `Left` | `Right` | `Up` | `Down`

```javascript
    bind "a" { MovePane "Left"; }
```

## `MovePaneBackwards`

 Move the focused pane backwards in the layout order (the inverse of `MovePane` without a direction)

**Possible arguments**: None

```javascript
    bind "a" { MovePaneBackwards; }
```

## `MoveTab`

 Change the position of the active tab either left or right.

**Required arguments**: the direction, either "Left" or "Right"

```javascript
    bind "a" { MoveTab "Left"; }
```

## `NextSwapLayout`

 Change the layout of the current tab (either tiled or floating) to the next one

**Possible arguments**: None

```javascript
    bind "a" { NextSwapLayout; }
```

## `OverrideLayout`

 Override the layout of the active tab with the specified layout file.

**Optional arguments** (in child block):
  - `layout` - path to the layout file
  - `cwd` - working directory for the layout
  - `name` - name of the tab
  - `retain_existing_terminal_panes` - `true` or `false` (keep terminal panes not fitting the new layout, default is `false`)
  - `retain_existing_plugin_panes` - `true` or `false` (keep plugin panes not fitting the new layout, default is `false`)
  - `apply_only_to_active_tab` - `true` or `false` (only apply to the active tab, default is `false`)

```javascript
    bind "a" {
        OverrideLayout {
            layout "/path/to/layout.kdl"
            retain_existing_terminal_panes true
            apply_only_to_active_tab true
        }
    }
```

## `NewPane`

 Open a new pane (in the specified direction)

**Possible arguments**: `Down` | `Right` | `Stacked`

**Behaviour without arguments**: Opens a pane in the largest available space or if floating panes are visible, in the next floating pane position.

```javascript
    bind "a" { NewPane "Right"; }
```
or open a stacked pane:
```javascript
    bind "a" { NewPane "Stacked"; }
```

**Note**: For more advanced pane creation options (floating coordinates, borderless, close-on-exit, cwd, etc.), use the [`Run`](#run) keybinding action instead.
## `NewTab`

 Open a new tab

**Possible arguments**: `cwd`

 Current working directory for the new tab, `name` - the name of the new tab, `layout` - path to the layout file to load for this tab

```javascript
    bind "a" { NewTab; }
```
or:
```javascript
    bind "a" {
       NewTab {
           cwd "/tmp"
           name "My tab name"
           layout "/path/to/my/layout.kdl"
       }
    }
```
## `PageScrollDown`

 Scroll the focused pane one page down

**Possible arguments**: None

```javascript
    bind "a" { PageScrollDown; }
```

## `PageScrollUp`

 Scroll the focused pane one page up

**Possible arguments**: None

```javascript
    bind "a" { PageScrollUp; }
```

## `PaneNameInput`

 Send byte input for renaming the focused pane. Typically used in the `RenamePane` input mode.

**Required arguments**: One or more integer (u8) byte values

```javascript
    bind "a" { PaneNameInput 0; }
```

## `PreviousSwapLayout`

 Change the layout of the current tab (either tiled or floating) to the previous one

**Possible arguments**: None

```javascript
    bind "a" { PreviousSwapLayout; }
```
## `Quit`

 Quit Zellij :(

**Possible arguments**: None

```javascript
    bind "a" { Quit; }
```
## `Resize`

 Resize the focused pane either in the specified direction or increase/decrease its size automatically

**Required arguments**: `Left` | `Right` | `Up` | `Down` | `Increase` | `Decrease`

```javascript
    bind "a" { Resize "Increase"; }
```

## `RenameSession`

 Rename the current session

**Required arguments**: The new session name as a string

```javascript
    bind "a" { RenameSession "my-new-session-name"; }
```

## `Run`

 Run the specified command in a new pane

**Required arguments**: The command to run, followed by optional arguments

**Possible arguments** (in child block):
  - `cwd` - current working directory
  - `direction` - the direction to open the new command pane (`"Down"` | `"Right"`)
  - `floating` - `true` or `false` (open as a floating pane)
  - `in_place` - `true` or `false` (open in place of the focused pane)
  - `close_replaced_pane` - `true` or `false` (when using `in_place`, close the replaced pane)
  - `stacked` - `true` or `false` (open as a stacked pane)
  - `name` - name for the new pane
  - `close_on_exit` - `true` or `false` (close the pane when the command exits)
  - `start_suspended` - `true` or `false` (start the command suspended)
  - `x`, `y`, `width`, `height` - floating pane coordinates (when `floating` is `true`)
  - `pinned` - `true` or `false` (pin the floating pane, when `floating` is `true`)
  - `borderless` - `true` or `false` (hide the pane border)

```javascript
    // will run "tail -f /tmp/foo" in a pane opened below the focused one
    bind "a" {
        Run "tail" "-f" "foo" {
            cwd "/tmp"
            direction "Down"
        }
    }
```
or as a floating pane:
```javascript
    bind "a" {
        Run "htop" {
            floating true
            x "10%"
            y "10%"
            width "80%"
            height "80%"
        }
    }
```
or in place of the focused pane:
```javascript
    bind "a" {
        Run "htop" {
            in_place true
            close_replaced_pane true
        }
    }
```
or as a stacked pane:
```javascript
    bind "a" {
        Run "htop" {
            stacked true
        }
    }
```
## `ScrollDown`

 Scroll the focused pane down 1 line

**Possible arguments**: None

```javascript
    bind "a" { ScrollDown; }
```
## `ScrollToBottom`

 Scroll the focused pane completely down

**Possible arguments**: None

```javascript
    bind "a" { ScrollToBottom; }
```
## `ScrollUp`

 Scroll the focused pane up 1 line

**Possible arguments**: None

```javascript
    bind "a" { ScrollUp; }
```
## `ScrollToTop`

 Scroll the focused pane completely up

**Possible arguments**: None

```javascript
    bind "a" { ScrollToTop; }
```
## `Search`

 When searching, move to the next or previous search occurrence

**Required arguments**: "down" | "up"

```javascript
    bind "a" { Search "up"; }
```

## `SearchInput`

 Send byte input for the search needle. Typically used in the `EnterSearch` input mode.

**Required arguments**: One or more integer (u8) byte values

```javascript
    bind "a" { SearchInput 0; }
```

## `SearchToggleOption`

 Toggle various search options on/off

**Required arguments**: "CaseSensitivity" | "Wrap" | "WhileWord"

```javascript
    bind "a" { SearchToggleOption "CaseSensitivity"; }
```

## `SetDarkTheme`

 Switch the theme to dark (uses the configured `theme_dark`).

**Possible arguments**: None

```javascript
    bind "a" { SetDarkTheme; }
```

## `SetLightTheme`

 Switch the theme to light (uses the configured `theme_light`).

**Possible arguments**: None

```javascript
    bind "a" { SetLightTheme; }
```

## `SwitchToMode`

 Switch the current input mode

**Required arguments**: See [Modes](#modes)

```javascript
    bind "a" { SwitchToMode "locked"; }
```

## `ShowFloatingPanes`

 Show all floating panes in the current (or specified) tab

**Possible arguments**: An optional tab index (integer)

```javascript
    bind "a" { ShowFloatingPanes; }
```
or:
```javascript
    bind "a" { ShowFloatingPanes 2; }
```

## `SwitchSession`

 Switch to a different named session. The session must already exist or be creatable.

**Required arguments**: `name` - the session name to switch to

**Optional arguments** (in child block):
  - `tab_position` - tab index to focus after switching (integer)
  - `pane_id` - pane ID to focus after switching (integer)
  - `is_plugin` - whether the `pane_id` refers to a plugin pane (`true` or `false`, default is `false`)
  - `layout` - layout file path to apply
  - `cwd` - working directory for the session

```javascript
    bind "a" {
        SwitchSession {
            name "my-other-session"
        }
    }
```
or:
```javascript
    bind "a" {
        SwitchSession {
            name "my-session"
            tab_position 0
            layout "/path/to/layout.kdl"
            cwd "/home/user"
        }
    }
```

## `TabNameInput`

 Send byte input for renaming the focused tab. Typically used in the `RenameTab` input mode.

**Required arguments**: One or more integer (u8) byte values

```javascript
    bind "a" { TabNameInput 0; }
```

## `ToggleActiveSyncTab`

 Toggle the syncing of input between all panes in the focused tab

**Possible arguments**: None

```javascript
    bind "a" { ToggleActiveSyncTab; }
```

## `ToggleFloatingPanes`

 Show/hide floating panes; if none are open, one will be opened

**Possible arguments**: None

```javascript
    bind "a" { ToggleFloatingPanes; }
```

## `ToggleFocusFullscreen`

 Toggle the focused pane as fullscreen on/off

**Possible arguments**: None

```javascript
    bind "a" { ToggleFocusFullscreen; }
```

## `ToggleMouseMode`

 Toggle mouse support on/off

**Possible arguments**: None

```javascript
    bind "a" { ToggleMouseMode; }
```

## `TogglePaneEmbedOrFloating`

 Float focused embedded pane or embed focused floating pane

**Possible arguments**: None

```javascript
    bind "a" { TogglePaneEmbedOrFloating; }
```

## `TogglePaneFrames`

 Show/hide the frames around panes (notice, these might have valuable UX info)

**Possible arguments**: None

```javascript
    bind "a" { TogglePaneFrames; }
```

## `TogglePaneInGroup`

 Toggle whether the focused pane is included in a pane group

**Possible arguments**: None

```javascript
    bind "a" { TogglePaneInGroup; }
```

## `TogglePanePinned`

 Toggle the pinned state of a floating pane. A pinned floating pane stays on top of other panes.

**Possible arguments**: None

```javascript
    bind "a" { TogglePanePinned; }
```

## `ToggleGroupMarking`

 Toggle group marking mode, allowing selection of multiple panes for group operations

**Possible arguments**: None

```javascript
    bind "a" { ToggleGroupMarking; }
```

## `ToggleTab`

 Change the tab focus

**Possible arguments**: None

```javascript
    bind "a" { ToggleTab; }
```

## `ToggleTheme`

 Toggle between the configured `theme_dark` and `theme_light`.

**Possible arguments**: None

```javascript
    bind "a" { ToggleTheme; }
```

## `UndoRenamePane`

 Undo a rename pane operation currently in progress (reverting to the previous name)

**Possible arguments**: None

```javascript
    bind "a" { UndoRenamePane; }
```

## `UndoRenameTab`

 Undo a rename tab operation currently in progress (reverting to the previous name)

**Possible arguments**: None

```javascript
    bind "a" { UndoRenameTab; }
```

## `Write`

 Write bytes to the active pane

**Required arguments**: the bytes to write as integers

```javascript
    bind "a" { Write 102 111 111; }
```

## `WriteChars`

 Write a string of characters to the active pane

**Required arguments**: the string of characters to write

```javascript
    bind "a" { WriteChars "hi there!"; }
```
