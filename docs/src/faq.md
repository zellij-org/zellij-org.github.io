# FAQ

## Zellij overrides certain key combinations that I use for other apps, what can I do?
The best and easiest way is to choose the "Unlock-First (non-colliding)" [keybinding preset](./keybinding-presets.md). If that is not sufficient for your use case, you can also [choose different modifiers](./changing-modifiers.md).

## The UI takes up too much space, what can I do about it?

You can load the `compact` layout with `zellij --layout compact`.

The bars (eg. the tab bar and the status bar) can also be hidden:

- **While Zellij runs**: with `Shift z` in `pane` mode (the [`ToggleBars`](./keybindings-possible-actions.md#togglebars) action), with "Hide all bars" in the [right-click menu](./context-menu.md) of a bar, or with [`zellij action hide-bars`](./cli-actions.md#hide-bars). They come back the same way, or with [`ShowBars`](./keybindings-possible-actions.md#showbars).
- **From the start**: with the [`bars_hidden_on_start`](./options.md#bars_hidden_on_start) option, eg. `bars_hidden_on_start "all"`.

While the bar with the keys of the current mode is hidden, those keys are shown in a corner of the screen when entering a mode (see [`mode_hints_when_bars_hidden`](./options.md#mode_hints_when_bars_hidden)).

## Things don't work right in my terminal emulator, what can I do?
Some problems come from the terminal emulator Zellij runs in rather than from Zellij: copy / paste not working, keys (eg. `Alt` on macOS) not reaching Zellij, missing or broken characters, missing colors or images.

The easiest solution is the [Zellij terminal](./zellij-terminal.md) (`zellij terminal`), Zellij's own window, where these work without any setup.

The entries below explain how to fix these in other terminals.

## I see broken characters in the default UI, how can I fix this?
This means your default terminal font doesn't include some special characters used by Zellij. A safe bet would be to install and use a font from [nerdfonts](https://www.nerdfonts.com).

If you don't want to install a new font, you can also load the simplified UI that doesn't use these characters, with:
```
zellij options --simplified-ui true
```

The [Zellij terminal](./zellij-terminal.md) includes the Nerd Font symbols, so these characters are shown there without installing a font.

## I am a macOS user, how can I use the Alt key?
In the [Zellij terminal](./zellij-terminal.md), the left Option key acts as Alt by default. This can be changed with the [`macos_option_as_alt`](./terminal-options.md#macos_option_as_alt) setting of the `terminal` block (`"left"`, `"right"`, `"both"` or `"none"`):

```javascript
terminal {
    macos_option_as_alt "both"
}
```

For other terminal emulators, this depends on which one you're using. Here are some links that might be useful:
1. [iTerm2](https://www.reddit.com/r/zellij/comments/13twru4/comment/kpmsjv2/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button)
2. [Terminal.app](https://superuser.com/questions/1038947/using-the-option-key-properly-on-mac-terminal)
3. [Alacritty](https://github.com/zellij-org/zellij/issues/2051#issuecomment-1461519892)

## Copy / Paste isn't working, how can I fix this?
Some terminals don't support the OSC 52 signal, which is the method Zellij uses by default to copy text to the clipboard. To get around this, you can switch to a supported terminal (eg. the [Zellij terminal](./zellij-terminal.md), Alacritty or xterm) or configure Zellij to use an external utility when copy pasting (eg. xclip, wl-copy or pbcopy).

To do the latter, add one of the following to your [Zellij Config](./configuration.md):

```javascript
copy_command "xclip -selection clipboard" // x11
copy_command "wl-copy"                    // wayland
copy_command "pbcopy"                     // osx
```

Note that the only method that works when connecting to a remote Zellij session (eg. through SSH) is OSC 52. If you require this functionality, please consider using a terminal that supports it.

## How can I use floating panes?
You can toggle showing/hiding floating panes with `Ctrl + <p> + <w>` (if no floating panes are open, one will be opened when they are shown).

In this mode you can create additional windows as you would normally create panes (eg. with `Alt + <n>`). Move them with the mouse or the keyboard, and resize them as you would normally resize or move Zellij panes.

You can also embed a floating pane with `Ctrl + <p> + <e>`, and float an embedded pane in the same way.

## How can I switch between sessions or launch a new session from within Zellij?
You can use the built-in `session-manager`. By default, launch it with `Ctrl o` + `w`.

`session` mode (`Ctrl o`) also has keys to move between sessions directly:

| Key (in `session` mode) | Action |
|---|---|
| `Tab` | Go back to the session this client was in before (press again to return), or to the next running session if there is none |
| `Left` / `Right` | Go back / forward in the list of sessions this client has visited |
| `n` | Jump to the next pane that needs attention, in any session |
| `i` | Open the session card with the [inbox](./inbox.md) |

Other running sessions are also suggested in the session-manager and on the session card; see [session suggestions](./session-suggestions.md).

## Does Zellij run on Windows?
Yes. Zellij runs natively on Windows. The following differences apply compared to Linux/macOS:

- **IPC**: Named pipes (`\\.\pipe\...`) are used instead of Unix domain sockets. The maximum socket path length is 256 characters (vs 104 on macOS and 108 on Linux).
- **PTY**: Windows pseudo-terminals (ConPTY) are used instead of Unix PTYs.
- **Web Server**: The built-in web server is fully functional on Windows, including the `--daemonize` flag which uses a `--server-startup-timeout` option (default: 10 seconds) for background server startup.
- **Session names**: a session name cannot contain `\`. Renamed sessions can be attached to again on Windows.
- **Desktop app**: Zellij can run in its own window, the [Zellij terminal](./zellij-terminal.md), started with `zellij-terminal.exe` (installed next to `zellij.exe`) or `zellij terminal`. It has an icon in the notification area (tray) and shows notifications as Windows notifications. The setup screen can add a Start menu shortcut and an "Open Zellij here" item to the Explorer right-click menu of folders and drives (see [desktop setup](./desktop-setup.md#windows)).

## Can I upgrade Zellij without losing my running sessions?
Yes. Sessions persist across Zellij version upgrades. The IPC contract uses protocol buffers and the socket directory uses a versioned path (`contract_version_1`) rather than per-Zellij-version directories. Sessions created by one Zellij version can be attached to by another version, as long as the contract version remains the same.

The socket directory is located at:
- **Linux/macOS**: `$XDG_RUNTIME_DIR/zellij/contract_version_1/` (or equivalent)
- **Windows**: Named pipes under the `contract_version_1` namespace

**Note for script authors:** If existing scripts reference the old per-version socket paths, they should be updated to use the new `contract_version_1` path structure.

Each session's socket (or named pipe) is named after a short id of 12 hexadecimal characters rather than after the session's name, so renaming a session renames nothing on disk. Scripts should not build socket paths from session names; use `zellij list-sessions` and `zellij --session <name> action ...` instead. If the socket directory itself is too long for the system's limit, Zellij says so when it starts and suggests a shorter one through the `ZELLIJ_SOCKET_DIR` environment variable.

## Editing the pane scrollbuffer with `ctrl + <s> + <e>` doesn't work, what's wrong?

By default, Zellij looks for an editor defined in the `EDITOR` or `VISUAL` environment variables (in this order).
Make sure one is set (eg. `export EDITOR=/usr/bin/vim`) before Zellij starts.
Alternatively, you can set one in the Zellij [config](./configuration.md) using `scrollback_editor`.

## Programs in my panes cannot read the clipboard, why?

Since `0.45.0`, Zellij replies with an empty clipboard to programs that attempt to *read* the clipboard through OSC 52. Copying (OSC 52 write) is unaffected.

Clipboard reading can be enabled with the [`dangerously_enable_paste_buffer_read`](./options.md#dangerously_enable_paste_buffer_read) option, but note that once enabled, **any** program in **any** pane (including one connected over SSH) can read the system clipboard without prompting.

