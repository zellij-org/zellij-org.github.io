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


Here are some limited examples to help get you started:

## Autostart on shell creation
Autostart a new zellij shell, if not already inside one.
Shell dependent, fish:
```
if set -q ZELLIJ
else
  zellij
end
```

other ways, zellij provides a pre-defined auto start scripts.

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
Depends on [`sk`](https://github.com/lotabout/skim) & `bash`

```
#!/usr/bin/env bash
ZJ_SESSIONS=$(zellij list-sessions --short --no-formatting)
NO_SESSIONS=$(echo "${ZJ_SESSIONS}" | wc -l)

if [ "${NO_SESSIONS}" -ge 2 ]; then
    zellij attach \
    "$(echo "${ZJ_SESSIONS}" | sk)"
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
