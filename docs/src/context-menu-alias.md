# The context-menu alias

This alias, by default translated to the internal `zellij:context-menu` plugin url, draws the [right-click menu](./context-menu.md).

The items of the menu are not part of this plugin: they come from the `context_menu` block of the [configuration](./context-menu.md). The plugin only shows them and runs the one that is chosen.

## Contract

When the user right-clicks a pane, a tab or a bar (or runs `zellij action open-context-menu`), Zellij opens this plugin as a popup at the click and sends it the [`ContextMenu`](./plugin-api-events.md#contextmenu) event, holding what was clicked and the items to show.

Zellij expects the plugin to:

1. Show the items, and let the user choose one with the mouse or the keyboard
2. Run the chosen item with the [`run_context_menu_item`](./plugin-api-commands.md#run_context_menu_item) plugin command, giving its index
3. Close itself once an item is run or the menu is dismissed

To turn the menu off entirely, use `context_menu_enabled false` rather than replacing this alias.
