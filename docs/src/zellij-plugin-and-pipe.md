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
    -b, --borderless <BORDERLESS>
            Start this pane without a border (warning: will make it impossible to move with the
            mouse) [possible values: true, false]

        --border-style <BORDER_STYLE>
            Border line style, eg. "double" or "top:double,left:single,rounded"

        --close-replaced-pane
            Close the replaced pane instead of suspending it (only effective with --in-place)

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

        --no-focus
            Open the plugin pane without changing the focus of any client

        --pinned <PINNED>
            Whether to pin a floating pane so that it is always on top [possible values: true,
            false]

    -s, --skip-plugin-cache
            Skip the plugin cache and force reloading of the plugin (good for development)

        --tab-id <TAB_ID>
            Open the plugin pane in the tab with this id (conflicts with --in-place)

        --width <WIDTH>
            The width if the pane is floating as a bare integer (eg. 1) or percent (eg. 10%)

    -x, --x <X>
            The x coordinates if the pane is floating as a bare integer (eg. 1) or percent (eg. 10%)

    -y, --y <Y>
            The y coordinates if the pane is floating as a bare integer (eg. 1) or percent (eg. 10%)
```

The format of `--border-style` is described under [set-pane-border-style](./cli-actions.md#set-pane-border-style).

## Zellij Pipe

Zellij [pipes](./plugin-pipes.md) provide a way to send messages to one or more plugins, launching them on first-message if they are not running.

eg.
```
$ zellij pipe --name my_pipe_name -- my_arbitrary_data
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

`zellij action pipe` takes more options, for controlling how a launched plugin is opened, including opening it as a popup. See [pipe](./cli-actions.md#pipe) and [Opening Plugins as Popups](./zellij-prompt.md#opening-plugins-as-popups).

### Exit status

`zellij pipe` (and `zellij action pipe`) exits with status `0` once the plugin has handled the message. A plugin can choose a different exit status with the `set_cli_pipe_exit_code` command before it unblocks the pipe, so a script can tell the outcome:

```
$ zellij pipe --plugin file:/path/to/my/plugin.wasm --name check -- my_data && echo "ok"
```

If Zellij reports an error for the pipe, the command exits with status `2`.
