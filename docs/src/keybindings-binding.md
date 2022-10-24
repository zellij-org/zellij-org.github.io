# Binding keys
Keys are bound with `bind` instructions inside each mode. A `bind` instruction consists of a list of keys to be bound, as well as a list of actions to be bound to each of those keys.

*Note*: All actions will be performed with no sequential guarantees.

eg.
```javascript
    // bind the Alt-n to open a new pane
    bind "Alt n" { NewPane; }
    // bind both the "h" key and the left-arrow key to move pane focus left
    bind "h" "Left" { MoveFocus "Left"; }
    // bind the "f" key to toggle the focused pane full-screen and switch to normal mode
    bind "f" { ToggleFocusFullscreen; SwitchToMode "Normal"; }
```

# Overriding keys
When configured, keybindings override the default `keybinds` of the application individually (if a certain key was bound in the configuration, it overrides that key in the default configuration).

It's possible to explicitly unbind a key:

```javascript
keybinds {
    unbind "Ctrl g" // unbind in all modes
    normal {
        unbind "Alt h" "Alt n" // unbind one or more keys in a specific mode
    }
}
```

It's also possible to use the special `clear-defaults=true` attribute either globally or in a specific mode:

```javascript
keybinds clear-defaults=true { // will clear all default keybinds
    normal {
        // ...
    }
}
```

```javascript
keybinds {
    normal clear-defaults=true { // will clear all keybinds in normal mode
        // ...
    }
}
```
