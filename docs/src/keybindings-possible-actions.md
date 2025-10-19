# Possible Actions

## `BreakPane`

 Break out pane to a new tab

**Possible arguments**: None

```javascript
    bind "a" { BreakPane; }
```

## `BreakPaneLeft`

 Break out pane to the left tab

**Possible arguments**: None

```javascript
    bind "a" { BreakPaneLeft; }
```

## `BreakPaneRight`

 Break out pane to the right tab

**Possible arguments**: None

```javascript
    bind "a" { BreakPaneRight; }
```

## `Clear`

 Clear the scrollback buffer of the focused pane

**Possible arguments**: None

```javascript
    bind "a" { Clear; }
```

## `CloseFocus`

 Close the focused pane

**Possible arguments**: None

```javascript
    bind "a" { CloseFocus; }
```
## `CloseTab`

 Close the focused tab

**Possible arguments**: None

```javascript
    bind "a" { CloseTab; }
```

## `Confirm`

 Confirm a prompt

**Possible arguments**: None

```javascript
    bind "a" { Confirm; }
```

## `Copy`

 Copy

**Possible arguments**: None

```javascript
    bind "a" { Copy; }
```

## `Deny`

 Deny a prompt

**Possible arguments**: None

```javascript
    bind "a" { Deny; }
```

## `Detach`

 Detach from the current session, leaving it running in the background

**Possible arguments**: None

```javascript
    bind "a" { Detach; }
```

## `DumpLayout`

 Dump the current layout

**Required arguments**: A path to a file on the hard-drive

```javascript
    bind "a" { DumpLayout "/tmp/my-dump.txt"; }
```

## `DumpScreen`

 Dump the contents of the focused pane, including its entire scrollback, to the specified file.

**Required arguments**: A path to a file on the hard-drive

```javascript
    bind "a" { DumpScreen "/tmp/my-dump.txt"; }
```
## `EditScrollback`

 Edit the scrollback of the currently focused pane with the user's default editor.

**Possible arguments**: None

```javascript
    bind "a" { EditScrollback; }
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

## `LaunchOrFocusPlugin`

 Launch a plugin if it is not already loaded somewhere in the session, focus it if it is

**Required arguments**: The [plugin URL](./plugin-loading.md#plugin-url-schema) (eg. `file:/path/to/my/plugin.wasm`)

**Optional arguments**:
- `move_to_focused_tab` (`true/false`): if the plugin is already opened, should it be moved to the focused tab
- `floating` (`true/false`): should it be floating or tiled
- `in_place` (`true/false`): if launching a new plugin, should it be opened in place of the current pane, temporarily suspending it
- `skip_plugin_cache` (`true/false`): if launching a new plugin, force re-compilation (and re-download if the plugin is http)

```javascript
    bind "a" {
        LaunchOrFocusPlugin "zellij:strider" {
            floating true
        }
    }
```

## `LaunchPlugin`

 Launch a plugin, even if one is already running

**Required arguments**: The [plugin URL](./plugin-loading.md#plugin-url-schema) (eg. `file:/path/to/my/plugin.wasm`)

**Optional arguments**:
- `floating` (`true/false`): should it be floating or tiled
- `in_place` (`true/false`): should it be opened in place of the current pane, temporarily suspending it
- `skip_plugin_cache` (`true/false`): force re-compilation (and re-download if the plugin is http)

```javascript
    bind "a" {
        LaunchPlugin "zellij:strider" {
            floating true
        }
    }
