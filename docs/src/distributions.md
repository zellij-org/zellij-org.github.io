# Building a Zellij Distribution

Zellij can be used as a library to build a **distribution**: a program of its own, based on Zellij, that bundles its own plugins, configuration, layouts and keybinding presets into a single executable.

Plugins bundled into a distribution behave exactly like Zellij's own built-in plugins:

- They are referred to as `zellij:<name>` (eg. in layouts, keybindings and [plugin aliases](./plugin-aliases.md))
- They are loaded from memory rather than from disk
- They are not subject to the [plugin permission](./plugin-api-permissions.md) system

## A minimal distribution

A distribution is a Rust program that depends on the `zellij` crate and calls `zellij::run` with a `Distribution`, instead of using the `zellij` binary:

```toml
[dependencies]
zellij = "0.46.0"
```

```rust
use zellij::{Distribution, DistributionLayout};

fn main() {
    zellij::run(
        Distribution::new("my-distribution", env!("CARGO_PKG_VERSION"))
            .with_display_name("My Distribution")
            .with_plugin("my-plugin", include_bytes!("../assets/my-plugin.wasm"))
            .without_plugin("share")
            .with_config(include_str!("../assets/config.kdl"))
            .with_layout(DistributionLayout::new(
                "my-layout",
                include_str!("../assets/layout.kdl"),
            )),
    )
}
```

With the bundled `config.kdl`:

```javascript
plugins {
    my-plugin location="zellij:my-plugin"
}

load_plugins {
    "zellij:my-plugin"
}

default_layout "my-layout"
```

A complete example, including building the plugin from a `build.rs`, is in [`example/distribution`](https://github.com/zellij-org/zellij/tree/main/example/distribution) in the Zellij repository.

`zellij::run` must be called at most once, before anything else in the process reads configuration. Stock Zellij itself is run with `zellij::run_zellij()`.

## The `Distribution` builder

| Method | Description |
|:-------|:------------|
| `Distribution::new(name, version)` | The distribution's name and version. The name must be non-empty and may only contain lowercase letters, digits, `-` and `_` |
| `with_display_name(name)` | A human-readable name. Defaults to the name |
| `with_app_id(id)` | The app id used by the desktop entry on Linux and the app bundle on macOS. Defaults to the name |
| `with_project_dirs(qualifier, organization, application)` | The values the platform's configuration, cache, data and runtime folders are derived from. Defaults to `("", "", name)`. Only `application` matters on Linux, where it is lowercased |
| `with_plugin(name, bytes)` | Bundle a plugin, loaded as `zellij:<name>` |
| `without_plugin(name)` | Drop one of Zellij's built-in plugins. `zellij:<name>` then stops resolving |
| `without_builtin_plugins()` | Drop all of Zellij's built-in plugins |
| `with_config(kdl)` | Configuration applied on top of Zellij's defaults and below the user's own `config.kdl` |
| `with_layout(DistributionLayout)` | A layout usable by name wherever a built-in layout name is accepted (`--layout`, `default_layout`, `zellij setup --dump-layout`). `DistributionLayout::new(name, kdl).with_swap_layout(kdl)` adds swap layouts |
| `with_keybind_preset(DistributionKeybindPreset)` | A [keybinding preset](./keybinding-presets.md) usable by name. `DistributionKeybindPreset` is in `zellij_utils::distribution` |

## What the name changes

The name of a distribution names everything it owns, so it does not share files with Zellij or with other distributions:

- The configuration folder (eg. `~/.config/<name>` on Linux) and the system configuration folder (`/etc/<name>`)
- The cache, data and temporary folders, and the log file
- The plugin and data folders under `<prefix>/share/<name>`
- The command name shown in `--help`

`--version` shows the distribution's version followed by the Zellij version it is built on, eg. `1.0.0 (zellij 0.46.0)`.

## Replacing a built-in plugin

A bundled plugin cannot use the name of one of Zellij's built-in plugins, unless that built-in is dropped with `without_plugin` first. Dropping a built-in plugin does not remove the [plugin alias](./plugin-aliases.md) that points to it: point that alias somewhere valid in the bundled configuration, or anything still using it (a keybinding, a layout) fails to load.

To leave the built-in alone and use a different implementation, give the bundled plugin its own name and point the alias at it:

```javascript
plugins {
    session-manager location="zellij:my-session-manager"
}
```

Zellij's default configuration refers to several built-in plugins, so a distribution using `without_builtin_plugins()` will almost certainly want to bundle its own configuration and layouts.

The built-in plugins are: `bars`, `strider`, `session-manager`, `configuration`, `plugin-manager`, `about`, `share`, `multiple-select`, `layout-manager`, `prompt` and `context-menu`.

Dropping built-in plugins does not make the executable smaller.

## Builds without bundled plugins

When Zellij is built with the `disable_automatic_asset_installation` feature, no plugin bytes are bundled. Built-in plugins are then looked up as `<name>.wasm` in the plugin folder on disk instead.
