# Possible Actions

Actions whose name ends in `ByPaneId`, `ById` or `ByTabId` act on a specific pane or tab instead of the focused one. In a keybinding the pane or tab id must be given. Inside an item of the [right-click menu](./context-menu.md) it can be left out, and the clicked pane or tab is used.

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

## `CopyLastCommandOutput`

 Copy the output of the last command run in the focused pane to the clipboard. Requires the shell to emit [OSC 133 shell integration](./shell-integration.md) sequences, which delimit the command's output. The copied region is briefly flashed in the pane.

**Possible arguments**: None

By default bound to `c` in `scroll` mode.

```javascript
    bind "a" { CopyLastCommandOutput; }
```

## `ApplyFloatingSwapLayout`

 Apply the floating swap layout with the given name, as declared in the layout file. Floating pane visibility and focus are left as they are. If no floating swap layout with that name fits the current number of panes, nothing changes.

**Required arguments**: the name of the swap layout

```javascript
    bind "a" { ApplyFloatingSwapLayout "spread"; }
```

## `ApplyTiledSwapLayout`

 Apply the tiled swap layout with the given name, as declared in the layout file. Floating pane visibility and focus are left as they are. If no tiled swap layout with that name fits the current number of panes, nothing changes.

**Required arguments**: the name of the swap layout

```javascript
    bind "a" { ApplyTiledSwapLayout "vertical"; }
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
## `CloseFocusByPaneId`

 Close a specific pane

**Required arguments**: a pane id as a string, eg. `"terminal_1"`, `"plugin_2"` or `"3"` (the same as `"terminal_3"`). It can only be left out inside a [right-click menu](./context-menu.md) item.

```javascript
    bind "a" { CloseFocusByPaneId "terminal_1"; }
```

## `CloseTab`

 Close the focused tab

**Possible arguments**: None

eg.
```javascript
    bind "a" { CloseTab; }
```
## `CloseTabById`

 Close a specific tab

**Required arguments**: a numeric tab id. It can only be left out inside a [right-click menu](./context-menu.md) item.

```javascript
    bind "a" { CloseTabById 2; }
```

## `Detach`

 Detach from the current session, leaving it running in the background

**Possible arguments**: None

eg.
```javascript
    bind "a" { Detach; }
```
## `DismissInfoPopups`

 Close the information popups (such as those shown with [`zellij prompt notify`](./zellij-prompt.md)) shown to this user

**Possible arguments**: None

```javascript
    bind "a" { DismissInfoPopups; }
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
## `FocusGuestSession`

 When the focused pane contains a [nested Zellij session](./nested-sessions.md), descend into it - routing keyboard and mouse input to the nested (guest) session and dimming the chrome of the host session.

**Possible arguments**: None

By default bound to `[` in `session` mode.

```javascript
    bind "a" { FocusGuestSession; }
```

## `FocusHostSession`

 When running inside a [nested Zellij session](./nested-sessions.md), return focus to the host (outer) session.

**Possible arguments**: None

By default bound to `]` in `session` mode.

```javascript
    bind "a" { FocusHostSession; }
```

## `FocusLastPane`

 Change focus back to the pane that was focused before the currently focused one. Takes floating panes into account, and swaps the pane in place when the focused pane is fullscreen.

**Possible arguments**: None

By default bound to `;` in `pane` mode.

```javascript
    bind "a" { FocusLastPane; }
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
## `GoToNextAttention`

 Jump to the next pane that needs attention (see the [inbox](./inbox.md)), in any session, switching session if needed

**Possible arguments**: None

By default bound to `n` in `session` mode.

```javascript
    bind "a" { GoToNextAttention; }
```

## `GoToNextSession`

 Go forward in this user's history of visited sessions

**Possible arguments**: None

By default bound to `Right` in `session` mode.

```javascript
    bind "a" { GoToNextSession; }
```

## `GoToPreviousSession`

 Go back in this user's history of visited sessions

**Possible arguments**: None

By default bound to `Left` in `session` mode.

```javascript
    bind "a" { GoToPreviousSession; }
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

## `HideBarByPaneId`

 Hide the bar (eg. the tab-bar or status-bar) shown in a specific pane, in every tab

