# Plugin API - Logging

Whatever plugins print to their `STDERR` will be logged in the zellij log.

The Zellij log is located at: `/$temp_dir/zellij-<UID>/zellij-log/zellij.log`. `$temp_dir`, in most systems will be `/tmp`, but there can be exceptions, such as `/var/folders/dr/xxxxxxxxxxxxxx/T/` for Mac (accessible via the $TMPDIR environment variable).

To open the latest logfile on Linux:

```
less /tmp/zellij-$(id -u)/zellij-log/zellij.log
```

To open the latest logfile on Mac:

```
less "$TMPDIR"/zellij-$(id -u)/zellij-log/zellij.log
```