```

## `MessagePlugin`

Send a message to one or more plugins, using a [pipe](./plugin-pipes.md) - meaning the plugin will be launched if it is not already running.

**Required arguments**: None (with no options specified, this keybind will send an empty message to all plugins)

**Optional arguments**:
- `launch_new` (`true/false`): force a new plugin to launch even if one is already running
- `skip_cache` (`true/false`): force re-compilation (and re-download if the plugin is http), even if the plugin is already running or cached
- `floating` (`true/false`): if launching a new plugin, should it be floating or tiled
- `name` (`String`): name of the message
- `payload` (`String`): payload of the message
- `title` (`String`): pane title of the pane if launching a new plugin instance
- `cwd` (`String`): working directory of the plugin if launching a new instance

```javascript
    bind "a" {
        MessagePlugin "file:/path/to/my/plugin.wasm" {
            name "message_name"
            payload "message_payload"
            cwd "/path/to/my/working/directory"
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

 Move the focused pane, optionally in the specific direction

**Possible arguments**: `Left` | `Right` | `Up` | `Down`

```javascript
    bind "a" { MovePane "Left"; }
```

## `MovePaneBackwards`

 Move the focused pane backwards

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
## `NewPane`

 Open a new pane (in the specified direction)

**Possible arguments**: `Down` | `Right` | `Stacked`

**Behaviour without arguments**: Opens a pane in the largest available space or if floating panes are visible, in the next floating pane position.

```javascript
    bind "a" { NewPane "Right"; }
```
## `NewTab`

 Open a new tab

**Possible arguments**:
- `cwd` (`String`): change the working directory of the new tab
- `name` (`String`): name of the new tab
- `layout` (`String`): path to the layout file to load for this tab

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

## `PaneNameInput`

 Change pane name

**Required arguments**: `0`

```javascript
    bind "a" { PaneNameInput 0; }
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

## `RenameSession`

 Rename session

**Required arguments**: New name

```javascript
    bind "a" { RenameSession "default"; }
```

## `Resize`

 Resize the focused pane either in the specified direction or increase/decrease its size automatically

**Required arguments**: `Left` | `Right` | `Up` | `Down` | `Increase` | `Decrease`

```javascript
    bind "a" { Resize "Increase"; }
```
## `Run`

 Run the specified command

**Required arguments**: The command to run, followed by optional arguments

**Optional arguments**:
- `cwd` (`String`): change the working directory of the new pane
- `name` (`String`): name of the new pane
- `direction` (`String`): direction to open the new pane in
- `close_on_exit` (`true/false`): close the pane immediately when its command exits
- `start_suspended` (`true/false`): Start the command suspended, only running after you first presses ENTER
- `floating` (`true/false`): open the new pane in floating mode
- `in_place` (`true/false`): open the new pane in place of the current pane, temporarily suspending it

**Optional arguments for `floating=true`**:
- `pinned` (`true/false`): whether to pin a floating pane so that it is always on top
- `x`/`y`/`width`/`height`: either a fixed number (characters from screen edge) or a percentage (recommended in case where the terminal window size is not known)

```javascript
    // will run "tail -f /tmp/foo" in a pane opened below the focused one
    bind "a" {
        Run "tail" "-f" "foo" {
            cwd "/tmp"
            direction "Down"
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

 Search for string

**Required arguments**: `0`

```javascript
    bind "a" { SearchInput 0; }
```

## `SearchToggleOption`

 Toggle various search options on/off

**Required arguments**: "CaseSensitivity" | "Wrap" | "WhileWord"

```javascript
    bind "a" { SearchToggleOption "CaseSensitivity"; }
```

## `SwitchFocus`

 Switch focused pane

**Possible arguments**: None

```javascript
    bind "a" { SwitchFocus; }
```

## `SwitchToMode`

 Switch the current input mode

**Required arguments**: See [Modes](#modes)

```javascript
    bind "a" { SwitchToMode "locked"; }
```

## `TabNameInput`

 Change tab name

**Required arguments**: `0`

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

## `TogglePanePinned`

 Pin/unpin the focused floating pane (pinned floating panes always remain on top)

**Possible arguments**: None

```javascript
    bind "a" { TogglePanePinned; }
```

## `ToggleTab`

 Change the tab focus

**Possible arguments**: None

```javascript
    bind "a" { ToggleTab; }
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
