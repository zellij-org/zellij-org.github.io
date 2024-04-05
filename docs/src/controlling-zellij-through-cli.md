# Controlling Zellij through the CLI

Zellij can be controlled through the CLI. Meaning that while inside a zellij session, one can issue commands from the terminal to interact with the currently running session.

eg.
```
$ zellij action new-pane
```

Commands can also be issued to a different Zellij session:
```
$ zellij --session pretentious-cat action new-pane
```

For a full list of actions, see [CLI Actions](./cli-actions.md).

For starting commands in a new pane, see [Zellij Run](./zellij-run.md).

For editing a file in a new pane with your own editor, see [Zellij Edit](./zellij-edit.md).

For loading and controlling plugins, see [Zellij Plugin](./zellij-plugin.md) and [Zellij Pipe](./zellij-pipe.md).

### Completions
For convenience, zellij provides cli completions for popular shells.

You can dump these completions to STDOUT and then append them to your shell's configuration file with:

```
$ zellij setup --generate-completion fish
$ zellij setup --generate-completion bash
$ zellij setup --generate-completion zsh
```

These completions also include aliases for running a command in a new pane and editing a file in a new pane:

```bash
$ zr tail -f /path/to/my/file # open a new pane tailing this file
$ zrf htop # open a new floating pane with htop
$ ze ./main.rs # open a new pane with your editor (eg. vim) pointed at ./main.rs
```

See your shell's documentation for information on where to append these.
