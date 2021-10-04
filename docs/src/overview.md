# Overview

Zellij is a workspace aimed at developers, ops-oriented people and
anyone who loves the terminal.
At its core, it is a terminal multiplexer (similar to tmux and screen),
but this is merely its infrastructure layer.

Zellij has a native layout and plugin system.
To understand Zellij a little bit better, let us take a look at
the default configuration.

## Default Configuration
![Default layout](img/overview-default-legend.png)

The default configuration consists of:
1. The tab-bar plugin. It shows current tabs that are in use as well as the session name.
2. The pane, in which the default shell is started.
The title the shell sets can be seen in the upper left corner of the pane.
3. The status-bar plugin. It gives an overview over current default keybindings,
since Zellij is modal it can show hints based on modes it currently resides in.

To dive deeper in to how the layout-template that is behind the default layout
works, consider checking out the relevant [section](layouts-templates.md).

Let's open a new tab and then a couple panes inside that new tab:
1. <kbd>Ctrl</kbd> + <kbd>t</kbd>
2. <kbd>n</kbd>
3. <kbd>Ctrl</kbd> + <kbd>p</kbd>
4. <kbd>n</kbd>
5. <kbd>r</kbd>
6. <kbd>Return</kbd>

The status-bar should have guided us through:
![Status tab 1](img/overview-status-tab-1.png)
![Status tab 2](img/overview-status-tab-2.png)
And this is our current state:
![Default state 1](img/overview-default-1.png)
Zellij doesn't need a terminal to keep commands running, because it uses a client
and server system. Let us disconnect and reconnect to the same session now:

1. <kbd>Ctrl</kbd> + <kbd>o</kbd>
2. <kbd>d</kbd>

![Status tab 3](img/overview-status-tab-3.png)

If only one server session is running in the background zellij can restore the
connection automatically, if not then we need a specific session name.
We can get the name in the following way:
```
zellij list-sessions
```
And now we reattach to the currently running session:
```
zellij attach hilarious-kitty
```
