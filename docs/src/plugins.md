# Plugins

Zellij offers a Webassembly / WASI plugin system, allowing plugin developers to develop plugins in many different languages. The plugin system is currently in its early stages, offering pioneering plugin developers a chance to shape the ecosystem in its infancy if they are willing to tolerate [a few sharp edges](./plugin-system-status.md).

Zellij itself builds its UI from plugins, you can [browse their code](https://github.com/zellij-org/zellij/tree/main/default-plugins) for inspiration.

## What is a Zellij Plugin?
A Zellij plugin is a first class citizen in the workspace, just like a terminal pane. It can [render a UI](./plugin-ui-rendering.md), [react to application state changes](./plugin-api-events.md) as well as [control Zellij and change its behavior](./plugin-api-commands.md).

Our intention with the plugin system is to give users and developers the power to easily take full advantage of their terminal. Creating composable components that can be shared easily, turning everyday terminal tasks into a personalized multiplayer dashboard experience. We like to think of them as visual cross-platform scripts that do not need to be installed or compiled.

More importantly though, we feel that the best terminal workspace experience happens through collaboration. So - what do you think is a Zellij plugin?

## Status of the Plugin System
As mentioned above, the plugin system is in its early stages. While it has been a piece of the Zellij infrastructure for a while, we have only recently started devoting proper attention to it. We believe strongly in developing in the open, and so decided to release the early iterations as they come. We invite pioneering developers to develop plugins, find the rough edges as well as workarounds for them. The Zellij maintainers will be doing this along side them.

Here's [a list of known issues and things that are missing](./plugin-system-status.md), these are all issues that are being worked on and should be addressed in the near future.

Currently, Rust is the only language officially supported for plugins, but there are [community efforts](./plugin-other-languages.md) we are enthusiastic about to support other languages. We plan on supporting as many languages as possible.
