# Modes
The keybindings are divided into several modes. Each mode has its separate keybindings.

eg. keybindings available in normal mode go in the `normal` block, and keybindings available in pane mode go in the `pane` block:
```javascript
keybinds {
    normal {
        bind "Alt n" { NewPane; }
    }
    pane {
        bind "n" { NewPane; SwitchToMode "normal"; }
    }
}
```

The available modes are:
- normal
- locked
- resize
- pane
- move
- tab
- scroll
- search
- entersearch
- renametab
- renamepane
- renamesession
- session
- tmux

## The `renamesession` mode

The session can be renamed from `session` mode (`r` in the built-in presets). While in `renamesession` mode, typed text edits the new session name (through the [`SessionNameInput`](./keybindings-possible-actions.md#sessionnameinput) action). The new name is applied when leaving the mode, eg. with `Enter` or `Ctrl c`. In the built-in presets, `Esc` drops the new name with [`UndoRenameSession`](./keybindings-possible-actions.md#undorenamesession) and returns to `session` mode.

## A note about `scroll` mode

Leaving `scroll` mode keeps the scroll position of the pane - the pane is no longer scrolled back down to the bottom automatically. To scroll to the bottom and leave the mode, use a binding that includes the [`ScrollToBottom`](./keybindings-possible-actions.md#scrolltobottom) action.

Focusing a pane that is scrolled back automatically enters `scroll` mode, and focusing a pane that is not scrolled back returns to `normal` mode.

Scrolling a pane also enters and exits `scroll` mode implicitly. This can be turned off with the [`scroll_mode_sync`](./options.md#scroll_mode_sync) option, in which case `scroll` mode is only entered through an explicit keybinding.
