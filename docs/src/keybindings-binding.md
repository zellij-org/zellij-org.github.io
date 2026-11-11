# Binding keys
Keys are bound with `bind` instructions inside each mode. A `bind` instruction consists of a list of keys to be bound, as well as a list of actions to be bound to each of those keys.

*Note*: The actions of a key run one after another, in the order they are written. Each action waits for the one before it to finish.

eg. to bind `Alt n` to open a new pane, both the `h` key and the left-arrow key to move pane focus left, and the `f` key to toggle the focused pane full-screen and switch to normal mode:
```javascript
    bind "Alt n" { NewPane; }
    bind "h" "Left" { MoveFocus "Left"; }
    bind "f" { ToggleFocusFullscreen; SwitchToMode "Normal"; }
```

# Overriding keys
When configured, keybindings override the keybindings of the active [keybinding preset](./keybinding-presets.md) individually (if a certain key was bound in the configuration, it overrides that key in the preset).

It's possible to explicitly unbind a key, either in all modes (`unbind` at the top of the block) or in a specific mode (one or more keys):

```javascript
keybinds {
    unbind "Ctrl g"
    normal {
        unbind "Alt h" "Alt n"
    }
}
```

It's also possible to use the special `clear-defaults=true` attribute to drop the keybindings of the preset, either globally (all modes):

```javascript
keybinds clear-defaults=true {
    normal {
        bind "Ctrl g" { SwitchToMode "locked"; }
    }
}
```

or in a specific mode:

```javascript
keybinds {
    normal clear-defaults=true {
        bind "Ctrl g" { SwitchToMode "locked"; }
    }
}
```

Note that when a preset is chosen on the command line (with `zellij options --keybinds-preset`), a `keybinds clear-defaults=true` block in the configuration is ignored completely, so that the chosen preset is used as it is.
