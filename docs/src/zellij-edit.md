# Zellij Edit

It's possible to open your default editor pointed at a file in a new Zellij pane.

This can be useful to save time instead of opening a new pane and starting your default editor inside it manually.

eg.
```bash
$ zellij edit ./main.rs # open main.rs in a new pane
$ zellij edit --floating ./main.rs # open main.rs in a new floating pane
$ zellij edit ./main.rs --line-number 10 # open main.rs pointed at line number 10
```

**Possible Options**:
```
        --cwd <CWD>                    Change the working directory of the editor
    -d, --direction <DIRECTION>        Direction to open the new pane in
    -f, --floating                     Open the new pane in floating mode
    -h, --help                         Print help information
        --height <HEIGHT>              The height if the pane is floating as a bare integer (eg. 1)
                                       or percent (eg. 10%)
    -i, --in-place                     Open the new pane in place of the current pane, temporarily
                                       suspending it
    -l, --line-number <LINE_NUMBER>    Open the file in the specified line number
        --width <WIDTH>                The width if the pane is floating as a bare integer (eg. 1)
                                       or percent (eg. 10%)
    -x, --x <X>                        The x coordinates if the pane is floating as a bare integer
                                       (eg. 1) or percent (eg. 10%)
    -y, --y <Y>                        The y coordinates if the pane is floating as a bare integer
                                       (eg. 1) or percent (eg. 10%)
```

**Notes**:
* This command is a shorthand of `zellij action edit`
* To shorten this command to an even more friendly length, see `Completions` under: [CLI](./controlling-zellij-through-cli.md#completions)
* The default editor is anything set in `$EDITOR` or `$VISUAL` - alternatively, it can be set explicitly with the [`scrollback_editor` configuration option](./options.md#scrollback_editor).
