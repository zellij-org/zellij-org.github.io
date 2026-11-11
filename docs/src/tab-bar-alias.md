# The tab-bar Alias

This alias, by default translated to the internal `zellij:bars` plugin url with the `role "tab-bar"` configuration, represents the tab bar loaded on the top line of the default layout. The `zellij:tab-bar` plugin url works as well (see [The `bars` plugin](./plugin-aliases.md#the-bars-plugin)).

## Features

- Shows the tabs and the session name
- Clicking a tab switches to it, and dragging a tab moves it to another position
- Double-clicking a tab renames it, and double-clicking the empty part of the bar opens a new tab
- Shows a symbol next to a tab whose panes need attention, and a session indicator counting what needs you across all sessions (eg. `◉ 2 need you · 1 running`). Clicking the indicator opens the [inbox](./inbox.md)
- Right-clicking a tab or the bar opens the [right-click menu](./context-menu.md)

## Configuration

| Key | Description |
|:----|:------------|
| `role` | `tab-bar` (the default when no role is given) |
| `double_click_tab` | `"none"` turns off renaming a tab with a double-click |
| `double_click_empty` | `"none"` turns off opening a new tab with a double-click on the empty part of the bar |

```javascript
plugins {
    tab-bar location="zellij:bars" {
        role "tab-bar"
        double_click_tab "none"
    }
}
```

## Hiding the bars

Bars can be hidden and shown again while Zellij runs:

- `Ctrl p` + `Shift z` (the `ToggleBars` action) hides all bars, or shows them again if any are hidden
- The right-click menu of a bar has "Hide ..." for that bar and "Hide all bars", and every right-click menu has "Show bars" while a bar is hidden
- `zellij action hide-bars [BARS]...`, `zellij action show-bars` and `zellij action toggle-bars [BARS]...`, where a bar is named `tab-bar`, `status-bar`, `compact-bar`, a plugin alias or location, or `all`

The `bars_hidden_on_start`, `hidden_bars_notification` and `mode_hints_when_bars_hidden` [options](./options.md) choose which bars a new session starts with hidden, whether a short note is shown when bars are hidden, and whether the keys of a mode are shown in a corner while the status bar is hidden.

## Contract
Zellij loads this tab bar with a height of `1` and a width the size of the user's full screen. Zellij has no other expectations from this plugin, even though users will probably expect at least the tabs to be shown.

A bar plugin can give its space in the layout back while it has nothing to draw.
