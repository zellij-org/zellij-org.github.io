# Zellij Plugin & Pipe

---

- [Zellij Plugin](#zellij-plugin) - Load a plugin from a local or remote wasm file into a new pane
- [Zellij Pipe](#zellij-pipe) - Send messages and data to one or more plugins, launching them if needed

---

## Zellij Plugin

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

    -h, --help
            Print help information

        --height <HEIGHT>
            The height if the pane is floating as a bare integer (eg. 1) or percent (eg. 10%)

    -i, --in-place
            Open the new pane in place of the current pane, temporarily suspending it

    -s, --skip-plugin-cache
            Skip the memory and HD cache and force recompile of the plugin (good for development)

        --width <WIDTH>
            The width if the pane is floating as a bare integer (eg. 1) or percent (eg. 10%)

    -x, --x <X>
            The x coordinates if the pane is floating as a bare integer (eg. 1) or percent (eg. 10%)

    -y, --y <Y>
            The y coordinates if the pane is floating as a bare integer (eg. 1) or percent (eg. 10%)
```

## Zellij Pipe

Zellij [pipes](./plugin-pipes.md) provide a way to send messages to one or more plugins, launching them on first-message if they are not running.

eg.
```
$ zellij plugin -- https://path/to/my/plugin.wasm
```

**USAGE**:
```
zellij pipe [OPTIONS] [--] <PAYLOAD>

* Send data to a specific plugin:

zellij pipe --plugin file:/path/to/my/plugin.wasm --name my_pipe_name -- my_arbitrary_data

* To all running plugins (that are listening):

zellij pipe --name my_pipe_name -- my_arbitrary_data

* Pipe data into this command's STDIN and get output from the plugin on this command's STDOUT

tail -f /tmp/my-live-logfile | zellij pipe --name logs --plugin https://example.com/my-plugin.wasm | wc -l
    zellij plugin [OPTIONS] [--] <URL>
```

**ARGS**:
```
    <PAYLOAD>    The data to send down this pipe (if blank, will listen to STDIN)
```

**OPTIONS**:
```
    -n, --name <NAME>
            The name of the pipe

    -a, --args <ARGS>
            The args of the pipe

    -p, --plugin <PLUGIN>
            The plugin url (eg. file:/tmp/my-plugin.wasm) to direct this pipe to, if not specified,
            will be sent to all plugins, if specified and is not running, the plugin will be
            launched

    -c, --plugin-configuration <PLUGIN_CONFIGURATION>
            The plugin configuration (note: the same plugin with different configuration is
            considered a different plugin for the purposes of determining the pipe destination)

    -h, --help
            Print help information
```
