# Configuring Keybindings

Zellij comes with a default set of keybindings that try to fit as many different users and use cases while trying to maximize comfort for everyone.

It is possible to add to these defaults or even override them with an external configuration. For more information about the file, see [Configuration](./configuration.md).

The structure of the `keybinds` section of the file is as follows:
```
keybinds:
    normal:
        - action: []
          key: []
```

Under the main `keybinds` section one can list the new bindings they'd like to add grouped under the different [Modes](keybindings-modes.md) (`normal` in this example).
The [`action`](./keybindings-actions.md) is a sequence of one or more instructions sent to Zellij through this keybinding. The [`key`](keybindings-keys.md) is a list of one or more keys, any one of them alone would trigger the sequence of actions.

For example:
```
keybinds:
    normal:
        - action: [ NewTab, GoToTab: 1,]
          key: [ Char: 'c',]
```
Will create a new tab and then switch to tab number 1 on pressing the
`c` key.
Whereas:
```
keybinds:
    normal:
        - action: [ NewTab,]
          key: [ Char: 'c', Char: 'd',]
```
Will create a new tab on pressing either the `c` or the `d` key.

## To unbind the default Keybindings

The default keybinds can be unbound either for a specific mode, or for every mode. It supports either a list of keybinds, or a bool indicating that every keybind should be unbound:

```
keybinds:
    unbind: true
```

Will unbind every default binding.

```
keybinds:
    unbind: [ Ctrl: 'p']
```

Will unbind every default `^P` binding for each mode.

```
keybinds:
    normal:
        - unbind: true
```

Will unbind every default keybind for the normal mode.
```
keybinds:
    normal:
        - unbind: [ Alt: 'n', Ctrl: 'g']
```
Will unbind every default keybind for `n` and `^g` for the normal mode.

## Example
This configuration can be used to configure Zellij's default keybindings: [default.yaml](https://github.com/zellij-org/zellij/blob/main/example/default.yaml)
