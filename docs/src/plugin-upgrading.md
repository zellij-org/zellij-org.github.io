# Upgrading a Plugin

Zellij plugins are backwards compatible - meaning that a plugin compiled for an older version of Zellij should always run fine on a newer version of Zellij.

The plugin API however might break every now and then for plugin *code* that has not been compiled for the current version. We try to minimize these occurrences as much as possible.

Compatibility only goes one way: a plugin compiled against a newer `zellij-tile` is not guaranteed to work on an older Zellij.

## Upgrading to 0.46.0

The following changes may require updating a plugin's code when moving it to `zellij-tile` `0.46.0`. Plugins that are not recompiled keep working (see [Plugins compiled for older versions](#plugins-compiled-for-older-versions)).

### `Text::new` is replaced by `Text::from`

`Text::new` was removed. `Text` is now created with `Text::from`, which accepts a `&str`, a `String`, a `&String` or a `StyledText`.

```rust
let text = Text::from("Hello").color_range(0, ..);
```

The following [ast-grep](https://ast-grep.github.io/) command handles most cases (but not all of them):

```
ast-grep run -p 'Text::new($A)' -r 'Text::from($A)' --update-all
```

`Text::new` also accepted other types that can be turned into a string (eg. numbers). These need to be converted first, eg. `Text::from(count.to_string())`.

### `NestedListItem::new` takes a `Text`

`NestedListItem::new` now takes a `Text` instead of a string, and the styling methods were removed from `NestedListItem`: `opaque`, `color_indices`, `color_range`, `color_substring`, `color_nth_substring`, `color_last_substring`, `color_all`, and all the `error_color_*` and `success_color_*` methods. The remaining methods are `indent` and `selected`.

The styling is now done on the `Text` before creating the item. Before:

```rust
NestedListItem::new("my-session").color_range(0, ..).indent(1)
```

After:

```rust
NestedListItem::new(Text::from("my-session").color_range(0, ..)).indent(1)
```

The ast-grep command above does not change these calls.

### Substring styling uses character positions

The `Text` methods `color_substring`, `color_nth_substring`, `color_last_substring` (and their `dim_`, `unbold_`, `error_color_` and `success_color_` versions) now always style the right characters in text that contains non-ASCII characters. Before, some of them used byte positions, so the styling could be shifted. Plugins that worked around this should remove the workaround. Text that is only ASCII is not affected.

### New struct fields

These structs gained a `border_style` field (or two):

| Struct | New fields |
|---|---|
| `Style` | `border_style`, `floating_border_style` |
| `FloatingPaneCoordinates` | `border_style` |
| `CommandToRun` | `border_style` |
| `FileToOpen` | `border_style` |

Code that creates these structs by listing all of their fields no longer compiles. Adding `..Default::default()` fixes this:

```rust
let command = CommandToRun {
    path: "htop".into(),
    args: vec![],
    cwd: None,
    ..Default::default()
};
```

The constructors and builder methods, eg. `CommandToRun::new`, `CommandToRun::new_with_args`, `FileToOpen::new` and `FloatingPaneCoordinates::new`, work as before.

### `NewPanePlacement` variants have a `border_style` field

The `NoPreference`, `Tiled`, `InPlace` and `Stacked` variants of `NewPanePlacement` gained a `border_style: Option<BorderStyleOverride>` field. Code that creates them needs to add `border_style: None`, and code that matches on them needs to add `border_style` or `..`:

```rust
let placement = NewPanePlacement::Tiled {
    direction: Some(Direction::Right),
    borderless: None,
    border_style: None,
};
```

`NewPanePlacement::default()`, `NewPanePlacement::with_floating_pane_coordinates` and `NewPanePlacement::with_pane_id_to_replace` work as before.

### New enum variants

These enums gained variants, so a `match` that lists every variant needs a new arm (or a `_` arm):

| Enum | New variant |
|---|---|
| `Mouse` | `DoubleClick(isize, usize)` |
| `InputMode` | `RenameSession` |
| `PipeSource` | `PromptRequest { caller_plugin_id, request_id }` |

### `PluginCommand::TogglePaneEmbedOrEjectForPaneId` takes `(PaneId, bool)`

The `bool` says whether the pane should also be shown and focused. This only matters for code that creates the `PluginCommand` directly. The `toggle_pane_embed_or_eject_for_pane_id(pane_id)` function works as before, and `toggle_pane_embed_or_eject_for_pane_id_with_focus(pane_id, show_and_focus)` was added.

### `ClientId` is a `u32`

`ClientId` (used eg. in `ClientInfo::client_id`) changed from `u16` to `u32`. Code that stores client ids in a `u16` needs to change the type.

### The `zellij_plugin_contract` export

Plugins built with `zellij-tile` `0.46.0` export an empty function called `zellij_plugin_contract`. `register_plugin!` adds it automatically. Zellij uses it to tell plugins built for `0.46.0` or later apart from older ones. Plugins written without `register_plugin!` (eg. in [other languages](./plugin-other-languages.md)) need to export this function themselves to receive the full event stream.

### Plugins compiled for older versions

A plugin that does not export `zellij_plugin_contract` (except Zellij's built-in plugins) is treated as compiled for `0.45`. Zellij keeps it working by only sending it what it can read:

- Mode updates for the new `RenameSession` mode are sent as `RenameTab`.
- `Mouse::DoubleClick` events are not sent.
- `UserAction` events with actions that a `0.45` plugin cannot read are not sent.
- Pipe messages from sources a `0.45` plugin does not know (eg. prompt requests) are not sent.

### The new UI components do not render on older versions

`0.46.0` adds [interactive UI components](./plugin-ui-rendering.md#interactive-components) (buttons, text inputs, dropdowns and more). These are drawn by Zellij itself, so when a plugin that uses them runs on an older Zellij, the components are not drawn at all (an "Unknown component" error is written to the Zellij log instead).
