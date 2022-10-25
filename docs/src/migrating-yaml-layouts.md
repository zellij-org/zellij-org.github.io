# Migrating from old YAML layouts / configs

Starting from Zellij `0.32.0`, Zellij uses [KDL](https://kdl.dev) layouts as described in these documents.

Up until this version, Zellij used `YAML` configuration files as described in the old documents kept [here](/old-documentation) for posterity.

As a matter of convenience, when Zellij is run with an old configuration / layout / theme file (either explicitly with a cli flag or if it found the file in the default locations) it will prompt the user and convert that file to the new format.

This can also be done manually:
```
$ zellij convert-config /path/to/my/config.yaml > /path/to/my/config.kdl
$ zellij convert-layout /path/to/my/layout.yaml > /path/to/my/layout.kdl
$ zellij convert-theme /path/to/my/theme.yaml > /path/to/my/theme.kdl
```
