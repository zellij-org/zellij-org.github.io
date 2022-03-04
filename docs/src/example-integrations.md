# Example Integrations

Zellij sets the following Environment Variables on start:

- ZELLJI=0
- ZELLIJ_SESSION_NAME=${The session name of the currently connected session.}

You can create a chooser script that allows you to attach to a specific
session:
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

## Start `zellij` on loading your shell

You can configure your shell to autostart `zellij`, as that is very
shell dependend here an example for the `fish` shell:
```
if set -q ZELLIJ
else
  zellij
end
```
