# The compact-bar alias

This alias, by default translated to the internal `zellij:bars` plugin url with the `role "compact-bar"` configuration, represents the compact-bar loaded in the compact layout on the bottom of the screen. The `zellij:compact-bar` plugin url works as well (see [The `bars` plugin](./plugin-aliases.md#the-bars-plugin)).

## Features

- Shows the current input mode, the tabs and the session name on one line
- Tabs can be clicked, dragged to reorder them and double-clicked to rename them, as in the [tab bar](./tab-bar-alias.md)
- Shows the session indicator and the attention symbols of the [inbox](./inbox.md)
- Can show the keys of the current mode in a tooltip, toggled with a key of your choice
- Can be hidden and shown again while Zellij runs, see [Hiding the bars](./tab-bar-alias.md#hiding-the-bars)

## Configuration

| Key | Description |
|:----|:------------|
| `role` | `compact-bar` |
| `tooltip` | A key that shows and hides a tooltip with the keys of the current mode, eg. `"F1"` |
| `double_click_tab` | `"none"` turns off renaming a tab with a double-click |
| `double_click_empty` | `"none"` turns off opening a new tab with a double-click on the empty part of the bar |

When changing the alias, keep the `role`: `zellij:bars` without a role draws a tab bar.

```javascript
plugins {
    compact-bar location="zellij:bars" {
        role "compact-bar"
        tooltip "F1"
    }
}
```

## Contract
Zellij loads this compact bar with a height of `1` and a width the size of the user's full screen. Zellij has no other expectations from this plugin, even though users will probably expect at least the input mode and the tabs be shown.
