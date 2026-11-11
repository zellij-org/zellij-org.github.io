# The configuration alias

This alias, by default translated to the internal `zellij:configuration` plugin url, is the [settings screen](./settings-screen.md). It is loaded by default with `Ctrl o` + `c`, and by the "Settings…" item of the [right-click menu](./context-menu.md).

Zellij also loads it through this alias to show the [setup screen](./desktop-setup.md#the-setup-screen) when a new session starts.

## Configuration

| Key | Description |
|:----|:------------|
| `page` | Open the settings screen at this page |
| `rerun_setup` | When `true`, open the setup screen instead of the settings |

The `page` values are the page titles in lowercase, with every character other than a letter or a digit replaced by `_`: `general`, `appearance`, `keyboard`, `mouse`, `clipboard_and_selection`, `panes_and_layouts`, `attention`, `notifications`, `sessions`, `zellij_terminal`, `web`, `advanced`, `themes`, `pane_borders`, `key_bindings`, `mouse_bindings`, `right_click_menu` and `plugins_and_environment`.

For example, to bind a key that opens the right-click menu settings:

```javascript
keybinds {
    shared_except "locked" {
        bind "Alt m" {
            LaunchOrFocusPlugin "configuration" {
                floating true
                move_to_focused_tab true
                page "right_click_menu"
            }
        }
    }
}
```

## Contract

Zellij loads this plugin as a floating pane. When showing the setup screen at the start of a session, it passes `is_setup_wizard true`. Zellij has no other expectations from this plugin, but users will probably expect it to change and save their configuration.
