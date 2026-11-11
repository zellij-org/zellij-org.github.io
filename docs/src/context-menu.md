# The Right-Click Menu

Right-clicking in Zellij opens a menu with actions for what was clicked. There are three menus:

- **pane**: opened by right-clicking inside a pane or on its frame
- **tab**: opened by right-clicking a tab in the tab bar
- **bar**: opened by right-clicking the background of a bar (eg. the tab bar or the status bar)

Items that do the same as a keybinding show that keybinding next to them. Items that do not apply where the menu was opened are left out: for example "Paste" when there is nothing to paste, "Show bars" when no bar is hidden, or "Show titles in a row" outside of a stack.

The menu itself is drawn by a plugin, see [the context-menu alias](./context-menu-alias.md).

## Turning the menu off
The menu is turned off with the [`context_menu_enabled`](./options.md#context_menu_enabled) option:

```javascript
context_menu_enabled false
```

When it is off, right clicks go to the focused pane only, and `Alt` + right click clears the pane group. Plugins can still open the menu through their API.

## Changing the items
The items are set in the `context_menu` block of the [configuration file](./configuration.md). It has one section for each menu (`pane`, `tab` and `bar`), and a `common` section whose items are added to the end of every menu, after a separator.

Without `clear-defaults`, a section changes the default items of its menu with these statements:

| Statement | Effect |
|---|---|
| `item "Label" { actions; }` | replaces the item with that label, or adds the item at the end |
| `item "Label" after="Other" { actions; }` | places the item after the item labeled "Other" (moving it if it already exists) |
| `item "Label" before="Other" { actions; }` | places the item before the item labeled "Other" |
| `separator` | adds a separator line at the end (`after=` and `before=` work here too) |
| `remove "Label"` | removes the item with that label |

`remove` ignores labels that do not exist, and an item placed after or before a label that does not exist goes to the end.

For example, this adds an item to the pane menu after "New floating pane", and removes "Mute pane":

```javascript
context_menu {
    pane {
        item "Edit scrollback" after="New floating pane" { EditScrollback; }
        remove "Mute pane"
    }
}
```

### Replacing the default items
`clear-defaults=true` on a section replaces the default items of that section with the items listed in it. On the whole block, it replaces the default items of every section:

```javascript
context_menu {
    tab clear-defaults=true {
        item "Rename tab…" { StartRenameTabByTabId; }
        separator
        item "Close tab" { CloseTabById; }
    }
}
```

An empty `context_menu clear-defaults=true {}` leaves the menu empty, so it never opens, but Zellij still takes right clicks. To give right clicks back to the panes, use [`context_menu_enabled false`](#turning-the-menu-off) instead.

### Items
An item has a label and one or more [actions](./keybindings-possible-actions.md), the same actions that can be bound to keys. The actions run in order when the item is chosen.

An item can also have a `toggled_label`, shown instead of the label while the thing the item toggles is on. For example, this item shows "Exit fullscreen" while the clicked pane is fullscreen:

```javascript
item "Fullscreen" toggled_label="Exit fullscreen" { ToggleFocusFullscreenByPaneId; }
```

### Actions on the clicked pane or tab
These actions, written without a pane or tab id, apply to the pane or tab that was right-clicked rather than to the focused one:

| Action | Applies to |
|---|---|
| `CloseFocusByPaneId` | the clicked pane |
| `ToggleFocusFullscreenByPaneId` | the clicked pane |
| `TogglePaneEmbedOrFloatingByPaneId` | the clicked pane |
| `TogglePanePinnedByPaneId` | the clicked pane |
| `TogglePaneInGroupByPaneId` | the clicked pane |
| `StartRenamePaneByPaneId` | the clicked pane |
| `MutePaneByPaneId` | the clicked pane |
| `IgnorePaneOutputByPaneId` | the clicked pane |
| `WatchPaneByPaneId` | the clicked pane |
| `PasteFromClipboardByPaneId` | the clicked pane |
| `ToggleStackListOrientationByPaneId` | the stack of the clicked pane |
| `HideBarByPaneId` | the clicked bar |
| `CloseTabById` | the clicked tab |
| `StartRenameTabByTabId` | the clicked tab |
| `MuteTabByTabId` | the clicked tab |
| `MoveTabByTabId "left"` / `MoveTabByTabId "right"` | the clicked tab |
| `MoveTabToPosition "start"` / `MoveTabToPosition "end"` | the clicked tab |

Any other action applies as it would from a keybinding.

### Placeholders in labels
Two kinds of items can have `{}` in their label:

- An item that runs `HideBarByPaneId`: `{}` is replaced by the name of the clicked bar (eg. "Hide {}" becomes "Hide tab bar").
- An item that runs `ToggleSession`: `{}` is replaced by the name of the previous session. Without `{}`, the name is added to the end of the label. The item is left out when there is no previous session.

## The default menu
These are the default items:

```javascript
context_menu {
    pane {
        item "Paste" { PasteFromClipboardByPaneId; }
        separator
        item "New pane" { NewPane; }
        item "New floating pane" { NewFloatingPane; }
        separator
        item "Rename pane…" { StartRenamePaneByPaneId; }
        item "Fullscreen" toggled_label="Exit fullscreen" { ToggleFocusFullscreenByPaneId; }
        item "Make floating" toggled_label="Make tiled" { TogglePaneEmbedOrFloatingByPaneId; }
        item "Show titles in a row" toggled_label="Show titles in a column" { ToggleStackListOrientationByPaneId; }
        separator
        item "Watch pane" toggled_label="Stop watching" { WatchPaneByPaneId; }
        item "Mute pane" toggled_label="Unmute pane" { MutePaneByPaneId; }
        separator
        item "Close pane" { CloseFocusByPaneId; }
    }
    tab {
        item "New tab" { NewTab; }
        item "Rename tab…" { StartRenameTabByTabId; }
        item "Move left" { MoveTabByTabId "left"; }
        item "Move right" { MoveTabByTabId "right"; }
        item "Move to start" { MoveTabToPosition "start"; }
        item "Move to end" { MoveTabToPosition "end"; }
        item "Mute tab" toggled_label="Unmute tab" { MuteTabByTabId; }
        separator
        item "Close tab" { CloseTabById; }
    }
    bar {
        item "New tab" { NewTab; }
        separator
        item "Rename session…" { SwitchToMode "RenameSession"; SessionNameInput 0; }
        item "Back to {}" { ToggleSession; }
        item "Session manager…" {
            LaunchOrFocusPlugin "session-manager" {
                floating true
                move_to_focused_tab true
            }
        }
        item "Open in a Zellij terminal" { OpenSessionInTerminal; }
        separator
        item "Hide {}" { HideBarByPaneId; }
        item "Hide all bars" { HideBars; }
        separator
        item "Detach" { Detach; }
    }
    common {
        item "Show bars" { ShowBars; }
        item "Settings…" {
            LaunchOrFocusPlugin "configuration" {
                floating true
                move_to_focused_tab true
            }
        }
    }
}
```

The "Watch pane" and "Mute pane" items are left out when [`attention`](./inbox.md) is turned off. "Open in a Zellij terminal" is only shown when a [Zellij terminal](./zellij-terminal.md) window can be opened.

## Editing the menu from the settings screen
The items can also be added, removed, changed and reordered in the "Right-click menu" page of the [settings screen](./settings-screen.md). When saved, each changed section is written to the `context_menu` block as changes to its default items, using the statements above. A section that cannot be written that way is written in full, with `clear-defaults=true`.
