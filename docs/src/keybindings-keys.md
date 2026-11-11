# Keys
Keys are defined in a single quoted string, with space delimiting modifier keys.

eg. the individual character `a`, `a` with the ctrl modifier, `a` with the alt modifier, `a` with both the ctrl and alt modifiers, the F8 key and the left arrow key:
```javascript
bind "a" { NewPane; }
bind "Ctrl a" { NewPane; }
bind "Alt a" { NewPane; }
bind "Ctrl Alt a" { NewPane; }
bind "F8" { NewPane; }
bind "Left" { NewPane; }
```

* Possible keys
  - digits or lowercase characters (eg. `a`)
  - function keys 1-12 (eg. `F1`)
  - `Backspace`
  - `Left` (left-arrow key)
  - `Right` (right-arrow key)
  - `Up` (up-arrow key)
  - `Down` (down-arrow key)
  - `Home`
  - `End`
  - `PageUp`
  - `PageDown`
  - `Tab`
  - `Delete` (can also be written as `Del`)
  - `Insert`
  - `Space`
  - `Enter`
  - `Esc`

* Possible modifiers
  - `Ctrl`
  - `Alt`
  - `Shift`
  - `Super`

Inside a [keybinding preset](./keybinding-presets.md#writing-a-preset) file, keys can also use the `{primary}`, `{secondary}` and `{unlock}` placeholders (eg. `"{primary} p"`). These are not supported in the `keybinds` block of the configuration file.

Mouse buttons are bound separately, in the `mousebinds` block. See [Mouse Bindings](./mouse-bindings.md).

## A note about multiple and special modifiers
Some modifiers (eg. `Super`), multiple modifiers (eg. `Ctrl Alt`) as well as certain key combinations require support from the terminal emulator as well. Example of supporting terminals are: `Alacritty`, `WezTerm` and `foot`.
