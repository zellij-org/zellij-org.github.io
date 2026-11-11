# Commands

These commands can be invoked with `zellij [SUBCOMMAND]`.
For more details, each subcommand has its own help section when run with the
`--help` flag (`zellij [SUBCOMMAND] --help`).

## `attach [session-name]`
short: `a`

Zellij will attempt to attach to an already running session, with the name
`[session-name]`.
If given no `[session-name]` and there is only one running session, it will attach to that session.

The attach subcommand will also accept the optional `options` subcommand.

### Starting a session with an initial command

Trailing arguments given after `--` are run as a command in the first pane of the
session:

```
$ zellij attach -c my-session -- htop
```

This works both when creating a session in the foreground (`-c`, `--create`) and in the
background (`-b`, `--create-background`).

The command only runs if the session is created by this invocation. When attaching to an
already running session, the trailing command is ignored.

If a [layout](./layouts.md) is used, the pane running the command is placed in the
focused tab.

Two flags change how the initial command behaves. Both require an initial command to be
given:

| Flag                                |  Description|
|:------------------------------------|------------------|
| --close-on-exit                     |  Close the initial command's pane as soon as the command exits. By default the pane is held open |
| --start-suspended                   |  Start the command suspended - it is only run once ENTER is pressed for the first time |

Initial commands are not supported for remote ([web client](./web-client.md)) sessions -
the CLI will error out.

