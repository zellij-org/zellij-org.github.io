# Keys
Keys are defined in a single quoted string, with space delimiting modifier keys.
```kdl
bind "a" // bind the individual character a
bind "Ctrl a" // bind a with the ctrl modifier
bind "Alt a" // bind a with the alt modifier
bind "F8" // bind the F8 key
bind "Left" // bind the left arrow key
```

* Possible keys with the Ctrl modifier:
  - characters (eg. `a`)

* Possible keys with the Alt modifier:
  - characters (eg. `a`)
  - `Left` | `Right` | `Up` | `Down`

* Possible keys without a modifier
  - characters (eg. `a`)
  - `Backspace`
  - `Left`
  - `Right`
  - `Up`
  - `Down`
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
