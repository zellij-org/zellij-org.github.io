# The prompt alias

This alias, by default translated to the internal `zellij:prompt` plugin url, draws the popups of [`zellij prompt`](./zellij-prompt.md) (confirmations, choices, text and number fields, menus, forms and notices) and of the `prompt` plugin API command, which lets plugins ask the user a question.

## Contract

Zellij opens this plugin as a popup and sends it the request as a [pipe](./plugin-pipes.md) message. The plugin shows the request, and answers:

- To `zellij prompt` on the command line, with the CLI pipe commands ([`cli_pipe_output`](./plugin-api-commands.md#cli_pipe_output) and [`unblock_cli_pipe_input`](./plugin-api-commands.md#unblock_cli_pipe_input)) and an exit code
- To a plugin, with the [`reply_to_prompt`](./plugin-api-commands.md#reply_to_prompt) plugin command

Only the built-in `zellij:prompt` plugin may answer a plugin's request with `reply_to_prompt`: replies from any other plugin are ignored. Pointing this alias at a different plugin therefore stops plugin prompts from being answered.