**Required arguments**: a pane id as a string, eg. `"terminal_1"`, `"plugin_2"` or `"3"` (the same as `"terminal_3"`). It can only be left out inside a [right-click menu](./context-menu.md) item.

```javascript
    bind "a" { HideBarByPaneId "plugin_1"; }
```

## `HideBars`

 Hide the named bars in every tab, or all bars if none are named. They can be shown again with [`ShowBars`](#showbars) or [`ToggleBars`](#togglebars).

**Possible arguments**: zero or more bar names: `tab-bar`, `status-bar`, `compact-bar`, a plugin alias or location, or `all`

```javascript
    bind "a" { HideBars; }
```
or:
```javascript
    bind "a" { HideBars "status-bar"; }
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

## `IgnorePaneOutput`

 Stop or start reporting new output of the focused pane. Only the "new output" note is hidden; panes that need attention, failed commands and finished commands are still reported.

**Possible arguments**: None

By default bound to `g` in `pane` mode.

```javascript
    bind "a" { IgnorePaneOutput; }
```

## `IgnorePaneOutputByPaneId`

 Like [`IgnorePaneOutput`](#ignorepaneoutput), for a specific pane

**Required arguments**: a pane id as a string, eg. `"terminal_1"`, `"plugin_2"` or `"3"` (the same as `"terminal_3"`). It can only be left out inside a [right-click menu](./context-menu.md) item.

```javascript
    bind "a" { IgnorePaneOutputByPaneId "terminal_1"; }
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

## `MarkAllSeen`

 Mark every pane of every running session as seen, clearing past events

**Optional arguments**: `this_session` - `true` or `false` (only mark the panes of the current session, default is `false`)

```javascript
    bind "a" { MarkAllSeen; }
```
or:
```javascript
    bind "a" { MarkAllSeen this_session=true; }
```

## `MarkPaneSeen`

 Mark the focused pane as seen, clearing its past events

**Possible arguments**: None

```javascript
    bind "a" { MarkPaneSeen; }
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

## `MoveTabByTabId`

 Move a specific tab one position to the left or right

**Required arguments**: the direction (`"left"` or `"right"`) followed by a numeric tab id. The tab id can only be left out inside a [right-click menu](./context-menu.md) item.

```javascript
    bind "a" { MoveTabByTabId "left" 2; }
```

## `MoveTabToPosition`

 Move a specific tab to a position in the tab list. This is also what dragging a tab in the tab bar does.

**Required arguments**: the position (`"start"`, `"end"`, or a number counting from 0) followed by a numeric tab id. The tab id can only be left out inside a [right-click menu](./context-menu.md) item.

```javascript
    bind "a" { MoveTabToPosition "start" 2; }
```

## `MutePane`

 Mute or unmute the focused pane. A muted pane shows nothing it reports (on its frame, in the tab bar or in the [inbox](./inbox.md)) and raises no desktop notifications. It is still tracked, so unmuting it shows its current state.

**Possible arguments**: None

By default bound to `u` in `pane` mode.

```javascript
    bind "a" { MutePane; }
```

## `MutePaneByPaneId`

 Like [`MutePane`](#mutepane), for a specific pane

**Required arguments**: a pane id as a string, eg. `"terminal_1"`, `"plugin_2"` or `"3"` (the same as `"terminal_3"`). It can only be left out inside a [right-click menu](./context-menu.md) item.

```javascript
    bind "a" { MutePaneByPaneId "terminal_1"; }
```

## `MuteSession`

 Mute or unmute all panes of the current session

**Possible arguments**: None

By default bound to `u` in `session` mode.

```javascript
    bind "a" { MuteSession; }
```

## `MuteTab`

 Mute or unmute all panes of the active tab

**Possible arguments**: None

By default bound to `u` in `tab` mode.

```javascript
    bind "a" { MuteTab; }
```

## `MuteTabByTabId`

 Like [`MuteTab`](#mutetab), for a specific tab

**Required arguments**: a numeric tab id. It can only be left out inside a [right-click menu](./context-menu.md) item.

```javascript
    bind "a" { MuteTabByTabId 2; }
```

## `NextSwapLayout`

 Change the layout of the current tab (either tiled or floating) to the next one

**Possible arguments**: None

By default bound to `Alt ]` in all modes except `locked`, and to `Space` in `tab` mode.

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

## `NewFloatingPane`

 Open a new floating terminal pane

**Possible arguments**: None

By default bound to `a` in `pane` mode.

```javascript
    bind "a" { NewFloatingPane; }
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
## `OpenContextMenu`

 Open the [right-click menu](./context-menu.md) of the focused pane, at that pane's position

