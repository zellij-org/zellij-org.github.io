# The status-bar alias

This alias, by default translated to the internal `zellij:bars` plugin url with the `role "status-bar"` configuration, represents the status-bar loaded in the default layout on the bottom of the screen. The `zellij:status-bar` plugin url works as well (see [The `bars` plugin](./plugin-aliases.md#the-bars-plugin)).

## Features

- Shows the current input mode and the keys available in it
- The key hints can be clicked to run their action, and are highlighted when hovered with the mouse
- Right-clicking the bar opens the [right-click menu](./context-menu.md)
- Can be hidden and shown again while Zellij runs, see [Hiding the bars](./tab-bar-alias.md#hiding-the-bars)

## Configuration

| Key | Description |
|:----|:------------|
| `role` | `status-bar` |
| `classic` | When `true`, show the classic status bar, used with a height of `2` in the `classic` layout |

## Contract
Zellij loads this status bar with a height of `1` (or `2` with `classic true`, as in the `classic` layout) and a width the size of the user's full screen. Zellij has no other expectations from this plugin, even though users will probably expect at least the input modes and their status be shown.
