# Configuration

Zellij will look for a file `config.yaml` in the `config` directory.

The config order is as follows:

- `--config` flag
- `ZELLIJ_CONFIG_FILE` env variable
- `--config-dir` flag
- `ZELLIJ_CONFIG_DIR` env variable
- default location
- `$HOME/.config/zellij`
- system location (`/etc/zellij`)

The default configuration location of your os:

**Linux**: `/home/alice/.config/zellij`

**Mac**: `/Users/Alice/Library/Application Support/org.Zellij-Contributors.Zellij`

To pass a config file directly to zellij:

```
zellij --config [FILE]
```

To start without loading configuration from default directories:

```
zellij option --clean
```

