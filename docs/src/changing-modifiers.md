# Changing Modifiers
Zellij uses two different modifiers to distinguish between two main sets of actions.

##### The Primary Modifier (default: `Ctrl`)
This modifier is used to access the different modes (eg. `Pane` and `Tab`). Its exact usage depends on one's [preset](./keybinding-presets.md).

##### The Secondary Modifier (default: `Alt`)
This modifier is used for common shortcuts (eg. `Alt n` to open a new pane or `Alt f` to toggle floating panes).

The modifiers also apply to the [mouse bindings](./mouse-bindings.md#default-mouse-bindings) of the preset. With the primary modifier held, dragging a pane frame resizes the pane, dragging inside a pane draws a new floating pane, and scrolling resizes the pane. With the secondary modifier held, clicking adds a pane to or removes it from the pane group, and scrolling jumps between shell prompts.

## Rebinding Modifiers
Other than [manually configuring](./keybindings.md) keybindings, modifiers can be changed without overriding the current keybindings, with the `primary` and `secondary` attributes of the `keybinds` block:

```javascript
keybinds primary="Ctrl Alt" secondary="Alt" {
}
```

The two values must be different. For the `Unlock-First` preset, the `unlock` attribute changes the key that unlocks the interface (the `Unlock Toggle`) entirely:

```javascript
keybinds preset="unlock-first" unlock="Ctrl a" {
}
```

The same can be done in the [settings screen](./settings-screen.md), under **Keyboard** → **Key bindings and preset…**, accessible with:

* `Ctrl o` + `c` in the default preset
* `Ctrl g` + `o` + `c` in the `Unlock-First` preset

For a single session, the `--keybinds-primary`, `--keybinds-secondary` and `--keybinds-unlock` flags of `zellij options` do the same without changing the configuration file. See [Keybinding Presets](./keybinding-presets.md#leader-keys).

## A note about multiple modifiers
While it's certainly possible to change these modifiers to `Ctrl Alt`, `Super` or even `Ctrl Shift Alt` - these all require the usage of a terminal emulator which itself supports multiple modifiers. Examples include: `Alacritty`, `WezTerm` and `foot`.

Terminals do not report `Super` for mouse events. If a modifier is set to `Super`, the mouse bindings that use it are skipped.
