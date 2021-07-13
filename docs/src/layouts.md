# Layouts
Layouts are yaml configuration files which Zellij can load on startup. These files can describe a layout of terminal panes and plugins that Zellij will create when it loads.
To load a layout with Zellij:

```
zellij --layout-path /path/to/your/layout_file.yaml
```

## Example
This file:
```yaml
---
direction: Vertical
parts:
  - direction: Horizontal
    split_size:
      Percent: 50
    parts:
      - direction: Vertical
        split_size:
          Percent: 50
      - direction: Vertical
        split_size:
          Percent: 50
  - direction: Horizontal
    split_size:
      Percent: 50
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
A layout file is a nested tree structure. Each node describes either a pane, or a space in which its parts (children) will be created.

Each node has the following fields:

### `direction: Horizontal / Vertical`
If the node has children, they will be created as splits in this direction.

### `split_size: Percent: <1-100> / Fixed: <lines/columns>`
This indicates either a percentage of the node's parent's space or a fixed size of columns/rows from its parent's space.

### `plugin: /path/to/plugin.wasm`
This is an optional path to a compiled Zellij plugin. If indicated, instead of loading a terminal, this plugin will be loaded. For more information, please see the plugin documentation of this guide.

## Further examples
Please see the default layouts that come with Zellij: [layouts](https://github.com/zellij-org/zellij/tree/main/zellij-utils/assets/layouts), or the layouts that reside in the example directory: [examples](https://github.com/zellij-org/zellij/tree/main/example).

