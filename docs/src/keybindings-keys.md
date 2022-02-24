# Keys

These are the possible keys and key combinations one can set in the
[Keybindings configuration](./keybindings.md).
For more information, please see:
[https://docs.rs/termion/1.5.6/termion/event/enum.Key.html](https://docs.rs/termion/1.5.6/termion/event/enum.Key.html)

Or some related Github Issues:

- [#351](https://github.com/zellij-org/zellij/issues/351)
- [#357](https://github.com/zellij-org/zellij/issues/357)

There's a table with an overview of valid key combinations at the bottom of
this page.


## `Char: <character>`
A single character with no modifier, eg. `Char: 'f'`

**Note:** Please also refer to the table at the bottom of this page

## `Alt: <character>`
A single character preceded by the `Alt` modifier, eg. `Alt: 'f'`.

**Note:** Please also refer to the table at the bottom of this page

## `Ctrl: <character>`
A single character preceded by the `Ctrl` modifier, eg. `Ctrl: 'f'`.

**Note:** Please also refer to the table at the bottom of this page

## `F: <1-12>`
One of the `F` characters (usually at the top of the keyboard). eg. `F: 11`

## `Backspace`
The Backspace key.

## `Left` / `Right` / `Up` / `Down`
The arrow keys on the keyboard.

## `Home`
The home key.

## `End`
The End key.

## `PageUp` / `PageDown`
The PageUp or PageDown keys.

## `BackTab`
The backward Tab key.

## `Delete`
The delete key.

## `Insert`
The insert key.

## `Esc`
The Esc key.


# Valid character combinations

Following is a table that gives an overview of all the possible character
combinations available for keybindings.

**Note that combining any of the `Ctrl`, `Alt` or `Char` bindings with the
special keys mentioned above isn't possible.**


| Keys       | `Ctrl: ' '` | `Alt: ' '` | `Char: ' '` |
| :--------: | :---------: | :--------: | :---------: |
| `a-z`      | yes | yes | yes |
| `A-Z`      | no  | yes | yes |
| `0-9`      | no  | yes | yes |
| Space      | no  | yes | yes |
| Tab        | no  | yes | yes |
| `.:,;-_!?` | no  | yes | yes |
| `'"#$%&()` | no  | yes | yes |
| `*+/<=>@\` | no  | yes | yes |
| `[]^_\|{}~` | no  | yes | yes |
| `äöüß`     | no  | yes | yes |

