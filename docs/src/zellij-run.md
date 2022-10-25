# Zellij Run

Zellij includes a top-level `run` command that can be used to launch a new Zellij pane running a specific command:

eg.
```
$ zellij run -- git diff
```

**OPTIONS**:
```
    --cwd <CWD>
    -d, --direction <DIRECTION>
    -f, --floating
    -n, --name <NAME>
```

**Note**: to shorten this command to a more friendly length, see `Completions` under: [CLI](./controlling-zellij-through-cli.md#completions)

This new pane will not immediately close when the command exits. Instead, it will show its exit status on the pane frame and allow users to press `<ENTER>` to re-run the command inside the same pane, or `<Ctrl-c>` to close the pane.

We feel this is a new and powerful way to interact with the command line.

![command-pane](img/command-pane-screenshot.png)
