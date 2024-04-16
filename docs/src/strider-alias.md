# The strider alias

This alias, by default translated to the internal `zellij:strider` plugin url, is the default Zellij filesystem explorer.

## Contract
Zellij loads this plugin in the `strider` layout with a width of 20% of the user's screen and a the full height of the user's screen minus 3 (one for the [tab-bar](./tab-bar-alias.md) and two for the [status-bar](./status-bar-alias.md)). Zellij has no other expectations from this alias, but users will probably expect it to at least show a list of files in the current directory.

