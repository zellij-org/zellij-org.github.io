# Shared bindings
There are three special node types that can be used when defining keybindings:

- `shared`: the keybindings are present in all modes
- `shared_except`: the keybindings are present in all modes except the listed ones (here `resize` and `locked`)
- `shared_among`: the keybindings are present only in the listed modes (here `resize` and `locked`)

```javascript
keybinds {
    shared {
        bind "Ctrl g" { SwitchToMode "locked"; }
    }
    shared_except "resize" "locked" {
        bind "Ctrl g" { SwitchToMode "locked"; }
    }
    shared_among "resize" "locked" {
        bind "Ctrl g" { SwitchToMode "locked"; }
    }
}
```

The same node types can be used in the [`mousebinds`](./mouse-bindings.md) block.
