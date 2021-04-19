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
