# Modes

The Zellij [keybindings](./keybindings.md) are grouped into different `modes`, which are a logical separation meant to reduce the mental overhead and allow to duplicate shortcuts in different situations.

## normal
This is the default mode Zellij starts with. By default it provides the ability to switch to different modes, as well as some quick navigation shortcuts.
## locked
This mode "locks" the interface, disabling all keybindings except one that would switch to "normal" mode (`ctrl-g` by default).
It is intended to give users a workaround in case one of the default keybindings overrides something they use in their terminal. (eg. `ctrl-r` for reverse history search in bash).
## pane
This mode includes instructions that manipulate the different panes. Eg. adding new panes, closing panes and moving the focused pane.
## tab
This mode includes instructions that manipulate the different tabs. Eg. adding new tabs, closing tabs and moving the active tab.
## resize
This mode allows the resizing of the focused pane.
## scroll
This mode allows scrolling up/down within the focused pane.
## session
This mode allows detaching from a session.
