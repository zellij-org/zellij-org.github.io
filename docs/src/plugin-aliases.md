# Plugin Aliases
Plugin aliases are a dictionary between an arbitrary string (eg. `filepicker`) and a non-alias [plugin url](./plugin-loading.md), with optional [plugin configuration](./plugin-api-configuration.md). They can be configured in the [Zellij configuration file](./configuration.md) under the `plugins` block.

Here's the default aliases:
```javascript
plugins {
    tab-bar location="zellij:bars" {
        role "tab-bar"
    }
    status-bar location="zellij:bars" {
        role "status-bar"
    }
    strider location="zellij:strider"
    compact-bar location="zellij:bars" {
        role "compact-bar"
    }
    session-manager location="zellij:session-manager"
    welcome-screen location="zellij:session-manager" {
        welcome_screen true
    }
    filepicker location="zellij:strider" {
        cwd "/"
    }
    configuration location="zellij:configuration"
    plugin-manager location="zellij:plugin-manager"
    about location="zellij:about"
    context-menu location="zellij:context-menu"
    prompt location="zellij:prompt"
}
```
With this plugins block, whenever the bare `tab-bar` is used to refer to a plugin (be it in a [layout](./layouts.md), from the [command line](./zellij-plugin-and-pipe.md#zellij-plugin), from a [keybinding](./keybindings.md) or from [another plugin](./plugin-pipes.md)), Zellij will translate it to the internal `zellij:bars` url with the `role "tab-bar"` configuration. Whenever the bare `filepicker` url is used to refer to a plugin, Zellij will translate it to the built-in `zellij:strider` url will be used with the `cwd "/"` configuration.

Aliases can be added to this block or changed to swap the default built-in plugins to other implementations. The built-in aliases cannot be deleted: this block can only add aliases or override them, and removing an override from the configuration brings back the built-in alias. Changing aliases requires a restart.

### The `bars` plugin

The tab bar, the status bar and the compact bar are all drawn by one built-in plugin, `zellij:bars`, told what to draw with its `role` configuration (`tab-bar`, `status-bar` or `compact-bar`; `tab-bar` when no role is given). This plugin also opens file paths clicked in panes (the `link` role, loaded in the background through `load_plugins`).

The plugin urls `zellij:tab-bar`, `zellij:status-bar`, `zellij:compact-bar` and `zellij:link` also work: Zellij translates them to `zellij:bars` with the matching role. Configuration files and layouts using them do not need to change.

When swapping the default aliases for custom plugins, it's important that these plugins implement the basic contract Zellij (and indeed, other plugins) expect of them. The following sections describe the contract for each default alias.

Here's an example on how to use the plugin alias in a layout:

```javascript
layout {
  default_tab_template {
    children
    pane size=1 borderless=true {
      plugin location="compact-bar"
    }
  }
}
```

### A note about cwd

When an alias defined a `cwd` for its plugin (such as the filepicker example above), Zellij will add the `caller_cwd` configuration parameter with the cwd of the focused pane in addition to the configured cwd above, instead of overriding the configured cwd of the plugin. This is so that plugins may provide a nicer user experience to their users and still have the desired cwd configuration of the alias.
