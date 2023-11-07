# Zellij Plugin

Zellij includes a top-level `plugin` cli command that can be used to launch a new Zellij plugin instance from a local or remote wasm file

eg.
```
$ zellij plugin -- https://path/to/my/plugin.wasm
```

**USAGE**:
```
    zellij plugin [OPTIONS] [--] <URL>
```

**ARGS**:
```
    <URL>    Plugin URL, can either start with http(s), file: or zellij:
```

**OPTIONS**:
```
    -c, --configuration <CONFIGURATION>
            Plugin configuration

    -f, --floating
            Open the new pane in floating mode

    -i, --in-place
            Open the new pane in place of the current pane, temporarily suspending it
```
