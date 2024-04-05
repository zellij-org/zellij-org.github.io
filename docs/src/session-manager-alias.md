# The session-manager alias

This alias, by default translated to the internal `zellij:session-manager` plugin url, represents the session-manager loaded by default with `Ctrl o` + `w`.

## Contract
Zellij loads the session-manager as a floating pane as part of the default keybindings.

## User expectations
Users will likely expect the session-manager to:
1. Allow them to switch between active sessions
2. Allow them to resurrect exited sessions
3. Allow them to start a new session
4. Allow them to rename the current session
5. Allow them to disconnect other users (clients) in the current session
6. Allow them to kill active sessions and permanently delete exited sessions
