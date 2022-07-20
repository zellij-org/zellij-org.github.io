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



## Allowing specific commands in Locked mode

Locked mode is very handy when working with applications that use the same
keybindings as zellij. That is because, by default, in locked mode all
keystrokes (except to leave locked mode) are passed directly to the
application.

When you use Locked mode often, e.g. to work in `vim`, you may find that
sometimes it is impractical to:

1. First have to leave locked mode in order to switch to another pane with e.g.
   `Alt + <hjkl>`,
2. Work inside this pane e.g. to enter a new command, and then
3. Switch back to the previous pane and enter locked mode again.

If you often find yourself in a situation like this, you can alleviate this
problem by adding keybindings to locked mode.
What makes locked mode special is merely the fact that, in the default
configuration, it only has a single keybinding assigned: To switch back to
normal mode. Hence, all other keybindings are passed through to the application
in the pane. If you want to be able to e.g. move around panes in locked mode,
you can extend this snippet of the config:

```yaml
    locked:
        - action: [SwitchToMode: Normal,]
          key: [Ctrl: 'g',]
```

to look like this:

```yaml
    locked:
        - action: [SwitchToMode: Normal,]
          key: [Ctrl: 'g',]
        - action: [MoveFocusOrTab: Left,]
          key: [ Alt: 'h', Alt: Left]
        - action: [MoveFocusOrTab: Right,]
          key: [ Alt: 'l', Alt: Right ]
        - action: [MoveFocus: Down,]
          key: [ Alt: 'j', Alt: Down]
        - action: [MoveFocus: Up,]
          key: [ Alt: 'k', Alt: Up, ]
```

There are no limits to the keybindings you can add to locked mode. Just keep in
mind that, due do the purpose of this input mode, you will not get any key
hints in the status bar.



[10]: https://docs.rs/zellij-tile/latest/zellij_tile/data/enum.InputMode.html
[20]: https://docs.rs/zellij-utils/latest/zellij_utils/input/actions/enum.Action.html#variant.Run
[21]: https://docs.rs/zellij-utils/latest/zellij_utils/input/command/struct.RunCommandAction.html
