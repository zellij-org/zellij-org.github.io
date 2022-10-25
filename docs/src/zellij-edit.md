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
    -d, --direction <DIRECTION>
    -f, --floating
    -l, --line-number <LINE_NUMBER>
```

**Note**: The default editor is anything set in `$EDITOR` or `$VISUAL` - alternatively, it can be set explicitly with the [`scrollback_editor` configuration option](./options.md#scrollback_editor).

**Another Note**: To shorten this command, see [Cli Completions](./controlling-zellij-through-cli.md#completions)
