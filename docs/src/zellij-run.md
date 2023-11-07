# Zellij Run

Zellij includes a top-level `run` command that can be used to launch a new Zellij pane running a specific command:

eg.
```
$ zellij run -- git diff
```

**OPTIONS**:
```
    -c, --close-on-exit            Close the pane immediately when its command exits
        --cwd <CWD>                Change the working directory of the new pane
    -d, --direction <DIRECTION>    Direction to open the new pane in
    -f, --floating                 Open the new pane in floating mode
    -h, --help                     Print help information
    -i, --in-place                 Open the new pane in place of the current pane, temporarily suspending it
    -n, --name <NAME>              Name of the new pane
    -s, --start-suspended          Start the command suspended, only running after you first presses
                                   ENTER
```

**Note**: to shorten this command to a more friendly length, see `Completions` under: [CLI](./controlling-zellij-through-cli.md#completions)

This new pane will not immediately close when the command exits. Instead, it will show its exit status on the pane frame and allow users to press `<ENTER>` to re-run the command inside the same pane, or `<Ctrl-c>` to close the pane.

We feel this is a new and powerful way to interact with the command line.

![command-pane](img/command-pane-screenshot.png)
