# Commands

These commands can be invoked with `zellij [SUBCOMMAND]`.
For more details, each subcommand has its own help section when run with the
`--help` flag (`zellij [SUBCOMMAND] --help`).

## `attach [session-name]`

short: `a`

Zellij will attempt to attach to an already running session, with the name
`[session-name]`.
If given no `[session-name]` and there is only one running session, it will attach to that session.

The session name may also be an HTTPS URL to attach to a remote ([web client](./web-client.md)) session.

The attach subcommand will also accept the optional `options` subcommand.

| Flag                         | Description                                                  |
| :--------------------------- | ------------------------------------------------------------ |
| `-c`, `--create`             | Create a session if one does not exist                       |
| `-b`, `--create-background`  | Create a detached session in the background if one does not exist |
| `--index [INDEX]`            | Attach by session index in the active sessions ordered by creation date |
| `-f`, `--force-run-commands` | If resurrecting an exited session, immediately run all its commands on startup (skip the "Press ENTER to run..." banner) |
| `-t`, `--token [TOKEN]`      | Authentication token for remote sessions                     |
| `-r`, `--remember`           | Save remote session credentials for automatic re-authentication (4 weeks) |
| `--forget`                   | Delete saved remote credentials before connecting            |
| `--ca-cert [FILE]`           | Path to a custom CA certificate (PEM format) for verifying the remote server |
| `--insecure`                 | Skip TLS certificate validation (dangerous — development only) |
| `--close-on-exit`            | Close the initial command's pane as soon as the command exits. Requires an initial command. By default the pane is held open |
| `--start-suspended`          | Start the initial command suspended — it is only run once ENTER is pressed for the first time. Requires an initial command |

`--create` and `--create-background` only create a session when the named session does not already exist. Attaching to an already running session ignores the create flags and any trailing initial command.

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

Initial commands are not supported for remote ([web client](./web-client.md)) sessions —
the CLI will error out.

### Remote attach

```
$ zellij attach https://my-server:8082/my-session --token <login-token>
$ zellij attach https://my-server:8082/my-session --token <login-token> --remember
$ zellij attach https://my-server:8082 --forget
$ zellij attach https://my-server:8082/my-session --ca-cert /path/to/ca.pem
$ zellij attach https://my-server:8082/my-session --insecure
```

`--insecure` skips TLS certificate validation entirely. Use it only for development
or in a trusted network.

## `list-sessions`

short: `ls`

Will list all currently running sessions and exited resurrectable sessions.

| Flag                    | Description                                                  |
| :---------------------- | ------------------------------------------------------------ |
| `-n`, `--no-formatting` | Do not add colors and formatting to the list (useful for parsing) |
| `-s`, `--short`         | Print just the session name                                  |
| `-r`, `--reverse`       | List the sessions in reverse order (default is ascending order) |

## `list-aliases`

short: `la`

List existing plugin aliases.

## `watch [session-name]`

short: `w`

Attach to a session in read-only mode. Terminal output is visible but no input
can be sent.

```
$ zellij watch my-session-name
```

## `kill-session [target-session]`

short: `k`

Will kill the session with the name of `[target-session]`, if it is currently
running. Resurrection data is preserved.

## `kill-all-sessions`

short: `ka`

Will prompt the user to kill all running sessions.

| Flag          | Description              |
| :------------ | ------------------------ |
| `-y`, `--yes` | Automatic yes to prompts |

## `delete-session [target-session]`

short: `d`

Permanently delete a session's resurrection data.

| Flag            | Description                                          |
| :-------------- | ---------------------------------------------------- |
| `-f`, `--force` | Kill the session if it is running before deleting it |

Without `--force`, only exited (resurrectable) sessions can be deleted.

## `delete-all-sessions`

short: `da`

Permanently delete all sessions' resurrection data. Prompts for confirmation.

| Flag            | Description                                            |
| :-------------- | ------------------------------------------------------ |
| `-y`, `--yes`   | Automatic yes to prompts                               |
| `-f`, `--force` | Kill sessions if they are running before deleting them |

## `options`

Can be used to change the behaviour of zellij on startup.
Will supercede options defined in the config file.
To see a list of options look [here](./command-line-options.md).

Can also be passed after `attach` so the options apply to the session being
created or attached:

```
$ zellij attach --create my-session options --default-layout compact
$ zellij attach --create-background my-session options --default-layout /path/to/layout.kdl
```

## `setup`

Functionality to help with the setup of zellij.

| Flag                            | Description                                                  |
| :------------------------------ | ------------------------------------------------------------ |
| `--check`                       | Check the configuration and display currently used directories |
| `--clean`                       | Disable loading the configuration file at the default location; load the defaults that Zellij ships with |
| `--dump-config`                 | Dump the default configuration file to stdout                |
| `--dump-layout [LAYOUT]`        | Dump a specified default layout file to stdout               |
| `--dump-swap-layout [LAYOUT]`   | Dump the specified default swap layout file to stdout        |
| `--dump-plugins [DIR]`          | Dump the builtin plugins to `DIR`, or to the data directory if unspecified |
| `--generate-completion [SHELL]` | Generate completions for the specified shell                 |
| `--generate-auto-start [SHELL]` | Generate an auto-start script for the specified shell        |

# Flags

These flags can be invoked with `zellij --flag`.

| Flag                                 | Description                                                  |
| :----------------------------------- | ------------------------------------------------------------ |
| `-h`, `--help`                       | Display the help prompt                                      |
| `-V`, `--version`                    | Print version information                                    |
| `-d`, `--debug`                      | Gather additional debug information                          |
| `-s`, `--session [NAME]`             | Specify the name of a new session, or target an existing session for other commands |
| `-l`, `--layout [LAYOUT]`            | Name of a predefined layout inside the layout directory, or the path to a layout file. Inside a session (or with `--session`) this is added as new tab(s); otherwise a new session is started |
| `--layout-string [KDL]`              | Use a raw KDL layout string instead of a layout file         |
| `--new-session-with-layout [LAYOUT]` | Always start a new session with the given layout, even if already inside a session |
| `-c`, `--config [FILE]`              | Change where Zellij looks for the configuration file         |
| `--config-dir [DIR]`                 | Change where Zellij looks for the configuration directory    |
| `--data-dir [DIR]`                   | Change where Zellij looks for plugins                        |
| `--max-panes [N]`                    | Maximum panes on screen; opening more panes will close old ones |

## `--layout-string`

Takes a [layout](./layouts.md) as a raw KDL string rather than as a path to a layout file. Useful for scripting and for generating layouts on the fly.

If invoked from inside a Zellij session (or with an explicit `--session`), the layout is added to the running session as new tab(s). Otherwise, a new session is started with it.

This flag conflicts with `--layout` and `--new-session-with-layout`.

```
$ zellij --layout-string 'layout { pane split_direction="vertical" { pane; pane; } }'
```

The layout is parsed and validated before being sent to the session, so syntax errors are reported immediately.
