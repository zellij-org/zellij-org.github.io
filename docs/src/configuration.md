# Configuration

By default Zellij will look for `config.yaml` in the `config` directory.

Quickstart:
```
mkdir ~/.config/zellij
zellij setup --dump-config > ~/.config/zellij/config.yaml
```

The default `config` directory order is as follows:

- `--config-dir` flag
- `ZELLIJ_CONFIG_DIR` env variable
- `$HOME/.config/zellij`
- default location
    - Linux: `/home/alice/.config/zellij`
    - Mac: `/Users/Alice/Library/Application Support/org.Zellij-Contributors.Zellij`

- system location (`/etc/zellij`)

In order to  pass a config file directly to zellij:

```
zellij --config [FILE]
```

or use the `ZELLIJ_CONFIG_FILE` environment variable.


To start without loading configuration from default directories:

```
zellij options --clean
```

To show the current default configuration:
```
zellij setup --dump-config
```