All the arguments of `attach` described here also work with [`zellij terminal`](#terminal-session-name).

## `terminal [session-name]`

`zellij terminal` opens a session in Zellij's own terminal window, without
another terminal emulator. It takes the same arguments as `attach` (eg.
`zellij terminal -c my-session -- htop`), and adds flags for the window and the desktop
app (eg. `--watch`, `--startup-mode`, `--standalone`, `-e <COMMAND>`, `--hold`,
`--working-directory`, `--inbox` and `--sessions`).

```
$ zellij terminal
$ zellij terminal -c my-session
$ zellij terminal -e htop
```

See [Zellij Terminal](./zellij-terminal.md) for the full reference.

Running `zellij` with no arguments outside of a terminal (eg. by double-clicking it) opens
`zellij terminal` on macOS, and on Linux when a desktop is available (`DISPLAY` or
`WAYLAND_DISPLAY` is set). This does not happen over SSH or on Windows.

## `prompt`

`zellij prompt` shows a question, list, text field or notice as a popup
over the calling pane and prints the answer.

```
$ zellij prompt confirm "Force push?" && git push --force
```

See [Zellij Prompt](./zellij-prompt.md) for the full reference.

## `list-sessions`
short: `ls`

Will list all the names of currently running sessions.

## `kill-session [target-session]`
short: `k`

Will kill the session with the name of `[target-session]`, if it is currently
running.

## `kill-all-sessions`
short: `ka`

Will prompt the user to kill all running sessions. `-y`, `--yes` skips the prompt.

## `delete-session [target-session]`
short: `d`

Will delete the exited (resurrectable) session with the name of `[target-session]`. With
`-f`, `--force`, a running session is killed first.

## `delete-all-sessions`
short: `da`

Will prompt the user to delete all exited (resurrectable) sessions. With `-f`, `--force`,
running sessions are killed and deleted as well. `-y`, `--yes` skips the prompt.

## `watch [session-name]`
short: `w`

Will attach to a session in read-only mode. See [Zellij Watch](./controlling-zellij-through-cli.md#zellij-watch).

## `list-aliases`
short: `la`

Will list the existing [plugin aliases](./plugin-aliases.md).

## `run`, `edit`, `plugin`, `pipe`, `action` and `subscribe`

These commands control a running session from the command line. They are described in
[Controlling Zellij through the CLI](./controlling-zellij-through-cli.md):
[`run` and `edit`](./zellij-run-and-edit.md) (short: `r` and `e`),
[`plugin` and `pipe`](./zellij-plugin-and-pipe.md) (short for `plugin`: `p`),
[`action`](./cli-actions.md) (short: `ac`) and [`subscribe`](./zellij-subscribe.md).

## `web`

Runs and manages the web server. See [Web Client](./web-client.md).

## `options`

Can be used to change the behaviour of zellij on startup.
Will supercede options defined in the config file.
To see a list of options look [here](./command-line-options.md).

## `setup`

Functionality to help with the setup of zellij.

| Flag                                |  Description|
|:------------------------------------|------------------|
| --check                             |  Check the configuration |
| --clean                             |  Start with default configuration|
| --dump-config                       |  Dump the default configuration file to stdout|
| --dump-layout [LAYOUT]      |  Dump a specified default layout file to stdout |
| --dump-swap-layout [LAYOUT]      |  Dump the specified [swap layout](./swap-layouts.md) file to stdout |
| --dump-keybinds [PRESET]      |  Dump the specified [keybinding preset](./keybinding-presets.md) (eg. `default` or `unlock-first`) to stdout |
| --dump-plugins [DIR]      |  Dump the builtin plugins to DIR, or to the data dir if DIR is not given |
| --generate-completion [SHELL]      |  Generate completions for the specified shell|
| --generate-auto-start [SHELL]      |  Generate an auto-start script for the specified shell (see [Integration](./integration.md)) |

`setup` can also do from the command line what the [setup screen](./desktop-setup.md) does:

| Flag                                |  Description|
|:------------------------------------|------------------|
| --copy-to-permanent-folder          |  Copy this Zellij to a permanent folder, or update an older Zellij that is already installed |
| --replace-existing                  |  With `--copy-to-permanent-folder`: replace a different file that is in the way |
| --install-desktop-entry             |  Install the desktop entry: a launcher and icons on Linux, a Start menu shortcut and an "Open Zellij here" Explorer item on Windows |
| --uninstall-desktop-entry           |  Remove the desktop entry Zellij installed |
| --make-default-terminal             |  Make Zellij the default terminal, installing the desktop entry if it is missing |
| --keybinding-preset [PRESET]        |  Choose the keybinding preset (eg. `unlock-first`) and save it to the configuration file |

These flags can be combined with each other, but not with the flags of the first table.

```
$ zellij setup --copy-to-permanent-folder
$ zellij setup --install-desktop-entry --make-default-terminal
$ zellij setup --keybinding-preset unlock-first
```

See [Desktop Setup](./desktop-setup.md#from-the-command-line) for where each item is installed on each platform.

# Flags
These flags can be invoked with `zellij --flag`.

| Flag                                |  Description|
|:------------------------------------|------------------|
| --help                             |   Display the help prompt |
| --debug                             |  Gather additional debug information |
| --version                       |  Print version information |
| --session [NAME]                |  Name of a new session, or the session to send `action`, `run`, `edit`, `plugin`, `pipe`, `subscribe` and `prompt` commands to |
| --layout [LAYOUT]               |  Name of a layout in the layout directory or path to a layout file. Inside a session (or with `--session`) it is added to the session as new tab(s), otherwise a new session is started with it |
| --new-session-with-layout [LAYOUT] |  Like `--layout`, but always starts a new session |
| --layout-string [KDL]           |  Use a raw KDL layout string instead of a layout file |
| --config [FILE]                 |  Change where zellij looks for the configuration file (also `ZELLIJ_CONFIG_FILE`) |
| --config-dir [DIR]              |  Change where zellij looks for the configuration directory (also `ZELLIJ_CONFIG_DIR`) |
| --data-dir [DIR]                |  Change where zellij looks for plugins |
| --max-panes [NUMBER]            |  Maximum panes on screen (at least 1), opening more panes will close old ones |

## `--layout-string`

Takes a [layout](./layouts.md) as a raw KDL string rather than as a path to a layout file. Useful for scripting and for generating layouts on the fly.

If invoked from inside a Zellij session (or with an explicit `--session`), the layout is added to the running session as new tab(s). Otherwise, a new session is started with it.

This flag conflicts with `--layout` and `--new-session-with-layout`.

```
$ zellij --layout-string 'layout { pane split_direction="vertical" { pane; pane; } }'
```

The layout is parsed and validated before being sent to the session, so syntax errors are reported immediately.
