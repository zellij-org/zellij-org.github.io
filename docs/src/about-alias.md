# The about alias

This alias, by default translated to the internal `zellij:about` plugin url, is the About screen. It shows what is new in this version of Zellij, startup tips and the "Setup Zellij" entry to the [setup screen](./desktop-setup.md#the-setup-screen).

Zellij loads this plugin through the alias to show the release notes the first time a new version runs (see the `show_release_notes` [option](./options.md)) and the startup tips (see `show_startup_tips`). The default `Ctrl o` + `a` keybinding loads `zellij:about` directly rather than through the alias.

## Configuration

| Key | Description |
|:----|:------------|
| `is_release_notes` | When `true`, show the release notes |
| `is_startup_tip` | When `true`, show a startup tip |

## Contract

Zellij loads this plugin as a floating pane. Zellij has no other expectations from this plugin.
