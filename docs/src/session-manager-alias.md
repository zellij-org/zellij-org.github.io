# The session-manager alias

This alias, by default translated to the internal `zellij:session-manager` plugin url, represents the session-manager loaded by default with `Ctrl o` + `w`.

## Overview
The session manager provides a centralized interface for managing all Zellij sessions. It is loaded as a floating pane as part of the default keybindings.

It also holds the [inbox](./inbox.md). `Tab` switches between the session list and the inbox.

## Features
The session manager allows the user to:
1. **Switch between active sessions** - Browse and switch to any running session
2. **Preview sessions** - See a live view of the selected session's panes (`←` `→` shows its tabs and panes), and click the view to type into a pane without switching to its session
3. **Resurrect exited sessions** - Bring back previously closed sessions with their full layout and commands
4. **Start new sessions** - Type a name to create a new session, or create one with a layout and a folder of your choice
5. **Rename the current session** - Change the name of the active session
6. **Disconnect other clients** - Disconnect other users connected to the current session
7. **Kill and delete sessions** - Stop active sessions or permanently delete exited sessions
8. **View session metadata** - See tab counts, connected clients, and other session information
9. **Open a session in its own window** - Open the selected session in a [Zellij terminal](./zellij-terminal.md) window

Other sessions are suggested in the list according to the [session suggestions](./session-suggestions.md) rules (eg. sessions in the same folder or git branch first).

Sharing sessions in the browser is done from the [share screen](./web-client.md) (`Ctrl o` + `s`), not from the session manager.

## Keys

| Key | Action |
|:----|:-------|
| type | Search sessions, or name a new session |
| `↓` `↑` | Select a session |
| `Enter` | Switch to, resurrect or create the selected session |
| `←` `→` | Show the tabs and panes of the selected session |
| `Tab` / `Shift Tab` | Complete the typed name, cycling through the matching sessions. When the inbox is shown, `Tab` switches to it |
| `Ctrl l` | Create a new session with a layout |
| `Ctrl r` | Rename the current session |
| `Del` | Stop or delete the selected session |
| `Shift Del` | Delete all exited sessions |
| `Alt w` | Open the selected session in a Zellij terminal window |
| `Ctrl c` | Clear the search, or close the session manager when the search is empty |
| `F1` | Show all keys |
| `Esc` | Close |

When creating a session with a layout, typing filters the layouts, `Ctrl f` chooses the folder the session starts in and `Ctrl c` resets it.

The current session can also be renamed without the session manager, with `Ctrl o` + `r`.

## Dismissing the session manager
Pressing `Esc` (or `Ctrl c` with an empty search) closes the session manager rather than hiding it. It also closes itself after switching to another session.

## Configuration

| Key | Description |
|:----|:------------|
| `welcome_screen` | When `true`, act as the [welcome screen](./welcome-screen-alias.md) |

## Contract
Zellij loads the session-manager as a floating pane. Plugins implementing this alias should expect to be loaded in floating mode and should provide a navigable interface for the features listed above.

Zellij also loads this alias to show the [inbox](./inbox.md) (eg. with `Ctrl o` + `i`, or the session card at the start of a session) and the sessions and inbox panels of the [Zellij terminal](./zellij-terminal.md), passing a `role` configuration for each.

The session-manager is a built-in plugin and can be replaced by specifying a different plugin URL for the `session-manager` alias in the [configuration](./configuration.md).
