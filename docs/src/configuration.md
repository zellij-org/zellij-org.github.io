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
zellij setup --clean
```

## How do I update the config file for running sessions?
Zellij actively watches for changes in the [active configuration file](#where-does-zellij-look-for-the-config-file). Most fields will be applied immediately without the need for a restart. Otherwise, this will be mentioned in the commentary of the relevant field.
