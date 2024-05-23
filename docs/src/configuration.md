# Configuration

Zellij uses [KDL](https://kdl.dev) as its configuration language.

Quickstart:
```
mkdir ~/.config/zellij
zellij setup --dump-config > ~/.config/zellij/config.kdl
```

**Looking for the YAML configuration docs for versions `<0.32.0`? [Look no further!](/old-documentation)**

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

## How to dump the default configuration to STDOUT?

To show the current default configuration:
```
zellij setup --dump-config
```
