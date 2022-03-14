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

## List current sessions
List current sessions, attach to a running session, or create a new one.
Depends on `sk` & `bash`

```
#!/usr/bin/env bash
ZJ_SESSIONS=$(zellij list-sessions)
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
