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
        plugin location="zellij:compact-bar"
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
