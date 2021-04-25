# Configuration

Zellij will look for a file `config.yaml` in the default configuration location of your os:

**Linux**: `/home/alice/.config/zellij`

**Mac**: `/Users/Alice/Library/Application Support/com.Zellij-Contributors.zellij`

To ignore the default config file location:

```
zellij config --clean
```

To pass a config file directly to zellij:

```
zellij config [FILE]
```


## Current Main:

This changed in the current main branch.

To ignore the default config file location:

```
zellij option --clean
```

To pass a config file directly to zellij:

```
zellij --config [FILE]
```

Or use the `ZELLIJ_CONFIG` environment variable,
in order to pass the location.

The config order is as follows:

1. `--config` flag
2. `ZELLIJ_CONFIG` variable
3. default location
