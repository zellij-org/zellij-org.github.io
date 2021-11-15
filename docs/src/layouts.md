# Layouts
Layouts are yaml configuration files which Zellij can load on startup.
These files can describe a layout of terminal panes and plugins that Zellij will create when it loads.
To load a layout with Zellij:

```
zellij --layout-path /path/to/your/layout_file.yaml
```

By default Zellij will load the `default.yaml` layout, that is found in the
`layout` directory (by default a subdirectory of the `config`
directory [config/layouts]). Falling back to an internal default layout,
if not found.
Layouts residing in the default directory can be accessed as follows:
```
zellij --layout [layout_name]
```

## Example
This file:
```yaml
---
tabs:
  - direction: Vertical
    parts:
      - direction: Horizontal
        parts:
          - direction: Vertical
          - direction: Vertical
      - direction: Horizontal
```

Will instruct Zellij to create this layout:
```
┌─────┬─────┐
│     │     │
├─────┤     │
│     │     │
└─────┴─────┘
```

## Creating a layout file
A layout file is a nested tree structure.
Each node describes either a pane, or a space in which its parts (children) will be created.
The layout file is divided in to two sections: `templates` and `tabs`.

The templates describe the structure of the layout and what part of the ui
should be tab agnostic.
The tabs describe which part of the layout should be tab specific.
For this mechanism the templates make use of an extra attribute called `body`,
if it is specified each single tab will be inserted in to the template and then
started by zellij.

### `parts: <layout>`

Layouts are composed through the optional `parts` section, if a layout has a non empty parts section
it is a node that is split up into these respective parts.

Example:
```
parts:
  - direction: Vertical
  - direction: Vertical
```

Each node has the following fields:

### `direction: Horizontal / Vertical`
If the node has children, they will be created as splits in this direction.

### `split_size: Percent: <1-100> / Fixed: <lines/columns>`
This indicates either a percentage of the node's parent's space or a fixed size of columns/rows from its parent's space. By default the splits are proportional.

Example:
```
parts:
  - direction: Vertical
    split_size:
      Percent: 50
  - direction: Vertical
    split_size:
      Percent: 50
```

### `run: plugin: <plugin> / command: <command>`
This is an optional instruction to either run a command, or a plugin.
If indicated, instead of loading the default shell in a terminal pane,
the run action will be executed.

* `plugin: </path/to/plugin.wasm>`

This is an optional path to a compiled Zellij plugin. 
If indicated, instead of loading a terminal, this plugin will be loaded.
For more information, please see the plugin documentation of this guide.
In case the plugin resides in the `plugin` directory, specifying the name of the plugin is sufficient.

Example:
```
run:
  plugin:
    location: "zellij:status-bar"
    _allow_exec_host_cmd: false # Optional and false by default
```
For more information, please see the plugin documentation of this guide.
The `_allow_exec_host_cmd` is preliminary and allows plugins to run commands
on the host system, if the plugins need that functionality the user can opt in
to it.

* `command: {cmd: <path/to/command> , args: <optional-arguments> }`

This is an optional path to a command. If indicated, instead of loading
a pane with the default shell, this command will be executed.
Optionally it's arguments can be passed as a vector of strings.

Example:
```
run:
  command: {cmd: htop, args: ["-C"]}
```

### `name: <name-of-the-tab>`
This is an optional command that can be used to name the `tab` in the tab layout
section. 

Example:
```
tabs:
  - name: "<name-of-the-tab>"
```

This is currently limited to the tabs section.

### `session: <session-configuration>`
This is an optional configuration option that can be used to modify the session
behavior of the layout.

Current options include:
```
session:
  name: "zellij" # a string, that names the session
  attach: true # default `true`. If session exists, re-attach.
```

Example:
```
session:
  name: "zellij"
```

Adding this to the layout would name the session `zellij` and upon loading
the layout again will try to attach to an existing session that is called
`zellij`.
If the `attach` configuration is `false`, then zellij will show an error
message on trying to create the layout, if the layout name already exists.

### `configuration`
The layout supports all the configuration options from the [Configuration](https://zellij.dev/documentation/configuration.html) page.

If an option is specified in a layout, it has precedence over the config file
itself.



## Further examples
Please take a look at the [default](https://github.com/zellij-org/zellij/tree/main/zellij-utils/assets/layouts) layouts that come with Zellij, or the layouts that reside in the [example](https://github.com/zellij-org/zellij/tree/main/example) directory for more complete layouts.

