# Including Configuration in Layouts

Zellij layout files can include any configuration that can be defined in a Zellij [configuration file](./configuration.md).

Items in this configuration take precedence over items in the loaded Zellij configuration.

**Note:** These fields are ignored when loading a layout through the [`new-tab` action](./cli-actions.md#new-tab)

## Example

```javascript
layout {
    pane split_direction="vertical" {
        pane
        pane split_direction="horizontal" {
            pane
            pane
        }
    }
    pane size=1 borderless=true {
        plugin location="compact-bar"
    }
}
keybinds {
    shared {
        bind "Alt 1" { Run "git" "status"; }
        bind "Alt 2" { Run "git" "diff"; }
        bind "Alt 3" { Run "exa" "--color" "always"; }
    }
}
```

This layout includes a map of panes and UI to open, as well as some keybindings to quickly open new panes with your favorite commands.

## Keybindings from a layout

Keybindings that come from a layout are kept apart from those in the configuration file. They are applied on top of the configured keybindings, and are shown in the [settings screen](./settings-screen.md) but cannot be edited there. The `keybinds` block of a layout has the same form as the one in the configuration, including the [keybinding presets](./keybinding-presets.md).

Mouse bindings (the `mousebinds` block, see [mouse bindings](./mouse-bindings.md)) can be included in a layout in the same way.
