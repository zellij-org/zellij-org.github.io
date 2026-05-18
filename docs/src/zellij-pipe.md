# Zellij Pipe

Zellij [pipes](./plugin-pipes.md) provide a way to send messages to one or more plugins, launching them on first-message if they are not running.

eg.
```
$ zellij pipe -- my_arbitrary_data
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
