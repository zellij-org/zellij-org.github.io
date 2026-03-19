# The session-manager alias

This alias, by default translated to the internal `zellij:session-manager` plugin url, represents the session-manager loaded by default with `Ctrl o` + `w`.

## Overview
The session manager provides a centralized interface for managing all Zellij sessions. It is loaded as a floating pane as part of the default keybindings.

## Features
The session manager allows the user to:
1. **Switch between active sessions** - Browse and switch to any running session
2. **Resurrect exited sessions** - Bring back previously closed sessions with their full layout and commands
3. **Start new sessions** - Create new sessions with optional names and layouts
4. **Rename the current session** - Change the name of the active session
5. **Disconnect other clients** - Disconnect other users connected to the current session
6. **Kill and delete sessions** - Kill active sessions or permanently delete exited sessions
7. **View session metadata** - See tab counts, connected clients, and other session information
8. **Web sharing controls** - Start/stop the web server and manage sharing settings from within the session manager

## Contract
Zellij loads the session-manager as a floating pane. Plugins implementing this alias should expect to be loaded in floating mode and should provide a navigable interface for the features listed above.

The session-manager is a built-in plugin and can be replaced by specifying a different plugin URL for the `session-manager` alias in the [configuration](./configuration.md).
