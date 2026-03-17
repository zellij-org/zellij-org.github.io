# Controlling Zellij through the CLI

Zellij can be controlled through the CLI. Whether inside or outside a zellij session, one can issue commands from the terminal to interact with any session running on the machine.

eg.
```
$ zellij action new-pane
```

Commands can also be issued to a different Zellij session:
```
$ zellij --session pretentious-cat action new-pane
```

---

- [Zellij Run & Edit](./zellij-run-and-edit.md) — Launch commands in new panes or open files in your default editor
- [Zellij Action](./cli-actions.md) — Full reference of all `zellij action` subcommands for controlling panes, tabs, layouts, and more
- [Zellij Plugin & Pipe](./zellij-plugin-and-pipe.md) — Load plugins and send data to them from the command line
- [Zellij Subscribe](./zellij-subscribe.md) — Stream the rendered output of one or more panes to stdout in real time
- [CLI Recipes & Scripting](./cli-recipes.md) — Task-oriented examples and common workflows for scripting with Zellij
- [Programmatic Control](./programmatic-control.md) — Patterns for non-interactive, machine-driven control of Zellij sessions

---

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
