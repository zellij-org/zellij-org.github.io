# FAQ

## Zellij overrides certain key combinations that I use for other apps, what can I do?
The best and easiest way is to choose the "Unlock-First (non-colliding)" [keybinding preset](./keybinding-presets.md). If that is not sufficient for your use case, you can also [choose different modifiers](./changing-modifiers.md).

## The UI takes up too much space, what can I do about it?

You can load the `compact` layout with `zellij --layout compact`.

Additionally, you can disable pane frames either at runtime with `Ctrl + <p> + <z>` or through the [config](./configuration.md) with `pane_frames: false`.

## I see broken characters in the default UI, how can I fix this?
This means your default terminal font doesn't include some special characters used by Zellij. A safe bet would be to install and use a font from [nerdfonts](https://www.nerdfonts.com).

If you don't want to install a new font, you can also load the simplified UI that doesn't use these characters, with:
```
zellij options --simplified-ui true
```

## I am a macOS user, how can I use the Alt key?
This depends on which terminal emulator you're using. Here are some links that might be useful:
1. [iTerm2](https://www.reddit.com/r/zellij/comments/13twru4/comment/kpmsjv2/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button)
2. [Terminal.app](https://superuser.com/questions/1038947/using-the-option-key-properly-on-mac-terminal)
3. [Alacritty](https://github.com/zellij-org/zellij/issues/2051#issuecomment-1461519892)

## Copy / Paste isn't working, how can I fix this?
Some terminals don't support the the OSC 52 signal, which is the method Zellij uses by default to copy text to the clipboard. To get around this, you can either switch to a supported terminal (eg. Alacritty or xterm) or configure Zellij to use an external utility when copy pasting (eg. xclip, wl-copy or pbcopy).

To do the latter, add one of the following to your [Zellij Config](./configuration.md):

```
copy_command "xclip -selection clipboard" # x11
copy_command "wl-copy"                    # wayland
copy_command "pbcopy"                     # osx
copy_command "clip.exe"                   # Windows WSL2
```

Note that the only method that works when connecting to a remote Zellij session (eg. through SSH) is OSC 52. If you require this functionality, please consider using a terminal that supports it.

## How can I use floating panes?
You can toggle showing/hiding floating panes with `Ctrl + <p> + <w>` (if no floating panes are open, one will be opened when they are shown).

In this mode you can create additional windows as you would normally create panes (eg. with `Alt + <n>`). Move them with the mouse or the keyboard, and resize them as you would normally resize or move Zellij panes.

You can also embed a floating pane with `Ctrl + <p> + <e>`, and float an embedded pane in the same way.

## How can I switch between sessions or launch a new session from within Zellij?
You can use the built-in `session-manager`. By default, launch it with `Ctrl o` + `w`.

## Editing the pane scrollbuffer with `ctrl + <s> + <e>` doesn't work, what's wrong?

By default, Zellij looks for an editor defined in the `EDITOR` or `VISUAL` environment variables (in this order).
Make sure one is set (eg. `export EDITOR=/usr/bin/vim`) before Zellij starts.
Alternatively, you can set one in the Zellij [config](./configuration.md) using `scrollback-editor`.

