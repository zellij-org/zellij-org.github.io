# Configuration

Zellij uses [KDL](https://kdl.dev) as its configuration language.

Quickstart:
```
mkdir ~/.config/zellij
zellij setup --dump-config > ~/.config/zellij/config.kdl
```

**Note:** In most cases, Zellij will create the above file automatically on first run. Be sure to check if it exists first.

## Where does Zellij look for the config file?

By default Zellij will look for `config.kdl` in the `config` directory.

Zellij will search for the `config` directory as follows:

- `--config-dir` flag
- `ZELLIJ_CONFIG_DIR` env variable
- `$HOME/.config/zellij`
- default location
    - Linux: `/home/alice/.config/zellij`
    - Mac: `/Users/Alice/Library/Application Support/org.Zellij-Contributors.Zellij`

- system location (`/etc/zellij`)

## How to bypass the config file?

In order to pass a config file directly to zellij:

```
zellij --config [FILE]
```

or use the `ZELLIJ_CONFIG_FILE` environment variable.

To start without loading configuration from default directories:

```
zellij options --clean
```

## How do I update the config file for running sessions?
Zellij actively watches for changes in the [active configuration file](#where-does-zellij-look-for-the-config-file). Most fields will be applied immediately without the need for a restart. Otherwise, this will be mentioned in the commentary of the relevant field.

The themes folder, the keybindings folder and the layouts folder are watched as well.

## Changing the configuration from the settings screen
Most of the configuration can also be changed from the [settings screen](./settings-screen.md) (`Ctrl o` + `c` with the default keybinding preset, or "Settings…" in the [right-click menu](./context-menu.md)). Changes apply right away, and stay unsaved until they are saved to the configuration file.

When saving, Zellij changes only the affected parts of the file and keeps its comments and formatting. The previous version of the file is copied next to it as `config.kdl.bak`, replacing any earlier backup with that name.

## What can be configured?
The configuration file is made of [options](./options.md) set at its root, and of blocks:

| Block | Purpose |
|---|---|
| `keybinds` | [keybindings](./keybindings.md) and [keybinding presets](./keybinding-presets.md) |
| `mousebinds` | [mouse bindings](./mouse-bindings.md) |
| `themes` | [themes](./themes.md) |
| `ui` | pane frame and [border](./options.md#border_style) settings |
| `plugins` | [plugin aliases](./plugin-aliases.md) |
| `load_plugins` | [plugins loaded in the background](./plugin-loading.md) when a session starts |
| `env` | [environment variables](./options.md#env) for new panes |
| `web_client` | the [web client](./web-client.md) |
| `context_menu` | the [right-click menu](./context-menu.md) |
| `session_suggestions` | [session suggestions](./session-suggestions.md) |
| `terminal` | the [Zellij terminal](./terminal-options.md) window |
| `attention` | the [inbox](./inbox.md), status markers and desktop notifications |