**Possible arguments**: None

```javascript
    bind "a" { OpenContextMenu; }
```

## `OpenSessionInTerminal`

 Open the current session in a window of the [Zellij terminal](./zellij-terminal.md)

**Possible arguments**: None

```javascript
    bind "a" { OpenSessionInTerminal; }
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

## `PasteFromClipboardByPaneId`

 Paste the clipboard into a specific pane. This only works in clients that can read the clipboard (the [Zellij terminal](./zellij-terminal.md)); elsewhere it does nothing.

**Required arguments**: a pane id as a string, eg. `"terminal_1"`, `"plugin_2"` or `"3"` (the same as `"terminal_3"`). It can only be left out inside a [right-click menu](./context-menu.md) item.

```javascript
    bind "a" { PasteFromClipboardByPaneId "terminal_1"; }
```

## `PreviousSwapLayout`

 Change the layout of the current tab (either tiled or floating) to the previous one

**Possible arguments**: None

By default bound to `Alt [` in all modes except `locked`, and to `Shift Space` in `tab` mode.

```javascript
    bind "a" { PreviousSwapLayout; }
```
## `Quit`

 Quit Zellij :(

Since `0.46.0`, quitting from a keybinding first asks for confirmation. What it asks (or whether it asks at all) is set with the [`on_quit`](./options.md#on_quit) option. Pressing the quit key again while the question is shown quits.

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
  - `borderless` - `true` or `false` (hide the pane border, when `floating` is `true`)
  - `border_style` - the line style of the new pane's border: `"single"`, `"double"`, `"heavy"`, `"dashed"` or `"heavy_dashed"`. `border_top`, `border_right`, `border_bottom` and `border_left` set one side each, and `border_rounded_corners` (`true` or `false`) rounds the corners. These apply to floating and tiled panes, not to `in_place` or `stacked` ones.
  - `background` - `true` or `false` (run the command without opening a pane, default is `false`). Only the command, its arguments and `cwd` are used; the other arguments are ignored. Without `cwd`, the command runs in the working directory of the pane that was focused; a relative `cwd` is taken from that directory.

A command started with `Run` gets the `ZELLIJ_ORIGIN_PANE_ID` environment variable: the id of the pane that was focused when the key was pressed, eg. `terminal_3` or `plugin_2`. Focus changes made earlier in the same binding count, so `MoveFocus "Left"; Run "my-script";` reports the pane on the left. A `background` command also gets `ZELLIJ_PANE_ID` set to that terminal pane's number (it is not set when the focused pane is a plugin).

eg. to run "tail -f /tmp/foo" in a pane opened below the focused one:
```javascript
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
or with a double border:
```javascript
    bind "a" {
        Run "htop" {
            floating true
            border_style "double"
        }
    }
```
or in the background, without a pane:
```javascript
    bind "a" {
        Run "sh" "-c" "echo $ZELLIJ_ORIGIN_PANE_ID >> /tmp/focused-panes" {
            background true
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
## `ScrollToNextPrompt`

 Scroll the focused pane down to the next shell prompt in its scrollback. Requires the shell to emit [OSC 133 shell integration](./shell-integration.md) sequences.

**Possible arguments**: None

By default bound to `]` in `scroll` and `search` modes.

```javascript
    bind "a" { ScrollToNextPrompt; }
