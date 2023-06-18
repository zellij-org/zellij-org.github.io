# Upgrading a Plugin

Since Zellij plugins using [`zellij-tile`](./plugin-lifecycle.md) rely on shared data structures, currently one would need to compile a plugin against the corresponding `zellij-tile` package of the zellij version it is installed on.

The Zellij maintainers are aware this is an inconvenient and undesired scenario and are working on a more robust solution.
