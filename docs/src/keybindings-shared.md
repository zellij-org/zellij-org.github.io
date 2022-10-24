# Shared bindings
There are three special node types that can be used when defining keybindings:

```javascript
keybinds {
    shared {
        // these keybindings will be present in all modes
        bind "Ctrl g" { SwitchToMode "locked"; }
    }
    shared_except "resize" "locked" {
        // these keybindings will be present in all modes except "resize" and "locked"
        bind "Ctrl g" { SwitchToMode "locked"; }
    }
    shared_among "resize" "locked" {
        // these keybindings will be present in the "resize" and "locked" modes
        bind "Ctrl g" { SwitchToMode "locked"; }
    }
}
```
