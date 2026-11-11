# Mouse Bindings

What mouse clicks and the scroll wheel do can be configured in the `mousebinds` block of the [configuration file](./configuration.md), the same way keys are configured in the [`keybinds`](./keybindings.md) block. Mouse bindings only apply while [`mouse_mode`](./options.md#mouse_mode) is on.

The default mouse bindings come from the active [keybinding preset](./keybinding-presets.md). Bindings in the `mousebinds` block are applied on top of them. Mouse bindings can also be changed in the [settings screen](./settings-screen.md), under **Mouse** → **Mouse bindings…**.

```javascript
mousebinds {
    shared {
        bind "Middle" { NewTab; }
        bind "Alt Double Left" on="frame" { ToggleFullscreen; }
        bind "ScrollUp" app_first=false { Scroll 5; }
        bind "ScrollDown" app_first=false { Scroll 5; }
    }
    locked {
        unbind "Right"
    }
}
```

## Modes
Like keybindings, mouse bindings are divided into [modes](./keybindings-modes.md). The `shared`, `shared_except` and `shared_among` blocks work the same way as for [keybindings](./keybindings-shared.md).

```javascript
mousebinds {
    normal {
        bind "Middle" { NewPane; }
    }
    shared_except "locked" {
        bind "Alt Middle" { NewTab; }
    }
}
```

## Triggers
A trigger is a quoted string made of optional modifiers, an optional click count and a button, separated by spaces, eg. `"Left"`, `"Ctrl Left"`, `"Double Left"` or `"Ctrl Shift Triple Right"`.

* Buttons
  - `Left`
  - `Right`
  - `Middle`
  - `ScrollUp`
  - `ScrollDown`
  - `ScrollLeft`
  - `ScrollRight`

* Modifiers
  - `Ctrl`
  - `Alt`
  - `Shift`

* Click counts
  - `Double`
  - `Triple`

`Double` and `Triple` can only be used with `Left`, `Right` and `Middle`. `Super` cannot be used, because terminals do not report it for mouse events.

### Where the click lands: `on`
The `on` attribute limits a binding to one part of a pane:

- `"content"` - inside the pane
- `"frame"` - on the pane's frame
- `"any"` - anywhere on the pane (the default)

```javascript
mousebinds {
    shared {
        bind "Double Left" on="frame" { ToggleFullscreen; }
        bind "Double Left" on="content" { Select; }
    }
}
```

### Which binding is used
When a button is pressed, Zellij looks for a binding in this order:

1. A binding with the exact modifiers. If none matches and `Shift` is held, the same trigger without `Shift` is tried.
2. A binding with the exact click count, then with fewer clicks (a triple click falls back to `Double`, then to a single click).
3. A binding for the part of the pane that was clicked (`content` or `frame`), then an `any` binding.

A trigger with no binding is passed to the program in the pane (see [`PassToApp`](#mouse-behaviours)).

### Programs that use the mouse: `app_first`
Some programs (eg. `vim` or `htop`) ask the terminal for mouse events. With `app_first=true`, a click on the focused pane goes to such a program instead of to the binding. Scroll bindings with `app_first=true` send the scroll to such programs, and to programs that use the full screen (eg. `less`), instead of scrolling the pane's scrollback.

```javascript
mousebinds {
    shared {
        bind "Right" app_first=false { ContextMenu; }
    }
}
```

Without `app_first`, it is `true` for the `Click`, `Select`, `FocusPane`, `ContextMenu`, `Scroll`, `ScrollColumns` and `ScrollToPrompt` behaviours, and `false` for the others and for bindings that run actions.

## What a binding does
A binding does one of two things:

- One mouse behaviour (listed below), which must be the only item in the binding:
  ```javascript
  bind "Middle" { ToggleFullscreen; }
  ```
- One or more [actions](./keybindings-possible-actions.md), as in a keybinding. The pane under the pointer is focused first, then the actions run:
  ```javascript
  bind "Alt Middle" { NewPane "Right"; SwitchToMode "normal"; }
  ```

`MovePane` without arguments is the mouse behaviour (drag a floating pane). With a direction (eg. `MovePane "left"`) it is the normal action.

### Mouse behaviours

| Behaviour | Arguments | What it does |
|---|---|---|
| `Click` | None | The normal left click: focus a pane, start selecting text in the focused pane, drag a floating pane by its frame or drag a tiled pane's border to resize it. With other buttons, the click goes to the focused pane or focuses the clicked one |
| `Select` | None | Select text in the focused pane (with `Double`, a word; with `Triple`, a line) |
| `FocusPane` | None | Focus the clicked pane |
| `MovePane` | None | Drag a floating pane to move it |
| `ResizePane` | None | Drag a pane's frame edge to resize the pane (tiled or floating) |
| `ToggleFullscreen` | None | Toggle the clicked pane as fullscreen |
| `GroupToggle` | None | Add the clicked pane to the pane group, or remove it. Dragging over panes adds them |
| `Ungroup` | None | Clear the pane group |
| `ContextMenu` | None | Open the [right-click menu](./context-menu.md). When [`context_menu_enabled`](./options.md#context_menu_enabled) is off, a right click on the focused pane goes to its program instead |
| `Scroll` | Lines per scroll step (default `3`) | Scroll the pane under the pointer. Only for `ScrollUp`, `ScrollDown`, `ScrollLeft` and `ScrollRight`. If the terminal reports its own number of lines, that number is used |
| `ScrollColumns` | Columns per scroll step (default `4`) | Scroll sideways (`ScrollUp` and `ScrollLeft` scroll left). Only for the scroll buttons |
| `ScrollToPrompt` | `"previous"` or `"next"` | Jump to the previous or next shell prompt (needs [shell integration](./shell-integration.md) and [`advanced_mouse_actions`](./options.md#advanced_mouse_actions)) |
| `ResizeScroll` | `"increase"` or `"decrease"` | Grow or shrink the pane under the pointer (needs [`mouse_scroll_resize`](./options.md#mouse_scroll_resize)) |
| `DrawFloatingPane` | Optional plugin, with its configuration | Drag a rectangle inside a pane to open a new floating pane there: a terminal, or the given plugin. Only with `Left` |
| `PassToApp` | None | Send the event to the program in the pane |
| `Ignore` | None | Do nothing |

For example, to draw a floating terminal with `Ctrl` and a floating plugin with `Ctrl Alt`:

```javascript
mousebinds {
    normal {
        bind "Ctrl Left" on="content" { DrawFloatingPane; }
        bind "Ctrl Alt Left" { DrawFloatingPane "file:/path/to/plugin.wasm" { key "value"; }; }
    }
}
```

## Unbinding and clearing
`unbind` removes a binding, either in all modes (at the top of the block) or in one mode. It takes the same `on` attribute as `bind`:

```javascript
mousebinds {
    unbind "ScrollLeft" "ScrollRight"
    normal {
        unbind "Middle" on="content"
    }
}
```

`clear-defaults=true` drops the bindings of the preset, either on the whole block or for one mode:

```javascript
mousebinds clear-defaults=true {
    shared {
        bind "Left" { Click; }
        bind "ScrollUp" { Scroll 3; }
        bind "ScrollDown" { Scroll 3; }
    }
}
```

A `mousebinds` block in a [layout](./layouts-with-config.md) is applied on top of the one in the configuration file.

## Default mouse bindings
These are the mouse bindings of both built-in presets, in all modes. `Ctrl` is the primary modifier and `Alt` the secondary one; changing the [modifiers](./changing-modifiers.md) changes these bindings too.

| Trigger | Where | Behaviour |
|---|---|---|
| `Left` | anywhere | `Click` |
| `Double Left`, `Triple Left` | content | `Select` |
| `Double Left` | frame | `ToggleFullscreen` |
| `Ctrl Left` | frame | `ResizePane` |
| `Ctrl Left` | content | `DrawFloatingPane` (drag to draw a floating terminal) |
| `Alt Left` | anywhere | `GroupToggle` |
| `Alt Right` | anywhere | `Ungroup` |
| `Alt Middle` | anywhere | `Ignore` |
| `Right`, `Ctrl Right` | anywhere | `ContextMenu` |
| `ScrollUp`, `ScrollDown` | anywhere | `Scroll 3` |
| `ScrollLeft`, `ScrollRight` | anywhere | `ScrollColumns 4` |
| `Ctrl ScrollUp` | anywhere | `ResizeScroll "increase"` |
| `Ctrl ScrollDown` | anywhere | `ResizeScroll "decrease"` |
| `Ctrl ScrollLeft`, `Ctrl ScrollRight` | anywhere | `ScrollColumns 4` |
| `Alt ScrollUp` | anywhere | `ScrollToPrompt "previous"` |
| `Alt ScrollDown` | anywhere | `ScrollToPrompt "next"` |
| `Alt ScrollLeft`, `Alt ScrollRight` | anywhere | `Ignore` |

In a [keybinding preset](./keybinding-presets.md#writing-a-preset) file, the same bindings are written with placeholders, eg. `bind "{primary} Left" on="frame" { ResizePane; }`. A preset without a `mousebinds` block uses these default bindings.

## The tab bar
The tab bar (and the compact bar) handle their own clicks:

- Clicking a tab switches to it.
- Dragging a tab left or right moves it to a new position.
- Double-clicking a tab starts renaming it.
- Double-clicking an empty part of the bar opens a new tab.
- Right-clicking a tab or the bar opens the [right-click menu](./context-menu.md) for it.
- Scrolling over the tab bar switches tabs.

The two double-click actions can be turned off with the `double_click_tab` and `double_click_empty` plugin options:

```javascript
plugins {
    tab-bar location="zellij:bars" {
        role "tab-bar"
        double_click_tab "none"
        double_click_empty "none"
    }
}
```
