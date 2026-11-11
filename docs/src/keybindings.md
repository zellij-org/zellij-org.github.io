# Configuring Keybindings

Zellij comes with a default set of keybindings that try to fit as many different users and use cases while trying to maximize comfort for everyone.

The keybindings come from a [keybinding preset](./keybinding-presets.md): a file that holds a full set of keybindings (and [mouse bindings](./mouse-bindings.md)). Zellij has two built-in presets, `default` and `unlock-first`. The preset to use, and its leader keys, are chosen with attributes of the `keybinds` block.

It is possible to add to the keys of the preset or even override them with an external configuration. For more information about the configuration file itself, see [Configuration](./configuration.md).

Keybindings can be configured in the `keybinds` block of the file. Bindings inside the block are applied on top of the preset.

See [the default preset](https://github.com/zellij-org/zellij/blob/main/zellij-utils/assets/keybinds/default.kdl) as reference for the default keybindings, or print it with `zellij setup --dump-keybinds default`.

```javascript
keybinds preset="default" primary="Ctrl" secondary="Alt" {
    normal {
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

Keybindings are divided into [modes](./keybindings-modes.md). A `bind` instruction can include one or more keys (each key is bound separately) and one or more actions. The actions of a key run one after another, in the order they are written.

Keybindings can also be changed from the [settings screen](./settings-screen.md), under **Keyboard** → **Key bindings and preset…**.
