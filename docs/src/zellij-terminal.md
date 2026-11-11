# Zellij Terminal

Zellij can run in its own window, without another terminal emulator. This is the Zellij terminal, started with `zellij terminal`.

The Zellij terminal is a full terminal for Zellij sessions. On top of what Zellij does inside any terminal, it adds:

- A desktop app that keeps sessions running after their window is closed
- A tray (or menu bar) icon showing what needs you, with the [inbox](./inbox.md) and the session list one click away
- Desktop notifications when a command finishes, fails or needs you
- A desktop entry, so Zellij opens from the app menu, the Dock or the Start menu like any other app (see [Desktop Setup](./desktop-setup.md))

The look and behavior of the window (font, padding, cursor, opacity, keys, etc.) are set in the `terminal` block of the configuration file, described in [Terminal Options](./terminal-options.md). They can also be changed in the "Zellij terminal" category of the [settings screen](./settings-screen.md).

## Platforms

The Zellij terminal runs on Linux (X11 and Wayland), macOS and Windows.

It needs a desktop. On Linux, a desktop is one where `DISPLAY` or `WAYLAND_DISPLAY` is set. Over SSH (`SSH_CONNECTION`, `SSH_CLIENT` or `SSH_TTY` set), inside a container or in WSL, the desktop features described in [Desktop Setup](./desktop-setup.md) are not offered. A window started from such a place opens on the computer running Zellij, not on the one the user is sitting at.

The Zellij terminal is part of the default build. Zellij built with `--no-default-features` and without the `terminal` feature does not include it.

## Starting the Zellij terminal

Any of these opens a Zellij terminal window:

- Running `zellij terminal` from a terminal or a desktop shortcut
- Opening Zellij from the app menu, the Dock, Spotlight or the Start menu, once the [desktop entry](./desktop-setup.md) is installed
- On Linux (with a desktop) and macOS: double-clicking the `zellij` binary in a file manager. When `zellij` is started without arguments and without a terminal, it opens a window instead
- On Windows: running `zellij-terminal.exe`. This small launcher ships next to `zellij.exe` in the zip and in the MSI installer. It opens the window without a console and runs `zellij.exe terminal` with the same arguments

Without arguments, `zellij terminal` starts a new session with a generated name. Given a session name, it attaches to that session, the same way [`zellij attach`](./commands.md) does.

## Flags

`zellij terminal` accepts everything `zellij attach` accepts, plus the flags below.