```
## `ScrollToPreviousPrompt`

 Scroll the focused pane up to the previous shell prompt in its scrollback. Requires the shell to emit [OSC 133 shell integration](./shell-integration.md) sequences.

**Possible arguments**: None

By default bound to `[` in `scroll` and `search` modes.

```javascript
    bind "a" { ScrollToPreviousPrompt; }
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

## `SelectCommandAtScrollPosition`

 Select the command and its output at the current scroll position of the focused pane, so that it can be copied. Requires the shell to emit [OSC 133 shell integration](./shell-integration.md) sequences.

**Possible arguments**: None

By default bound to `m` in `scroll` and `search` modes.

```javascript
    bind "a" { SelectCommandAtScrollPosition; }
```

## `SessionNameInput`

 Send byte input for renaming the current session. Typically used in the `RenameSession` input mode, where `0` clears the name to start typing a new one.

**Required arguments**: One or more integer (u8) byte values

By default bound to `r` in `session` mode.

```javascript
    bind "a" { SwitchToMode "RenameSession"; SessionNameInput 0; }
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

## `SetPaneFrameStyle`

 Set the style of the pane frames for the whole session (see the [`pane_frame_style`](./options.md#pane_frame_style) option)

**Required arguments**: "full" | "titles" | "none"

```javascript
    bind "a" { SetPaneFrameStyle "full"; }
```

## `SwitchToMode`

 Switch the current input mode

**Required arguments**: See [Modes](./keybindings-modes.md)

```javascript
    bind "a" { SwitchToMode "locked"; }
```

## `ShowBars`

 Show all hidden bars

**Possible arguments**: None

```javascript
    bind "a" { ShowBars; }
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

## `StartRenamePaneByPaneId`

 Start renaming a specific pane: enter the `RenamePane` input mode for that pane, with its name cleared

**Required arguments**: a pane id as a string, eg. `"terminal_1"`, `"plugin_2"` or `"3"` (the same as `"terminal_3"`). It can only be left out inside a [right-click menu](./context-menu.md) item.

```javascript
    bind "a" { StartRenamePaneByPaneId "terminal_1"; }
```

## `StartRenameTabByTabId`

 Start renaming a specific tab: enter the `RenameTab` input mode for that tab, with its name cleared

**Required arguments**: a numeric tab id. It can only be left out inside a [right-click menu](./context-menu.md) item.

```javascript
    bind "a" { StartRenameTabByTabId 2; }
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
  - `close_current` - `true` or `false` (close the current session after switching, if no command has been run in it and no other user is attached; default is `false`)

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

## `ToggleBars`

 If any bar is hidden, show all bars. Otherwise hide the named bars (all bars if none are named) in every tab.

**Possible arguments**: zero or more bar names: `tab-bar`, `status-bar`, `compact-bar`, a plugin alias or location, or `all`

By default bound to `Shift z` in `pane` mode.

```javascript
    bind "a" { ToggleBars; }
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

## `ToggleFocusFullscreenByPaneId`

 Like [`ToggleFocusFullscreen`](#togglefocusfullscreen), for a specific pane

**Required arguments**: a pane id as a string, eg. `"terminal_1"`, `"plugin_2"` or `"3"` (the same as `"terminal_3"`). It can only be left out inside a [right-click menu](./context-menu.md) item.

```javascript
    bind "a" { ToggleFocusFullscreenByPaneId "terminal_1"; }
```

## `ToggleFocusNoUiFullscreen`

 Toggle the focused pane as fullscreen on/off, with the pane taking up the entire display - including the space normally occupied by the UI bars (eg. the tab-bar and status-bar). Unlike `ToggleFocusFullscreen`, which keeps them visible.

**Possible arguments**: None

By default bound to `Shift f` in `pane` mode.

```javascript
    bind "a" { ToggleFocusNoUiFullscreen; }
```

## `ToggleHostFullscreen`

 When running inside a [nested Zellij session](./nested-sessions.md), toggle the fullscreen state of this session's pane within the host (outer) session.

**Possible arguments**: None

By default bound to `f` in `session` mode.

```javascript
    bind "a" { ToggleHostFullscreen; }
```

## `ToggleMirrorResize`

 Toggle whether the live view of a pane shown in the focused plugin pane (eg. in the [inbox](./inbox.md)) resizes the program of the pane it shows

**Possible arguments**: None

```javascript
    bind "a" { ToggleMirrorResize; }
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

## `TogglePaneEmbedOrFloatingByPaneId`

 Like [`TogglePaneEmbedOrFloating`](#togglepaneembedorfloating), for a specific pane

**Required arguments**: a pane id as a string, eg. `"terminal_1"`, `"plugin_2"` or `"3"` (the same as `"terminal_3"`). It can only be left out inside a [right-click menu](./context-menu.md) item.

```javascript
    bind "a" { TogglePaneEmbedOrFloatingByPaneId "terminal_1"; }
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

## `TogglePaneInGroupByPaneId`

 Like [`TogglePaneInGroup`](#togglepaneingroup), for a specific pane

**Required arguments**: a pane id as a string, eg. `"terminal_1"`, `"plugin_2"` or `"3"` (the same as `"terminal_3"`). It can only be left out inside a [right-click menu](./context-menu.md) item.

```javascript
    bind "a" { TogglePaneInGroupByPaneId "terminal_1"; }
```

## `TogglePanePinned`

 Toggle the pinned state of a floating pane. A pinned floating pane stays on top of other panes.

**Possible arguments**: None

```javascript
    bind "a" { TogglePanePinned; }
```

## `TogglePanePinnedByPaneId`

 Like [`TogglePanePinned`](#togglepanepinned), for a specific pane

**Required arguments**: a pane id as a string, eg. `"terminal_1"`, `"plugin_2"` or `"3"` (the same as `"terminal_3"`). It can only be left out inside a [right-click menu](./context-menu.md) item.

```javascript
    bind "a" { TogglePanePinnedByPaneId "terminal_1"; }
```

## `ToggleGroupMarking`

 Toggle group marking mode, allowing selection of multiple panes for group operations

**Possible arguments**: None

```javascript
    bind "a" { ToggleGroupMarking; }
```

## `ToggleSession`

 Switch to the session this user was in before (run again to return), or to the next running session if there is none

**Possible arguments**: None

By default bound to `Tab` in `session` mode.

```javascript
    bind "a" { ToggleSession; }
```

## `ToggleSessionCard`

 Show or hide the [inbox](./inbox.md). If the inbox is open but not focused, focus it. If a live view of a pane inside the inbox has the keyboard, give the keys back to the inbox instead.

**Possible arguments**: None

By default bound to `i` in `session` mode.

```javascript
    bind "a" { ToggleSessionCard; }
```

## `ToggleStackListOrientation`

 Switch the focused stack between showing its pane titles in a column (vertical) and in a row (horizontal). See the [`stacked_pane_list_orientation`](./options.md#stacked_pane_list_orientation) option.

**Possible arguments**: None

By default bound to `Shift s` in `pane` mode.

```javascript
    bind "a" { ToggleStackListOrientation; }
```

## `ToggleStackListOrientationByPaneId`

 Like [`ToggleStackListOrientation`](#togglestacklistorientation), for the stack holding a specific pane

**Required arguments**: a pane id as a string, eg. `"terminal_1"`, `"plugin_2"` or `"3"` (the same as `"terminal_3"`). It can only be left out inside a [right-click menu](./context-menu.md) item.

```javascript
    bind "a" { ToggleStackListOrientationByPaneId "terminal_1"; }
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

## `ToggleTrayIcon`

 Show or hide the tray (menu-bar) icon of the [Zellij desktop app](./zellij-terminal.md) until the app restarts. Sessions and notifications keep working while it is hidden.

**Possible arguments**: None

```javascript
    bind "a" { ToggleTrayIcon; }
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

## `UndoRenameSession`

 Undo a rename session operation currently in progress (keeping the previous name)

**Possible arguments**: None

By default bound to `Esc` in `renamesession` mode.

```javascript
    bind "a" { UndoRenameSession; }
```

## `WatchPane`

 Watch or stop watching the focused pane. A watched pane is reported as needing attention each time a command finishes (even a short one), the pane exits, or its output goes quiet. New output alone is not reported. It stays on until turned off.

**Possible arguments**: None

By default bound to `v` in `pane` mode.

```javascript
    bind "a" { WatchPane; }
```

## `WatchPaneByPaneId`

 Like [`WatchPane`](#watchpane), for a specific pane

**Required arguments**: a pane id as a string, eg. `"terminal_1"`, `"plugin_2"` or `"3"` (the same as `"terminal_3"`). It can only be left out inside a [right-click menu](./context-menu.md) item.

```javascript
    bind "a" { WatchPaneByPaneId "terminal_1"; }
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
