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

### FullHdAccess
Access the full HD on the machine rather than just the folder in which Zellij was started.

### StartWebServer
Control (start, stop, get status, manage login tokens) the Zellij [web-server](./web-client.md)

### InterceptInput
Intercept user input (eg. keypresses), having all of this input sent to the plugin instead.

### ReadPaneContents
Read the rendered contents of terminal panes. Required for subscribing to `PaneRenderReport` and `PaneRenderReportWithAnsi` events.

### RunActionsAsUser
Execute Zellij actions as if they were performed by the user. Required for the `run_action` plugin API command.

### WriteToClipboard
Write text directly to the user's clipboard.

### ReadSessionEnvironmentVariables
Read environment variables from the session context.
