# Pipes for Communicating with and Between plugins
## What are pipes?
A Zellij pipe is a unidirectional communication channel to and/or from a plugin. This communication channel is used to send one or more messages containing arbitrary serializable text, similar to how pipes work in most shells.

Pipes can have a name (arbitrary string), a payload (arbitrary stringifiable content) and arguments (a dictionary of arbitrary string to arbitrary string). All of these are optional.

**Pipes that do not have a specific destination are broadcast to all plugins.** The reason for this is in order to facilitate the creation of conventions such as the "notification" pipe that can be handled by multiple different plugins in potentially different ways.

Pipes that do not have a name will be assigned a random UUID as their name.

### Pipe destinations
A pipe destination can be any plugin url (eg. https://example.com/my-plugin.wasm, file:/path/to/plugin.wasm, etc.) coupled with a [plugin configuration](./plugin-api-configuration.md). Two plugins with the same URL and different configurations will each be considered a unique plugin destination.

If a plugin has multiple instances (such as is the case when multiple users are attached to the same session), each instance will receive messages from a pipe directed at this plugin.

If a destination is specified for a pipe and no such plugin is running, this plugin will be loaded on first message (the pipe will wait until it is loaded and then send it the first message - see [backpressure](#cli-pipes-and-backpressure) below).

When started from a plugin, a pipe destination can also be the internal unique Zellij id of a specific plugin. This is to facilitate two-way communication between two plugins - see [Pipe sources](#pipe-sources) below.

### Pipe sources
Pipes can be started either from the CLI, from a keybinding or from another plugin. The source of the pipe will be specified to the plugin (see below). If the source is another plugin, the internal Zellij id of the source plugin will be provided (to allow the plugin to respond in a new pipe if needed).

If the source is the CLI, the internal pipe-id (a UUID) will be provided to allow plugins to apply backpressure to the CLI pipe as needed (for example, pausing a CLI pipeline until the user presses a specific key).

### CLI pipes and backpressure
Pipes can be [started from the CLI](./zellij-pipe.md), in which case they can potentially listen to `STDIN` and send multiple messages down the same pipe. It's important to stress that this is usually slower than piping data to other programs, namely because Zellij plugins often render themselves on each pipe message. The `STDIN` buffer is only released after the plugin has been rendered (or has elected not to render itself) in order to apply backpressure.

Zellij plugins can also elect to entirely block the CLI pipe, releasing it later based on (for example) user input. The same pipe can be blocked/released from any plugin, so long as it knows the CLI pipe ID provided as the [pipe source](#pipe-sources).

A plugin can also print to the CLI pipe's `STDOUT` (unrelated to the data it gets on `STDIN`) assuming it knows its ID. In fact, multiple plugins (or plugin instances) can print to the `STDOUT` of the same pipe if so desired.

For more on this, see [block_cli_pipe_input](./plugin-api-commands.md#block_cli_pipe_input), [unblock_cli_pipe_input](./plugin-api-commands.md#unblock_cli_pipe_input) and [cli_pipe_output](./plugin-api-commands.md#cli_pipe_output).

### The `pipe` lifecycle method
Plugins may listen to pipes by implementing the `pipe` lifecycle method. This method is called every time a message is sent over a pipe to this plugin (whether it's broadcast to all plugins or specifically directed at this one). It receives a `PipeMessage` containing the source of the pipe (CLI, another plugin or a keybinding), as well as information about said source (the plugin id or the CLI pipe id). The `PipeMessage` also contains the name of the pipe (explicitly provided by the user or a random UUID assigned by Zellij), its payload if it has one, its arguments and whether it is private or not (a private message is one directed specifically at this plugin rather than broadcast to all plugins).

Similar to the [update method](./plugin-lifecycle.md#update), the pipe lifecycle method returns a bool, true if it would like to render itself, in which case the render function will be called as normal.

Here's a small Rust example:
```rust
fn pipe(&mut self, pipe_message: PipeMessage) -> bool {
    let mut should_render = false;
    match pipe_message.source {
        PipeSource::Cli(input_pipe_id) => {
            if let Some(payload) = pipe_message.payload {
                self.messages_from_cli.push(payload);
                should_render = true;
            }
            if self.paused {
                // backpressure, this will pause data from the CLI pipeline until the unblock_cli_pipe_input method will be called for this id
                // from this or another plugin
                block_cli_pipe_input(&input_pipe_id);
            }
            if self.should_print_to_cli_stdout {
                // this can happen anywhere, anytime, from multiple plugins and is not tied to data from STDIN
                // as long as the pipe is open, plugins with its ID can print arbitrary data to its STDOUT side, even if the input side is blocked
                cli_pipe_output(input_pipe_id, &payload);
            }
        }
        PipeSource::Plugin(source_plugin_id) => {
            // pipes can also arrive from other plugins
        }
    }
    should_render
}
```

### The `pipe_message_to_plugin` plugin API command
This [`pipe_message_to_plugin` API command](./plugin-api-commands.md#pipe_message_to_plugin) allows plugins to start a new pipe to another plugin. It allows spcifying a pipe destination, name, payload, args and also some information to be used in case this message will end up launching a new plugin (for example, the pane title of the new plugin).

Here's a short Rust example:
```rust
pipe_message_to_plugin(
    MessageToPlugin::new("message_name")
        .with_plugin_url("https://example.com/my-plugin.wasm")
        .new_plugin_instance_should_have_pane_title("new_plugin_pane_title")
);
```
### The special `zellij:OWN_URL` pipe destination
When plugins open pipes, they can use the special `zellij:OWN_URL` destination url. Zellij will replace this URL with the plugin's own URL. This is useful when plugins want to launch new instances of themselves and communicate with them (for example, in order for the plugin to play different roles or to create a visual pipeline with multiple panes on the user's screen).

It's important to remember though that if this is used, care needs to be taken to make sure the new plugin's configuration is different from the currently running one - otherwise Zellij will send this message back to the plugin (see plugin uniqueness above).