| Flag | Description |
|:-----|:------------|
| `[SESSION_NAME]` | The session to attach to. A `http://` or `https://` URL attaches to a session on another machine through its [web server](./web-client.md#remote-terminal-attach) |
| `-c`, `--create` | Create the session if it does not exist |
| `--index <INDEX>` | Attach to the session with this index |
| `-f`, `--force-run-commands` | When resurrecting a session, run all its commands immediately |
| `-t`, `--token <TOKEN>` | Authentication token for remote sessions |
| `-r`, `--remember` | Save the remote session for automatic re-authentication |
| `--forget` | Delete the saved remote session before connecting |
| `--ca-cert <FILE>` | For remote sessions: a custom CA certificate to trust for the remote server (eg. one with a self-signed certificate) |
| `--insecure` | For remote sessions: skip checking the remote server's certificate (development only) |
| `-- <COMMAND>` | Run this command in the first pane of the session, if it is created |
| `--close-on-exit` | Close the initial command's pane when it exits |
| `--start-suspended` | Start the initial command suspended, only running it after ENTER is pressed |
| `-e <COMMAND>...` | Run this command (and every argument after it) as the first pane, close the pane when it exits, and wait for it, exiting with its exit code (as other terminal emulators do) |
| `--hold` | Keep the command's pane open after the command exits, showing its output. Needs a command |
| `--working-directory <DIR>` | Start in this folder instead of the current one |
| `--watch` | Follow the screen of the session's first client, read-only |
| `--startup-mode <MODE>` | Open the window `windowed`, `maximized`, `fullscreen`, or the way the last one was closed (`remember`). Overrides [`startup_mode`](./terminal-options.md#startup_mode) |
| `--standalone` | Open this window on its own instead of handing it to the running desktop app. Such a window has no tray icon and sends no desktop notifications |
| `--socket-dir <PATH>` | Use this folder for session sockets instead of the default, so this window, its desktop app and its sessions are separate from every other Zellij. The same as setting `ZELLIJ_SOCKET_DIR` |
| `--inbox` | Show or hide the inbox panel of the running desktop app, starting it if needed. Meant for a desktop keyboard shortcut |
| `--sessions` | Show or hide the sessions panel of the running desktop app, starting it if needed. Meant for a desktop keyboard shortcut |

Examples:

```
$ zellij terminal
$ zellij terminal -c my-project
$ zellij terminal --working-directory ~/code -- htop
$ zellij terminal -e make test
$ zellij terminal --inbox
$ zellij terminal https://my-server:8082/my-session
```

## The desktop app

Windows opened with `zellij terminal` are run by one desktop app in the background. The first `zellij terminal` starts it, and later ones hand their window over to it.

- **Closing a window keeps its session running.** It can be opened again from the session list. This follows the [`on_force_close`](./options.md#on_force_close) option: with `on_force_close "quit"`, closing a window quits its session instead.
- **One window per session.** With `reuse_session_windows` on (the default), switching a window to a session that another window already shows brings that other window forward instead. See [`reuse_session_windows`](./terminal-options.md#reuse_session_windows).
- Windows opened with `--standalone`, `--watch`, a remote URL, `--index`, an `options` subcommand, or with the `ZELLIJ_TERMINAL_STANDALONE` environment variable set run on their own, outside the desktop app.

### The tray icon

The desktop app shows a tray icon (a menu bar icon on macOS, a notification-area icon on Windows). It shows when something needs you, with a badge counting the items in the [inbox](./inbox.md). Clicking it opens the inbox and the session list.

Its menu has:

- Show inbox, Show sessions, New window
- Detach all: close all windows, or detach every client from every session
- Clear all notifications, Pause notifications (for 1 hour or until tomorrow), and a Notifications sub-menu choosing what is notified and counted
- Hide icon: until the next launch, or permanently (this saves `tray_icon false` in the [`attention` block](./inbox.md#configuration))
- Quit Zellij and stop all sessions

The icon can also be toggled with `zellij action toggle-tray-icon` until the app restarts. Sessions and notifications keep working while it is hidden.

The launcher's right-click menu (in the app menu, the Dock or the taskbar) has Show Inbox and Show Sessions as well. `zellij terminal --inbox` and `zellij terminal --sessions` do the same, and can be bound to a desktop keyboard shortcut.

### Desktop notifications

The desktop app turns [inbox](./inbox.md) items into desktop notifications: when something needs you, when a command fails and when a long command finishes. Which ones are shown, and whether they include the command text, is set in the `desktop_notifications` and `notification_details` settings of the [`attention` block](./inbox.md#configuration), or in Settings → Notifications.

## Platform notes

### Linux

- The tray icon needs a tray host (a StatusNotifierItem host). On GNOME this is the AppIndicator extension. Tiling window managers need a bar with a tray, such as waybar or i3bar.
- Desktop notifications need a notification service, such as mako or dunst on tiling window managers.
- When one of these is missing, the welcome card shown in a new window explains what to install.
- Setting Zellij as the default terminal lets other apps (eg. a file manager's "Open terminal here") open it. See [Desktop Setup](./desktop-setup.md#default-terminal).
- The middle mouse button pastes the primary selection.
- Touchpad scroll momentum is only available on Wayland.

### macOS

- Zellij.app can be installed from the setup screen, see [Desktop Setup](./desktop-setup.md#macos). It opens from Finder, Spotlight or the Dock, gets the environment of the login shell, and opens a window again when clicked after its last window was closed.
- Desktop notifications only work from the Zellij inside Zellij.app. If a `zellij terminal` started from a terminal is already running when Zellij.app is opened, the app hands over to it, and notifications do not work until that one is quit.
- The window has the standard macOS menu. Quitting from the Dock saves the state of every window.
- Which Option key acts as Alt is set with [`macos_option_as_alt`](./terminal-options.md#macos_option_as_alt).
- The Cmd versions of the copy, paste and zoom keys work in addition to the Ctrl ones.

### Windows

- `zellij-terminal.exe` opens the window without a console. With no console to print to, errors are shown in a message box.
- Desktop notifications are Windows toasts. Clicking one brings its window forward. If Windows has notifications turned off for Zellij, the welcome card says so.
- The tray icon is in the notification area. It comes back after Explorer restarts.
- Ctrl+C or closing the console the app was started from quits the desktop app cleanly. Sessions keep running.
- A Start menu shortcut and an "Open Zellij here" item in Explorer can be added from the MSI installer or the setup screen, see [Desktop Setup](./desktop-setup.md#windows).
