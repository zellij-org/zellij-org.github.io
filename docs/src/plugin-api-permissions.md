# Permissions
The plugin system provides a permission system to provide extra security and protection to the user.

The system places certain [Events](./plugin-api-events.md) and [Commands](./plugin-api-commands.md) behind certain permissions.
Plugins who want to listen to these events or use these commands should prompt the user to grant them these permissions with the `request_permission` command.

## Permissions
### ReadApplicationState
Access Zellij state (Panes, Tabs and UI)

### ChangeApplicationState
Change Zellij state (Panes, Tabs and UI)

### OpenFiles
Open files (eg. for editing)

### RunCommand
Run commands in panes or silently

### OpenTerminalsOrPlugins
Start new terminals and plugins

### WriteToStdin
Write to STDIN as if it were the user

### Reconfigure
Change the [configuration](./configuration.md) (running and also saved in the configuration file) of Zellij.
