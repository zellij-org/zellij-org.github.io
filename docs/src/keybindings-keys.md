# Keys
Keys are defined in a single quoted string, with space delimiting modifier keys.
```javascript
bind "a" // bind the individual character a
bind "Ctrl a" // bind a with the ctrl modifier
bind "Alt a" // bind a with the alt modifier
bind "Ctrl Alt a" // bind a with the multiple "ctrl alt" modifier
bind "F8" // bind the F8 key
bind "Left" // bind the left arrow key
```

* Possible keys
  - digits or lowercase characters (eg. `a`)
  - function keys 1-12 (eg. `F1`)
  - `Backspace`
  - `Left` (left-arrow key)
  - `Right` (right-arrow key)
  - `Up` (up-arrow key)
  - `Down` (down-arrow key)
  - `Backspace`
  - `Home`
  - `End`
  - `PageUp`
  - `PageDown`
  - `Tab`
  - `Delete`
  - `Insert`
  - `Space`
  - `Enter`
  - `Esc`

* Possible modifiers
  - `Ctrl`
  - `Alt`
  - `Shift`
  - `Super`

## A note about multiple and special modifiers
Some modifiers (eg. `Super`), multiple modifiers (eg. `Ctrl Alt`) as well as certain key combinations require support from the terminal emulator as well. Example of supporting terminals are: `Alacritty`, `WezTerm` and `foot`.
