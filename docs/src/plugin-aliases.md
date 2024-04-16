# Plugin Aliases
Plugin aliases are a dictionary between an arbitrary string (eg. `filepicker`) and a non-alias [plugin url](./plugin-loading.md), with optional [plugin configuration](./plugin-api-configuration.md). They can be configured in the [Zellij configuration file](./configuration.md) under the `plugins` block.

Here's the default aliases:
```javascript
plugins {
    tab-bar location="zellij:tab-bar"
    status-bar location="zellij:status-bar"
    strider location="zellij:strider"
    compact-bar location="zellij:compact-bar"
    session-manager location="zellij:session-manager"
    welcome-screen location="zellij:session-manager" {
        welcome_screen true
    }
    filepicker location="zellij:strider" {
        cwd "/"
    }
}
```
With this plugins block, whenever the bare `tab-bar` is used to refer to a plugin (be it in a [layout](./layouts.md), from the [command line](./zellij-plugin.md), from a [keybinding](./keybindings.md) or from [another plugin](./plugin-pipes.md)), Zellij will translate it to the internal `zellij:tab-bar` url. Whenever the bare `filepicker` url is used to refer to a plugin, Zellij will translate it to the built-in `zellij:strider` url will be used with the `cwd "/"` configuration.

Aliases can be added to this block or changed to swap the default built-in plugins to other implementations. Removing the default aliases entirely might cause Zellij not to function as expected.

When swapping the default aliases for custom plugins, it's important that these plugins implement the basic contract Zellij (and indeed, other plugins) expect of them. The following sections describe the contract for each default alias.
