# The filepicker alias

This alias, by default translated to the internal `zellij:strider` plugin url with the `cwd "/"` configuration, is used by various plugins to allow users to traverse their filesystem and select files or folders for various purposes.

For example, the [session-manager](./session-manager-alias.md) and [welcome-screen](./welcome-screen-alias.md) use the filepicker to allow users to choose the working directory for the new session they would like to start.

## Contract
Zellij loads the filepicker using a [pipe](./plugin-pipes.md). It sends it a private message with the `filepicker` message name.

### If the message originates from another plugin
Zellij expects the filepicker to:
1. Open a new pipe with the originating plugin's ID (it receives this ID as part of the `PipeMessage`) as its destination.
2. The message name should be `filepicker_result`
3. The message `args` should be the same args sent in the original message (if any).
4. The message payload should be the path the user chose as clear text.

### If the message originates from the CLI
Zellij expects the filepicker to:
1. Block the CLI pipe input to give the user time to choose a file using [`block_cli_pipe_input`](./plugin-api-commands.md#block_cli_pipe_input).
2. Output the the path the user chose as clear text with the [`cli_pipe_output`](./plugin-api-commands.md#cli_pipe_output) command.
3. Unblock the CLI pipe input once the user chose a path with [`unblock_cli_pipe_input`](./plugin-api-commands.md#unblock_cli_pipe_input).

## User expectations
The user will likely expect the plugin to either close itself or hide itself once the file has been chosen, so their focus will return the pane which originated this request (be it another plugin or a terminal if this request was made through a CLI pipe).

## Example
See [the strider plugin's implementation](https://github.com/zellij-org/zellij/blob/main/default-plugins/strider/src/main.rs#L129).
