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

```rust
pub enum PipeSource {
    Cli(String),
    Plugin(u32),
    Keybind,
    PromptRequest {
        caller_plugin_id: u32,
        request_id: u64,
    },
}
```

| Variant | Description |
|---------|-------------|
| `Cli(pipe_id)` | The pipe comes from `zellij pipe` (or `zellij action pipe`); `pipe_id` identifies the CLI pipe |
| `Plugin(plugin_id)` | The pipe comes from another plugin |
| `Keybind` | The pipe comes from a keybinding |
| `PromptRequest { caller_plugin_id, request_id }` | A question asked by a plugin with [`prompt`](./plugin-api-commands.md#prompt). These are only sent to the built-in `zellij:prompt` plugin, which answers with [`reply_to_prompt`](./plugin-api-commands.md#reply_to_prompt). Plugins built against `0.45` never receive this source |

### CLI pipes and backpressure
Pipes can be [started from the CLI](./zellij-plugin-and-pipe.md#zellij-pipe), in which case they can potentially listen to `STDIN` and send multiple messages down the same pipe. It's important to stress that this is usually slower than piping data to other programs, namely because Zellij plugins often render themselves on each pipe message. The `STDIN` buffer is only released after the plugin has been rendered (or has elected not to render itself) in order to apply backpressure.

Zellij plugins can also elect to entirely block the CLI pipe, releasing it later based on (for example) user input. The same pipe can be blocked/released from any plugin, so long as it knows the CLI pipe ID provided as the [pipe source](#pipe-sources).

A plugin can also print to the CLI pipe's `STDOUT` (unrelated to the data it gets on `STDIN`) assuming it knows its ID. In fact, multiple plugins (or plugin instances) can print to the `STDOUT` of the same pipe if so desired.

A plugin can also choose the exit code of the `zellij pipe` command with [set_cli_pipe_exit_code](./plugin-api-commands.md#set_cli_pipe_exit_code), which is used once the pipe is released. This lets scripts tell whether the plugin accepted their input.

If the plugin handling a CLI pipe message crashes, the pipe is released right away, so the `zellij pipe` command does not wait forever.

For more on this, see [block_cli_pipe_input](./plugin-api-commands.md#block_cli_pipe_input), [unblock_cli_pipe_input](./plugin-api-commands.md#unblock_cli_pipe_input), [cli_pipe_output](./plugin-api-commands.md#cli_pipe_output) and [set_cli_pipe_exit_code](./plugin-api-commands.md#set_cli_pipe_exit_code).

### Opening the destination plugin as a popup
When a CLI pipe launches its destination plugin, `zellij action pipe --popup <placement>` opens that plugin as a popup for the user looking at the pane the command runs in, instead of as a pane. The placement is one of `pane`, `center`, `mouse`, `cursor`, `top-left`, `top-right`, `bottom-left` or `bottom-right`. `--popup-no-focus` opens it as an information popup that does not take key focus, `--popup-capture-all-keys` sends it every key (including the ones bound to Zellij actions), and `--popup-outside-click block|close` chooses what a click outside it does. These options are available on `zellij action pipe` (not on the shorter `zellij pipe`). See [`zellij pipe`](./zellij-plugin-and-pipe.md#zellij-pipe).

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
                if self.should_print_to_cli_stdout {
                    cli_pipe_output(&input_pipe_id, &payload);
                }
                self.messages_from_cli.push(payload);
                should_render = true;
            }
            if self.paused {
                block_cli_pipe_input(&input_pipe_id);
            }
        },
        PipeSource::Plugin(source_plugin_id) => {
            self.messages_from_plugins.push(source_plugin_id);
        },
        PipeSource::Keybind | PipeSource::PromptRequest { .. } => {},
    }
    should_render
}
```

In this example, a paused plugin blocks the CLI pipe, which applies backpressure: no more data comes from the CLI pipeline until [unblock_cli_pipe_input](./plugin-api-commands.md#unblock_cli_pipe_input) is called for this id, from this or another plugin. Printing to the pipe's `STDOUT` can happen at any time, from several plugins, and does not depend on the input side: as long as the pipe is open, plugins that know its id can print to it, even while its input is blocked.

[Shared plugins](./plugin-lifecycle.md#shared-plugins) implement `pipe` with an extra `EventContext` argument and return a `RenderResponse` instead of a `bool`.

### The `pipe_message_to_plugin` plugin API command
This [`pipe_message_to_plugin` API command](./plugin-api-commands.md#pipe_message_to_plugin) allows plugins to start a new pipe to another plugin. It allows specifying a pipe destination, name, payload, args and also some information to be used in case this message will end up launching a new plugin (for example, the pane title of the new plugin).

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

### The settings screen pipe message
A plugin that registered a [settings screen entry](./plugin-api-commands.md#register_settings_entry) receives a pipe message named `"zellij:open_plugin_settings"` (the `OPEN_PLUGIN_SETTINGS_MESSAGE` constant) from the settings screen when the user selects the entry. Its `client_id` argument (the `OPEN_PLUGIN_SETTINGS_CLIENT_ID_ARG` constant) holds the id of the user who selected it.
