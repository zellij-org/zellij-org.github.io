# Configuring Keybindings

Zellij comes with a default set of keybindings that try to fit as many different users and use cases while trying to maximize comfort for everyone.

It is possible to add to these defaults or even override them with an external configuration. For more information about the configuration file itself, see [Configuration](./configuration.md).

Keybindings can be configured in the `keybinds` block of the file.

See [the default keybindings](https://github.com/zellij-org/zellij/blob/main/zellij-utils/assets/config/default.kdl) as reference for the default keybindings.

```javascript
keybinds {
    // keybinds are divided into modes
    normal {
        // bind instructions can include one or more keys (both keys will be bound separately)
        // bind keys can include one or more actions (all actions will be performed with no sequential guarantees)
        bind "Ctrl g" { SwitchToMode "locked"; }
        bind "Ctrl p" { SwitchToMode "pane"; }
        bind "Alt n" { NewPane; }
        bind "Alt h" "Alt Left" { MoveFocusOrTab "Left"; }
    }
    pane {
        bind "h" "Left" { MoveFocus "Left"; }
        bind "l" "Right" { MoveFocus "Right"; }
        bind "j" "Down" { MoveFocus "Down"; }
        bind "k" "Up" { MoveFocus "Up"; }
        bind "p" { SwitchFocus; }
    }
    locked {
        bind "Ctrl g" { SwitchToMode "normal"; }
    }
}
```
