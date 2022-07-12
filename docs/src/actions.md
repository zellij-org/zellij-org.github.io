# Actions

Actions are assigned to key sequences through the [keybinding
configuration](./keybindings.md). All actions are documented in the code,
viewable [on docs.rs](https://docs.rs/zellij-utils/latest/zellij_utils/input/actions/enum.Action.html),
along with how these actions translate (serialize) to the configuration file.

In addition, actions can be invoked with the `zellij action` command.

Here you fill find some examples for actions that can be bound to keys, as well
as ways to combine/chain actions together.



## Switching Input Modes

[Input modes](./keybindings-modes.md) can be switched with the `SwitchToMode`
action. Beyond what is documented here, you will find additional input modes
[on docs.rs][10].

The default configuration already contains keybindings to switch to all the
input modes. When defining your own custom keybindings, you can choose whether
you want to enter a different input mode like this:

```yaml
- action: [NewPane: , SwitchToMode: Pane]
  key: [...]
```

This will create a new pane and switch to `Pane` input mode immediately
afterwards.

Likewise, by default the key combination `Ctrl + p, x` will close the focused
pane and switch to `Normal` input mode. If you change the keybinding from:

```yaml
- action: [CloseFocus, SwitchToMode: Normal,]
  key: [Char: 'x',]
```

to

```yaml
- action: [CloseFocus,]
  key: [Char: 'x',]
```

the focused pane is closed, but you remain in the `Pane` input mode.



## Running commands on key presses

The [`Run` action][20] allows you to execute arbitrary commands upon
key presses. The argument is of type [`RunCommandAction`][21] and constructed
like this:

```yaml
{
    cmd: "bash",
    args: ["-c", "ls"],
    cwd: ,
    direction: Right,
}
```

This will create a new pane to the right of the focused pane, stay in the
current working directory and run `bash -c ls` on the host.

When running commands like this it is important to keep in mind that once the
command exits, the pane will close itself immediately. Hence, if we wrote `cmd:
"ls", args: [], ...` instead, the `ls` command is executed, terminates and the
pane is closed afterwards.

Here's an example that spawns a new pane running `htop` when pressing `Alt +
t`:

```yaml
- action: [Run: {cmd: "htop", args: [], cwd: , direction: },]
  key: [Alt: 't',]
```



[10]: https://docs.rs/zellij-tile/latest/zellij_tile/data/enum.InputMode.html
[20]: https://docs.rs/zellij-utils/latest/zellij_utils/input/actions/enum.Action.html#variant.Run
[21]: https://docs.rs/zellij-utils/latest/zellij_utils/input/command/struct.RunCommandAction.html
