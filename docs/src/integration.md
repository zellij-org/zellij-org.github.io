# Integration

Zellij provides some environment variables, that make Integration
with existing tools possible.

```
echo $ZELLIJ
echo $ZELLIJ_SESSION_NAME
```

The `ZELLIJ_SESSION_NAME` has the session name as its value, and `ZELLIJ` gets
set to `0` inside a zellij session.
Arbitrary key value pairs can be set through configuration, or layouts.
Note that `ZELLIJ_SESSION_NAME` will not be updated for existing terminal panes when renaming a session (but will for new panes).
`ZELLIJ_SESSION_ID` identifies the session and does not change when it is renamed. Zellij commands run from a pane (eg. `zellij action`, `zellij events` or `zellij prompt`) use it to find the pane's session.


## Reporting status to the inbox
Programs and scripts can tell Zellij whether they are working, waiting for the user, finished or failed, and Zellij shows this in its [inbox](./inbox.md). Many programs already do this. See [Inbox Integrations](./inbox-integrations.md) for the list, and for a shell function that reports the status of a script.

A command can also be run in a watched pane, so that Zellij reports when it finishes:
```
zellij run --notify -- cargo build
```

## Opening Zellij from other apps
The [Zellij terminal](./zellij-terminal.md) can be opened from scripts, desktop shortcuts and other apps:

```
zellij terminal
zellij terminal --working-directory ~/code
zellij terminal -e htop
zellij terminal --inbox
zellij terminal --sessions
```

On Linux, Zellij can also become the default terminal, so that apps that open a terminal open Zellij instead. See [Desktop Setup](./desktop-setup.md#default-terminal).

## Environment variables read by Zellij

| Variable | Description |
|----------|-------------|
| `ZELLIJ_SOCKET_DIR` | The folder for session sockets. The same as `zellij terminal --socket-dir` |
| `ZELLIJ_DESKTOP_INTEGRATION` | `on` treats the environment as a desktop, `off` never offers desktop items. See [Desktop Setup](./desktop-setup.md) |
| `ZELLIJ_TERMINAL_STANDALONE` | When set, `zellij terminal` opens its window on its own, outside the desktop app (the same as `--standalone`) |
| `ZELLIJ_CONPTY_DLL` | Windows only. The path to a `conpty.dll` to use for panes, or `system` to always use the one built into Windows. See [Does Zellij run on Windows?](./faq.md#does-zellij-run-on-windows) |

Here are some limited examples to help get you started:

## Autostart on shell creation
Autostart a new zellij shell, if not already inside one.
Shell dependent, fish:
```
if status is-interactive; and isatty stdin; and not set -q ZELLIJ
  zellij
end
```

other ways, zellij provides a pre-defined auto start scripts. They only start Zellij in interactive shells that run in a terminal, so shells started by scripts or by the desktop (eg. a login shell reading the environment) are left alone.

### bash
```
echo 'eval "$(zellij setup --generate-auto-start bash)"' >> ~/.bashrc
```

### zsh
```
echo 'eval "$(zellij setup --generate-auto-start zsh)"' >> ~/.zshrc
```

### fish

⚠️ Depending on the version of the `fish` shell, the setting may not work. In that case, check out this [issue](https://github.com/zellij-org/zellij/issues/1534).

Add 

```fish
if status is-interactive
    ...
    eval (zellij setup --generate-auto-start fish | string collect)
end
```

to `$HOME/.config/fish/config.fish` file.


The following environment variables can also be used in the provided script.

| Variable             | Description                                                                                          | default |
|----------------------|------------------------------------------------------------------------------------------------------|---------|
| `ZELLIJ_AUTO_ATTACH` | If the zellij session already exists, attach to the default session. (not starting as a new session) |  false  |
| `ZELLIJ_AUTO_EXIT`   | When zellij exits, the shell exits as well.                                                          |  false  |

## List current sessions
List current sessions, attach to a running session, or create a new one.
Depends on [`fzf`](https://github.com/junegunn/fzf) & `bash`.

```sh
#!/usr/bin/env bash
ZJ_SESSIONS=$(zellij list-sessions)
NO_SESSIONS=$(echo "${ZJ_SESSIONS}" | wc -l)

if [ "${NO_SESSIONS}" -ge 2 ]; then
    zellij attach \
    "$(echo "${ZJ_SESSIONS}" | fzf --bind 'enter:become(echo {1})' --ansi)"
else
   zellij attach -c
fi
```

## List layout files and create a layout
List layout files saved in the default layout directory,
opens the selected layout file.
Depends on: `tr`, `fd`, `sed`, `sk`, `grep` & `bash`

```
#!/usr/bin/env bash
set -euo pipefail
ZJ_LAYOUT_DIR=$(zellij setup --check \
    | grep "LAYOUT DIR" - \
    | grep -o '".*"' - | tr -d '"')

if [[ -d "${ZJ_LAYOUT_DIR}" ]];then
        ZJ_LAYOUT="$(fd --type file . "${ZJ_LAYOUT_DIR}" \
        | sed 's|.*/||' \
        | sk \
        || exit)"
    zellij --layout "${ZJ_LAYOUT}"
fi
```
