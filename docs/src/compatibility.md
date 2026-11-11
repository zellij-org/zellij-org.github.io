# Compatibility

## Issues
Please report issues [here.](https://github.com/zellij-org/zellij/issues)

---------------------------

# Terminal Features

Zellij sits between the programs running in its panes and the terminal emulator it runs in. Some terminal capabilities are therefore passed through, translated or emulated. When Zellij starts, it queries the terminal it is running in for the features it supports, and only advertises those to the programs running inside panes.

## Images (kitty graphics protocol)

Programs running inside panes can display images using the [kitty graphics protocol](https://sw.kovidgoyal.net/kitty/graphics-protocol/). Zellij keeps track of image placements per pane, so images survive resizing, relayouts, scrolling through the scrollback, fullscreen, and floating or pinned panes.

This requires the host terminal to support the protocol, which is queried when Zellij starts. It can be turned off with the [`support_kitty_graphics_protocol`](./options.md#support_kitty_graphics_protocol) option (changing it requires restarting Zellij).

Images sent on to the host terminal are compressed (zlib, `o=z`) when the host terminal supports it, which is also checked when Zellij starts. This makes the data sent for each image many times smaller, which matters most over `ssh`.

## Sixel

Sixel graphics are supported. Sixel support is only advertised to programs running in panes (through `DA1` and `XTSMGRAPHICS`) if the terminal Zellij is attached to actually supports Sixel. In previous versions it was advertised unconditionally, which could cause programs to emit Sixel data into terminals that could not display it.

## Desktop notifications

Programs running in panes can raise desktop notifications through `OSC 9`, `OSC 99` (the kitty notification protocol) and `OSC 777`. Zellij forwards them to all attached host terminals, using the protocol selected by the [`host_notification_protocol`](./options.md#host_notification_protocol) option:

- `auto` (default) - `OSC 99` for terminals that support it (eg. kitty), `OSC 9` otherwise
- `osc9` / `osc99` - always use the given protocol
- `bell` - emit a terminal bell instead
- `off` - do not forward notifications

Whether a notification is actually shown is up to the host terminal and the operating system.

Notifications also become items in Zellij's [inbox](./inbox.md). When Zellij runs in its own [desktop terminal](./zellij-terminal.md#desktop-notifications), inbox items are shown as native desktop notifications of the operating system; which ones is set with `desktop_notifications` in the [`attention`](./inbox.md#configuration) block.

## Program status (OSC 7501) and shell integration (OSC 133 / OSC 633)

Programs can report what they are doing with `OSC 7501`: whether they are working, done, failed, idle or waiting for the user (eg. for an approval or an answer), optionally with a progress value and a message. Zellij shows this in the [inbox](./inbox.md), on the pane's frame and in the tab bar. Programs can ask whether `OSC 7501` is supported by sending `OSC 7501 ; ?`, which Zellij answers. When the terminal Zellij runs in also supports `OSC 7501`, Zellij reports the status of the whole session to it (the `host_status` setting of the [`attention`](./inbox.md#configuration) block). See [the inbox](./inbox.md#osc-7501) for the format, and [inbox integrations](./inbox-integrations.md) for setting up specific programs.

The `OSC 133` and `OSC 633` (VS Code) shell integration sequences let Zellij report finished and failed commands in the same way; see [shell integration](./shell-integration.md).

## Working directory (OSC 7)

The working directory reported by the focused pane with `OSC 7` is passed on to the terminal Zellij runs in, so features of that terminal that rely on it (eg. opening a new window in the same folder) follow the focused pane. It is sent again only when it changes or when focus moves to a pane that has reported one; panes that never reported one send nothing. Reports that contain control characters are dropped. Other ways shells report their working directory are listed in [shell integration](./shell-integration.md#working-directory-reports).

## Horizontal scrolling

Scrolling sideways (eg. with a touchpad or a tilting mouse wheel) is passed on to programs that turned on mouse reporting, so programs that scroll horizontally (eg. editors with long lines) receive it. The default [mouse bindings](./mouse-bindings.md) bind `ScrollLeft` and `ScrollRight` to `ScrollColumns 4`.

## Grapheme clusters (mode 2027)

Zellij measures text by grapheme clusters, as the Unicode standard does: a sequence of characters that is shown as one symbol, such as a flag, an emoji with a skin tone or a letter with accents, takes up the width of that one symbol. This can be turned off with the [`grapheme_clusters`](./options.md#grapheme_clusters) option (it applies to new panes), in which case each character is measured on its own, the way older programs expect.

Programs can turn grapheme cluster handling on for their pane with mode 2027 (`CSI ? 2027 h`) even when the option is off. Turning the mode off (`CSI ? 2027 l`) goes back to the option's setting, and the mode can be queried with `DECRQM` (`CSI ? 2027 $ p`).

## Terminal focus reporting

Focus in/out events reported by the host terminal (`CSI I` / `CSI O`) are tracked per connected client and forwarded to panes that enabled focus reporting (mode `1004`). This also works across [nested sessions](./nested-sessions.md).

## Clipboard (OSC 52)

Copying to the system clipboard through `OSC 52` works as before, and this capability is advertised to programs through `DA1`. If the terminal does not support `OSC 52`, an external utility can be used instead with the [`copy_command`](./options.md#copy_command) option.

**Reading** the clipboard through `OSC 52` is disabled by default since `0.45.0`: programs asking for the clipboard contents receive an empty reply. It can be enabled with the [`dangerously_enable_paste_buffer_read`](./options.md#dangerously_enable_paste_buffer_read) option, but note that once enabled, any program in any pane - including one running on a remote machine over SSH - can read the clipboard without prompting.

## Terminal color scheme

Zellij follows the color scheme reported by the host terminal (`DSR 997` replies and `CSI 2031` notifications) and can switch between a light and a dark theme accordingly - see [themes](./themes.md#automatic-dark-and-light-theme-switching). Programs running in panes can subscribe to these notifications themselves with `CSI ? 2031 h`, and query the current mode with `DECRQM`; Zellij answers these queries itself.

---------------------------

# Known Issues

## The status bar fonts don't render correctly:

This most likely is caused by a missing character in the font.

Fonts from [nerdfonts](https://github.com/ryanoasis/nerd-fonts) can fix this problem.


Some Options:

| Package Manager   |      Name      |
|-------------------|:--------------:|
| apt               |fonts-powerline |
| nix               |    nerdfonts   |

Post installation the appropriate environment needs to be aware of the font.

## Alt button mapping on Mac hardware (Darwin systems):

This can be mitigated individually on a terminal emulator level,
see [the FAQ](./faq.md#i-am-a-macos-user-how-can-i-use-the-alt-key) for more information.

## Pane frame title has issues with kitty:

This sadly seems to be an issue that can not be mitigated easily,
more information can be found [here](https://github.com/zellij-org/zellij/issues/689#issuecomment-914057955).

## Mouse issues:

If `mouse_mode` is turned on zellij handles these events, zellij provides an
escape mechanism in the form of the `SHIFT` Key, once it is pressed zellij lets
the terminal handle selection, clicking on links, copying, scrolling.

More information can be found [here](https://github.com/zellij-org/zellij/issues/627)


## Clipboard not working:

This is a known problem which mostly occurs in specific terminal emulators
under Linux/OS X such as GNOMEs default Terminal, terminator, and more.

A workaround for this was added in zellij > 0.24.0 and enables the user to
specify a custom command that copies selected text to the system clipboard.
Refer to lines containing "copy_command" from the output of `zellij setup
--dump-config`.

Note that since `0.45.0`, the `copy_command` process is no longer killed while it
still owns the selection, which fixes copying with utilities such as `wl-copy`.

For technical background, refer to [this
issue](https://github.com/zellij-org/zellij/issues/627) and [this merge
request](https://github.com/zellij-org/zellij/pull/996)

## Backspace sending ctrl-h (entering into `Move` mode)
This can happen in some terminal emulators (eg. Xterm). It can be remedied either on the terminal emulator side by getting the terminal emulator to send `^?` instead of `^H`, or on the Zellij side by remapping ctrl-h to some other key. Here's an example fix in xterm: http://www.hypexr.org/linux_ruboff.php

## Weird colors in certain applications running inside Zellij
This might happen due to Zellij support of the extended "styled_underlines" feature. You can try disabling them by adding `styled_underlines false` to your config.
