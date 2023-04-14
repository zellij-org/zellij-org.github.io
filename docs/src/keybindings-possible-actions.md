# Possible Actions
  - `Clear` - clear the scrollback buffer of the focused pane

    **Possible arguments**: None

    eg.
    ```javascript
        bind "a" { Clear; }
    ```
  - `CloseFocus` - close the focused pane

    **Possible arguments**: None

    eg.
    ```javascript
        bind "a" { CloseFocus; }
    ```
  - `CloseTab` - close the focused tab

    **Possible arguments**: None

    eg.
    ```javascript
        bind "a" { CloseTab; }
    ```
  - `Detach` - detach from the current session, leaving it running in the background

    **Possible arguments**: None

    eg.
    ```javascript
        bind "a" { Detach; }
    ```
  - `DumpScreen` - dump the contents of the focused pane, including its entire scrollback, to the specified file.

    **Required arguments**: A path to a file on the hard-drive

    eg.
    ```javascript
        bind "a" { DumpScreen "/tmp/my-dump.txt"; }
    ```
  - `EditScrollback` - edit the scrollback of the currently focused pane with the user's default editor.

    **Possible arguments**: None

    ```javascript
        bind "a" { EditScrollback; }
    ```
  - `FocusNextPane` - change focus to the next pane (order not guaranteed)

    **Possible arguments**: None

    ```javascript
        bind "a" { FocusNextPane; }
    ```
  - `FocusPreviousPane` - change focus to the previous pane (order not guaranteed)

    **Possible arguments**: None

    ```javascript
        bind "a" { FocusPreviousPane; }
    ```
  - `GoToNextTab` - change focus to the next tab

    **Possible arguments**: None

    ```javascript
        bind "a" { GoToNextTab; }
    ```
  - `GoToPreviousTab` - change focus to the previous tab

    **Possible arguments**: None

    ```javascript
        bind "a" { GoToPreviousTab; }
    ```
  - `GoToTab` - change focus to a tab with a specific index

    **Required arguments**: numeric tab index (eg. 1)

    ```javascript
        bind "a" { GoToTab 1; }
    ```
  - `HalfPageScrollDown` - scroll the focused pane half a page down

    **Possible arguments**: None

    ```javascript
        bind "a" { HalfPageScrollDown; }
    ```
  - `HalfPageScrollUp` - scroll the focused pane half a page up

    **Possible arguments**: None

    ```javascript
        bind "a" { HalfPageScrollUp; }
    ```
  - `MoveFocus` - move focus in a specific direction

    **Required arguments**: `Left` | `Right` | `Up` | `Down`

    ```javascript
        bind "a" { MoveFocus "Left"; }
    ```
  - `MoveFocusOrTab` - move focus left or right, or to the next or previous tab if on screen edge

    **Required arguments**: `Left` | `Right`

    ```javascript
        bind "a" { MoveFocusOrTab "Left"; }
    ```
  - `MovePane` - move the position of the focused pane in the specific direction

    **Required arguments**: `Left` | `Right` | `Up` | `Down`

    ```javascript
        bind "a" { MovePane "Left"; }
    ```
  - `NextSwapLayout` - change the layout of the current tab (either tiled or floating) to the next one

    **Possible arguments**: None

    ```javascript
        bind "a" { NextSwapLayout; }
    ```
  - `NewPane` - open a new pane (in the specified direction)

    **Possible arguments**: `Down` | `Right`

    **Behaviour without arguments**: Opens a pane in the largest available space or if floating panes are visible, in the next floating pane position.

    ```javascript
        bind "a" { NewPane "Right"; }
    ```
  - `NewTab` - open a new tab

    **Possible arguments**: `cwd` - current working directory for the new tab, `name` - the name of the new tab, `layout` - path to the layout file to load for this tab

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
  - `PageScrollDown` - scroll the focused pane one page down

    **Possible arguments**: None

    ```javascript
        bind "a" { PageScrollDown; }
    ```

  - `PageScrollUp` - scroll the focused pane one page up

    **Possible arguments**: None

    ```javascript
        bind "a" { PageScrollUp; }
    ```
  - `PreviousSwapLayout` - change the layout of the current tab (either tiled or floating) to the previous one

    **Possible arguments**: None

    ```javascript
        bind "a" { PreviousSwapLayout; }
    ```
  - `Quit` - quit Zellij :(

    **Possible arguments**: None

    ```javascript
        bind "a" { Quit; }
    ```
  - `Resize` - resize the focused pane either in the specified direction or increase/decrease its size automatically

    **Required arguments**: `Left` | `Right` | `Up` | `Down` | `Increase` | `Decrease`

    ```javascript
        bind "a" { Resize "Increase"; }
    ```
  - `Run` - run the specified command

    **Required arguments**: The command to run, followed by optional arguments

    **Possible arguments**: `cwd` - current working directory, `direction` - the direction to open the new command pane

    ```javascript
        // will run "tail -f /tmp/foo" in a pane opened below the focused one
        bind "a" {
            Run "tail" "-f" "foo" {
                cwd "/tmp"
                direction "Down"
            }
        }
    ```
  - `ScrollDown` - scroll the focused pane down 1 line

    **Possible arguments**: None

    ```javascript
        bind "a" { ScrollDown; }
    ```
  - `ScrollToBottom` - scroll the focused pane completely down

    **Possible arguments**: None

    ```javascript
        bind "a" { ScrollToBottom; }
    ```
  - `ScrollUp` - scroll the focused pane up 1 line

    **Possible arguments**: None

    ```javascript
        bind "a" { ScrollUp; }
    ```
  - `ScrollToTop` - scroll the focused pane completely up

    **Possible arguments**: None

    ```javascript
        bind "a" { ScrollToTop; }
    ```
  - `Search` - when searching, move to the next or previous search occurrence

    **Required arguments**: "down" | "up"

    ```javascript
        bind "a" { Search "up"; }
    ```

  - `SearchToggleOption` - toggle various search options on/off

    **Required arguments**: "CaseSensitivity" | "Wrap" | "WhileWord"

    ```javascript
        bind "a" { SearchToggleOption "CaseSensitivity"; }
    ```

  - `SwitchToMode` - switch the current input mode

    **Required arguments**: See [Modes](#modes)

    ```javascript
        bind "a" { SwitchToMode "locked"; }
    ```

  - `ToggleActiveSyncTab` - toggle the syncing of input between all panes in the focused tab

    **Possible arguments**: None

    ```javascript
        bind "a" { ToggleActiveSyncTab; }
    ```

  - `ToggleFloatingPanes` - show/hide floating panes; if none are open, one will be opened

    **Possible arguments**: None

    ```javascript
        bind "a" { ToggleFloatingPanes; }
    ```

  - `ToggleFocusFullscreen` - toggle the focused pane as fullscreen on/off

    **Possible arguments**: None

    ```javascript
        bind "a" { ToggleFocusFullscreen; }
    ```

  - `ToggleMouseMode` - toggle mouse support on/off

    **Possible arguments**: None

    ```javascript
        bind "a" { ToggleMouseMode; }
    ```

  - `TogglePaneEmbedOrFloating` - float focused embedded pane or embed focused floating pane

    **Possible arguments**: None

    ```javascript
        bind "a" { TogglePaneEmbedOrFloating; }
    ```

  - `TogglePaneFrames` - show/hide the frames around panes (notice, these might have valuable UX info)

    **Possible arguments**: None

    ```javascript
        bind "a" { TogglePaneFrames; }
    ```

  - `ToggleTab` - change the tab focus

    **Possible arguments**: None

    ```javascript
        bind "a" { ToggleTab; }
    ```

  - `UndoRenamePane` - undo a rename pane operation currently in progress (reverting to the previous name)

    **Possible arguments**: None

    ```javascript
        bind "a" { UndoRenamePane; }
    ```

  - `UndoRenameTab` - undo a rename tab operation currently in progress (reverting to the previous name)

    **Possible arguments**: None

    ```javascript
        bind "a" { UndoRenameTab; }
    ```

  - `Write` - write bytes to the active pane

    **Required arguments**: the bytes to write as integers

    ```javascript
        bind "a" { Write 102 111 111; }
    ```

  - `WriteChars` - write a string of characters to the active pane

    **Required arguments**: the string of characters to write

    ```javascript
        bind "a" { WriteChars "hi there!"; }
    ```
