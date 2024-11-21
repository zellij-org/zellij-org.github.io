# Configuration

Zellij uses [KDL](https://kdl.dev) as its configuration language.

Quickstart:
```
mkdir ~/.config/zellij
zellij setup --dump-config > ~/.config/zellij/config.kdl
```

**Note:** In most cases, Zellij will create the above file automatically on first run. Be sure to check if it exists first.

## Where does Zellij look for the config file?

By default, Zellij will look for `config.kdl` in its config directory.

Zellij will search for the config director in the following order:

- As specified by the `--config-dir` flag
- At the path provided by the `ZELLIJ_CONFIG_DIR` environment variable
- At the default location:
    - Linux: `$HOME/.config/<zellij-project-dir>` (e.g. `/home/alice/.config/zellij`)
    - Mac:  `$HOME/Library/Application Support/<zellij-project-dir>` (e.g. `/Users/Alice/Library/Application Support/org.Zellij-Contributors.Zellij`)\
      (`<zellij-project-dir>` is specific to the Rust package, and cannot be changed by the user)
- `$XDG_CONFIG_HOME/zellij`
- `$HOME/.config/zellij`
- At the system default location (always set to `/etc/zellij` - platform-specific locations)

Zellij determines the name of the configuration file in the following order:

- As specified by the `--config` flag
- `ZELLIJ_CONFIG_FILE` environment variable
- `config.kdl` if none of the above are set

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
