# Layouts

Layouts are text files that define an arrangement of Zellij panes and tabs.

You can read more about [creating a layout](./creating-a-layout.md)

**Looking for the YAML configuration docs for versions `<0.32.0`? [Look no further!](/old-documentation)**

### Example

A basic layout can look like this:
```javascript
// layout_file.kdl

layout {
    pane
    pane split_direction="vertical" {
        pane
        pane command="htop"
    }
}
```
Which would create the following layout:

![basic-layout-example](img/basic-layout-example.png)


### Applying a Layout

A layout can be applied when Zellij starts:
```
$ zellij --layout /path/to/layout_file.kdl
```

Or by setting it up in the [configuration](./configuration.md).

A layout can also be applied into a new tab in a running session:
```
$ zellij action new-tab --layout /path/to/layout_file.kdl
```

For more info, see: [Controlling Zellij through the CLI](./controlling-zellij-through-cli.md).

### Layout default directory

By default Zellij will load the `default.kdl` layout, found in the `layouts` directory (a subdirectory of the `config` directory [config/layouts]).

If not found, Zellij will start with one pane and one tab.

Layouts residing in the default directory can be accessed by their bare name:
```
zellij --layout [layout_name]
```

### Layout Configuration Language

Zellij uses [KDL](https://kdl.dev) as its configuration language.
