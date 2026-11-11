# Options

Configuration options can be set directly at the root of the [configuration file](./configuration.md)

 These include:

---

- [on_force_close](#on_force_close)
- [simplified_ui](#simplified_ui)
- [default_shell](#default_shell)
- [pane_frames](#pane_frames)
- [theme](#theme)
- [theme_dark](#theme_dark)
- [theme_light](#theme_light)
- [default_layout](#default_layout)
- [default_mode](#default_mode-locked)
- [mouse_mode](#mouse_mode)
- [scroll_buffer_size](#scroll_buffer_size)
- [copy_command](#copy_command)
- [copy_clipboard](#copy_clipboard)
- [copy_on_select](#copy_on_select)
- [scrollback_editor](#scrollback_editor)
- [mirror_session](#mirror_session)
- [layout_dir](#layout_dir)
- [theme_dir](#theme_dir)
- [env](#env)
- [rounded_corners](#rounded_corners)
- [hide_session_name](#hide_session_name)
- [border_style](#border_style)
- [auto_layout](#auto_layout)
- [styled_underlines](#styled_underlines)
- [session_serialization](#session_serialization)
- [serialize_pane_viewport](#serialize_pane_viewport)
- [scrollback_lines_to_serialize](#scrollback_lines_to_serialize)
- [serialization_interval](#serialization_interval)
- [disable_session_metadata](#disable_session_metadata)
- [stacked_resize](#stacked_resize)
- [show_startup_tips](#show_startup_tips)
- [show_release_notes](#show_release_notes)
- [post_command_discovery_hook](#post_command_discovery_hook)
- [web_server](#web_server)
- [web_server_ip](#web_server_ip)
- [web_server_port](#web_server_port)
- [web_server_cert](#web_server_cert)
- [web_server_key](#web_server_key)
- [enforce_https_for_localhost](#enforce_https_for_localhost)
- [dangerously_allow_web_serving_without_a_certificate](#dangerously_allow_web_serving_without_a_certificate)
- [base_url](#base_url)
- [web_client](#web_client)
- [client_async_worker_tasks](#client_async_worker_tasks)
- [advanced_mouse_actions](#advanced_mouse_actions)
- [default_cwd](#default_cwd)
- [osc8_hyperlinks](#osc8_hyperlinks)
- [session_name](#session_name)
- [attach_to_session](#attach_to_session)
- [support_kitty_keyboard_protocol](#support_kitty_keyboard_protocol)
- [web_sharing](#web_sharing)
- [mouse_hover_effects](#mouse_hover_effects)
- [visual_bell](#visual_bell)
- [focus_follows_mouse](#focus_follows_mouse)
- [mouse_click_through](#mouse_click_through)
- [pane_frame_style](#pane_frame_style)
- [stacked_pane_list](#stacked_pane_list)
- [support_kitty_graphics_protocol](#support_kitty_graphics_protocol)
- [mouse_scroll_resize](#mouse_scroll_resize)
- [mouse_hover_tips](#mouse_hover_tips)
- [osc133_command_selection](#osc133_command_selection)
- [word_separators](#word_separators)
- [host_notification_protocol](#host_notification_protocol)
- [nested_session_handling](#nested_session_handling)
- [dangerously_enable_paste_buffer_read](#dangerously_enable_paste_buffer_read)
- [scroll_mode_sync](#scroll_mode_sync)
- [explicit_theme_hue](#explicit_theme_hue)
- [on_quit](#on_quit)
- [bars_hidden_on_start](#bars_hidden_on_start)
- [hidden_bars_notification](#hidden_bars_notification)
- [mode_hints_when_bars_hidden](#mode_hints_when_bars_hidden)
- [session_indicator](#session_indicator)
- [swap_layout_notification](#swap_layout_notification)
- [stacked_pane_list_orientation](#stacked_pane_list_orientation)
- [grapheme_clusters](#grapheme_clusters)
- [mirror_resizes_source_pane](#mirror_resizes_source_pane)
- [live_view_release_key](#live_view_release_key)
- [keybinds_dir](#keybinds_dir)
- [context_menu_enabled](#context_menu_enabled)
- [context_menu](#context_menu)
- [session_suggestions](#session_suggestions)
- [terminal](#terminal)
- [attention](#attention)

---

### on_force_close

Choose what to do when zellij receives SIGTERM, SIGINT, SIGQUIT or SIGHUP
eg. when terminal window with an active zellij session is closed. This also applies to closing a window of the [Zellij terminal](./zellij-terminal.md).

Options:
  - detach (Default)
  - quit

```javascript
on_force_close "quit"
```

### simplified_ui

Send a request for a simplified ui (without arrow fonts) to plugins

Options:
  - true
  - false (Default)

```javascript
simplified_ui true
```
### default_shell

Choose the path to the default shell that zellij will use for opening new panes

Default: $SHELL

```javascript
default_shell "fish"
```

### pane_frames

Toggle between having pane frames around the panes. The style of these frames is controlled by [`pane_frame_style`](#pane_frame_style) - since `0.45.0` the default style is a single title line above each pane rather than a full border.

Options:
  - true (default)
  - false

```javascript
pane_frames true
```
### theme

Choose the Zellij color theme. This theme must be specified in the themes section or loaded from the themes folder. See [themes](./themes.md)

Setting `theme` pins the session to this theme and turns off the automatic switching between the bundled `default` and `default-light` themes. Switching still happens if both [`theme_dark`](#theme_dark) and [`theme_light`](#theme_light) are also set.

Since `0.46.0`, the `default` theme has a new palette. The previous default theme is bundled as `classic`.

Default: default

```javascript
theme "default"
```

### theme_dark

Name of the theme to use as the "dark" theme. Used by the `SetDarkTheme` / `ToggleTheme` actions, and applied automatically when the host terminal reports it is in dark mode (CSI 2031 / DSR 997). The named theme must be specified in the themes section or loaded from the themes folder. See [themes](./themes.md#automatic-dark-and-light-theme-switching)

Default: `default` when [`theme`](#theme) is not set, otherwise unset

```javascript
theme_dark "catppuccin-mocha"
```

### theme_light

Name of the theme to use as the "light" theme. Used by the `SetLightTheme` / `ToggleTheme` actions, and applied automatically when the host terminal reports it is in light mode (CSI 2031 / DSR 997). The named theme must be specified in the themes section or loaded from the themes folder. See [themes](./themes.md#automatic-dark-and-light-theme-switching)

Default: `default-light` when [`theme`](#theme) is not set, otherwise unset

```javascript
theme_light "catppuccin-latte"
```

### default_layout

The name of the layout to load on startup (must be in the layouts folder). See [layouts](./layouts.md)

Default: "default"

```javascript
default_layout "compact"
```

### default_mode "locked"

Choose the mode that zellij uses when starting up and returns to after actions.

Default: normal

```javascript
default_mode "locked"
```

### mouse_mode

Toggle enabling the mouse mode.
On certain configurations, or terminals this could
potentially interfere with copying text.

Options:
  - true (default)
  - false

```javascript
mouse_mode false
```

### scroll_buffer_size

Configure the scroll back buffer size
This is the number of display rows zellij stores for each pane in the scroll
back buffer. A line wider than the pane takes one row for each time it wraps.
Excess rows are discarded in a FIFO fashion.

Valid values: positive integers

Default value: 10000

```javascript
scroll_buffer_size 10000
```

### copy_command

Provide a command to execute when copying text. The text will be piped to
the stdin of the program to perform the copy. This can be used with
terminal emulators which do not support the OSC 52 ANSI control sequence
that will be used by default if this option is not set.

Examples, for X11, Wayland and macOS:

```javascript
copy_command "xclip -selection clipboard"
copy_command "wl-copy"
copy_command "pbcopy"
```

### copy_clipboard

Choose the destination for copied text
Allows using the primary selection buffer (on x11/wayland) instead of the system clipboard.
Does not apply when using copy_command.

Options:
  - system (default)
  - primary

```javascript
copy_clipboard "primary"
```

### copy_on_select

Enable or disable automatic copy of selection when releasing mouse

Default: true

```javascript
copy_on_select false
```

### scrollback_editor

Path to the default editor to use to edit pane scrollbuffer as well as the CLI and layout `edit` commands

Default: $EDITOR or $VISUAL

```javascript
scrollback_editor "/usr/bin/vim"
```

### mirror_session

When attaching to an existing session with other users,
should the session be mirrored (true)
or should each user have their own cursor (false)
Default: false

```javascript
mirror_session true
```

Note: since `0.45.0`, each tab is sized according to the viewports of only the clients currently viewing it. Clients focused on different tabs therefore no longer constrain each other, while clients viewing the same tab converge on a common size. Tabs that nobody is viewing keep their last dimensions. This behavior is not configurable.

### layout_dir

The folder in which Zellij will look for layouts

```javascript
layout_dir "/path/to/my/layout_dir"
```

### theme_dir

The folder in which Zellij will look for themes. Themes from this folder are read-only in the [settings screen](./settings-screen.md) (copy one to edit it).

```javascript
theme_dir "/path/to/my/theme_dir"
```

### env
A key -> value map of environment variables that will be set for each terminal pane Zellij starts.

```javascript
env {
    RUST_BACKTRACE 1
    FOO "bar"
}
```

### rounded_corners
Set whether the pane frames (if visible) should have rounded corners.

This config variable is set differently than others:

```javascript
ui {
    pane_frames {
        rounded_corners true
    }
}
```

### hide_session_name
Hides the session name (randomly generated or otherwise) from the UI

```javascript
ui {
    pane_frames {
        hide_session_name true
    }
}
```

### border_style
The line style of pane borders can be set, for all sides at once or for each side. Like `rounded_corners`, these keys go inside the `ui` block:

```javascript
ui {
    pane_frames {
        rounded_corners true
        border_style "single"
        border_top "double"
        border_right "single"
        border_bottom "single"
        border_left "single"
        border_rounded_corners true
        floating_border_style "double"
        floating_border_top "double"
        floating_border_right "double"
        floating_border_bottom "double"
        floating_border_left "double"
        floating_border_rounded_corners false
    }
}
```

Line styles:
  - "single" (default)
  - "double"
  - "heavy"
  - "dashed"
  - "heavy_dashed"

How the keys combine:
- `border_style` sets all four sides of tiled panes. `border_top`, `border_right`, `border_bottom` and `border_left` override one side each.
- `border_rounded_corners` overrides `rounded_corners` for tiled panes. Corners are only rounded where two thin lines (`single` or `dashed`) meet.
- The keys starting with `floating_` do the same for floating panes. Any of them that is not set takes the value of the matching tiled pane key.
- When pane frames are off and two neighboring panes ask for different styles on the line they share, that line uses `border_style`.

These can also be changed from the [settings screen](./settings-screen.md).

### auto_layout
Toggle between having Zellij lay out panes according to a predefined set of layouts whenever possible
Options:
  - true (default)
  - false

```javascript
auto_layout true
```

### styled_underlines
Toggle between supporting the extended "styled_underlines" ANSI protocol and ignoring it (can sometimes cause some issues in unsupported terminals).
Options:
  - true (default)
  - false

```javascript
styled_underlines true
```

### session_serialization
If enabled, sessions will be serialized to the cache folder (and thus become resurrectable between reboots or on exit). Read more about [session resurrection](./session-resurrection.md).
Options:
  - true (default)
  - false

```javascript
session_serialization true
```

### serialize_pane_viewport
If enabled along with `session_serialization`, the pane viewport (the visible part of the terminal excluding the scrollback) will be serialized and resurrectable as well. Read more about [session resurrection](./session-resurrection.md).
Options:
  - true
  - false (default)

```javascript
serialize_pane_viewport true
```

### scrollback_lines_to_serialize
When `serialize_pane_viewport` is enabled, setting `scrollback_lines_to_serialize` to `0` will serialize all scrollback and to any other number will serialize line number up to that scrollback. Read more about [session resurrection](./session-resurrection.md).

*Note: this might incur higher resource utilization (and certainly a higher cache folder usage...)*

Options:
  - `0`: serialize all scrollback
  - `int`: serialize this much lines for each pane (max is the scrollback limit)

```javascript
scrollback_lines_to_serialize 100
```

### serialization_interval
How often in seconds sessions are serialized to disk (if `session_serialization` is enabled).

*Note: this might incur higher resource utilization (and certainly a higher cache folder usage...)*

Options:
  - `int`: the interval in seconds

```javascript
serialization_interval 60
```

### disable_session_metadata
Enable or disable writing of session metadata to disk

*Note: If disabled, other sessions might not know metadata info on this session, so features such as the session-manager and session listing might not work properly.*

Options:
  - true
  - false (default)

```javascript
disable_session_metadata true
```

### stacked_resize
Attempt to stack panes with their neighbors when resizing non-directionally (by default `Alt+/-`).

Options:
  - true (default)
  - false

```javascript
stacked_resize true
```

### show_startup_tips
Show usage tips on Zellij startup. These can also be browsed through the `about` plugin with `Ctrl o` + `a` and then `?`.

Options:
  - true (default)
  - false

```javascript
show_startup_tips true
```

### show_release_notes
Show release notes on first run of a new version. These can also be browsed through the `about` plugin with `Ctrl o` + `a`.

Options:
  - true (default)
  - false

```javascript
show_release_notes true
```

### post_command_discovery_hook
When Zellij attempts to discover commands running inside panes so that it can serialize them, it can sometimes be inaccurate. This can happen when (for example) commands are run inside some sort of wrapper. To get around this, it's possible to define a `post_command_discovery_hook`. This is a command that will run in the context of te user's default shell and be provided the `$RESURRECT_COMMAND` that has just been discovered for a specific pane and not yet serialized. Whatever this command sends over `STDOUT` will be serialized in place of the discovered command.

Example, removing `sudo` from the start of commands:
```javascript
post_command_discovery_hook "echo \"$RESURRECT_COMMAND\" | sed 's/^sudo\\s\\+//'"
```


### web_server
Whether to start the Zellij [web-server](./web-client.md) on startup.

Options:
  - true
  - false (default)

### web_server_ip
The IP for the Zellij [web-server](./web-client.md) to listen on when it's started. Default: `127.0.0.1`.

### web_server_port
The port for the Zellij [web-server](./web-client.md) to listen on when it's started. Default: `8082`.

### web_server_cert
The path to the SSL certificate for the Zellij [web-server](./web-client.md). Note: the `web_server_key` must also be present for the server to serve itself as HTTPS.

### web_server_key
The path to the private_key of te SSL certificate for the Zellij [web-server](./web-client.md). Note: the `web_server_cert` must also be present for the server to serve itself as HTTPS.

### enforce_https_for_localhost
Whether to enforce https on localhost for the Zellij [web-server](./web-client.md). HTTPS is always enforced when listening on non-localhost addresses, unless [`dangerously_allow_web_serving_without_a_certificate`](#dangerously_allow_web_serving_without_a_certificate) is set. Requires a restart.

Options:
  - true
  - false (default)

```javascript
enforce_https_for_localhost true
```

### dangerously_allow_web_serving_without_a_certificate
Allows the Zellij [web-server](./web-client.md) to serve plain, unencrypted HTTP when it listens on an address other than localhost and no `web_server_cert` and `web_server_key` are set. Without this option, the web server refuses to start in that case.

**Warning**: anyone on the network can read and change the traffic, including login tokens. Only use this behind a trusted proxy that adds TLS, or on a fully trusted network.

This option does not override [`enforce_https_for_localhost`](#enforce_https_for_localhost). Requires a restart.

Options:
  - true
  - false (default)

```javascript
dangerously_allow_web_serving_without_a_certificate true
```

### base_url
Set the base URL path for the Zellij [web-server](./web-client.md). When set, the web server serves all content under this path prefix. This is useful when running behind a reverse proxy that serves Zellij under a subpath.

Default: none (served at root "/")

```javascript
web_client {
    base_url "/zellij"
}
```

### web_client
A block with settings for the in-browser terminal of the Zellij web client (eg. colors, font, font size, cursor). Changes require a restart. For the full list, please see: [web-server](./web-client.md#web-client-configuration).

```javascript
web_client {
    font "monospace"
    font_size 14
}
```

### client_async_worker_tasks
The number of background threads used by `zellij attach <url>` when it connects to a session on another machine. One set of threads is made for that program, not one per client. The web server, browser clients and local sessions are not affected. Most of the work runs on the main thread, so these threads are usually idle. Requires a restart.

Default: the number of physical CPU cores (also used when set to `0`)

```javascript
client_async_worker_tasks 4
```

### advanced_mouse_actions
Whether to enable mouse hover effects and jumping between shell prompts with the mouse wheel (the `ScrollToPrompt` [mouse binding](./mouse-bindings.md), `Alt` + scroll by default). When false, those bindings do nothing.

The other mouse interactions are [mouse bindings](./mouse-bindings.md) and can be rebound:
- **Resizing panes by their frame**: the `ResizePane` binding, on `Ctrl` + left-drag on the frame of any tiled or floating pane by default
- **Drawing a new floating pane**: the `DrawFloatingPane` binding, on `Ctrl` + left-drag inside a pane by default
- **Resizing with the scroll wheel**: the `ResizeScroll` binding, controlled by [`mouse_scroll_resize`](#mouse_scroll_resize)

`Ctrl` here is the preset's primary modifier, which can be changed (see [Changing Modifiers](./changing-modifiers.md)).

Options:
    - true (default)
    - false

### default_cwd
Set the default current working directory for new panes. When set, new panes will open in this directory unless otherwise specified.

```javascript
default_cwd "/home/user/projects"
```

### osc8_hyperlinks
Enable clickable OSC8 hyperlink output in terminal panes. When enabled, programs that emit OSC8 escape sequences will produce clickable hyperlinks. Requires a restart.

Options:
  - true (default)
  - false

```javascript
osc8_hyperlinks false
```

### session_name
Set the name of the session to create when starting Zellij. If not set, a random name will be generated.

```javascript
session_name "my-session"
```

### attach_to_session
If a session with the name specified in `session_name` already exists, attach to it instead of creating a new one.

Options:
  - true
  - false (default)

```javascript
attach_to_session true
```

### support_kitty_keyboard_protocol
Enable support for the Kitty keyboard protocol. This allows for more detailed key reporting from the terminal. Defaults to true if the terminal supports it.

Options:
  - true (default if terminal supports it)
  - false

```javascript
support_kitty_keyboard_protocol true
```

### web_sharing
Whether new sessions are shared through the local web server. This is separate from `web_server` which controls whether the server starts at all.

Options:
  - "on" - new sessions are shared by default
  - "off" - new sessions are not shared by default (Default)
  - "disabled" - sharing is completely disabled

```javascript
web_sharing "on"
```

### mouse_hover_effects
Enable mouse hover visual effects, such as pane frame highlight and help text when hovering over panes.

Options:
  - true (default)
  - false

```javascript
mouse_hover_effects false
```

### visual_bell
Show visual bell indicators when a pane sends a bell character. This manifests as a brief pane/tab frame flash and a [!] suffix on the tab name.

Options:
  - true (default)
  - false

```javascript
visual_bell false
```

### focus_follows_mouse
Whether to automatically focus panes when hovering over them with the mouse.

Options:
  - true
  - false (default)

```javascript
focus_follows_mouse true
```

### mouse_click_through
Whether clicking a pane to focus it also sends the click event into the pane (to the running program). When false, the first click only focuses the pane and is consumed by Zellij.

Options:
  - true
  - false (default)

```javascript
mouse_click_through true
```

### pane_frame_style
The style of the pane frames when `pane_frames` is enabled.

Options:
  - "titles" (default) - a single title line above each pane
  - "full" - a full border around each pane (the pre-`0.45.0` look)
  - "none" - no frames at all (identical to `pane_frames false`)

Setting `pane_frames false` forces the style to `none` regardless of this option.

The style can also be changed at runtime with the `SetPaneFrameStyle` [action](./keybindings-possible-actions.md#setpaneframestyle) or with `zellij action set-pane-frame-style`.

```javascript
pane_frame_style "titles"
```

### stacked_pane_list
Whether stacked panes are rendered as a list of one-line titles with the expanded pane pinned to the bottom of the stack. When false, the expanded pane is rendered in place inside the stack (the pre-`0.45.0` behavior).

Options:
  - true (default)
  - false

```javascript
stacked_pane_list false
```

### support_kitty_graphics_protocol
Enable support for the Kitty graphics protocol, allowing programs running in panes to display images. Defaults to true if the terminal supports it (queried when Zellij starts). Changing this option requires restarting Zellij.

Options:
  - true (default if terminal supports it)
  - false

```javascript
support_kitty_graphics_protocol true
```

### mouse_scroll_resize
Whether holding the primary modifier (`Ctrl` by default) and scrolling the mouse wheel resizes the pane under the mouse. This is done by the `ResizeScroll` [mouse binding](./mouse-bindings.md), which can be rebound; when this option is false, that binding does nothing.

Options:
  - true (default)
  - false

```javascript
mouse_scroll_resize false
```

### mouse_hover_tips
Whether to show contextual help tips when hovering with the mouse (eg. resize help near pane borders, pane group shortcuts). This is distinct from `mouse_hover_effects`, which controls hover *visual* effects such as frame highlighting.

Options:
  - true (default)
  - false

```javascript
mouse_hover_tips false
```

### osc133_command_selection
Whether triple-clicking inside output marked with [OSC 133 shell integration](./shell-integration.md) sequences selects the whole command and its output rather than the logical line under the cursor.

Options:
  - true (default)
  - false

```javascript
osc133_command_selection false
```

### word_separators
The characters that terminate a word when double-clicking to select it. Whitespace always separates words and does not need to be included here.

Default: `"[]{}<>()"`

```javascript
word_separators "[]{}<>()/\\"
```

### host_notification_protocol
The protocol used to forward desktop notifications emitted by panes (through OSC 9, OSC 99 or OSC 777) to the host terminal. See [desktop notifications](./compatibility.md#desktop-notifications).

Options:
  - "auto" (default) - OSC 99 for terminals that support it (eg. kitty), OSC 9 otherwise
  - "osc9" - always use OSC 9
  - "osc99" - always use OSC 99
  - "bell" - emit a terminal bell instead of a notification
  - "off" - do not forward notifications to the host terminal

```javascript
host_notification_protocol "osc9"
```

### nested_session_handling
What Zellij should do when a pane contains another (nested) Zellij session. See [nested sessions](./nested-sessions.md).

Options:
  - "ask" (default) - show a prompt when focusing the pane, offering to zoom into the nested session or to take control of it
  - "fullscreen" - always zoom into the nested session when focusing its pane
  - "descend" - always route input to the nested session when focusing its pane
  - "never" - do nothing automatically

```javascript
nested_session_handling "descend"
```

### dangerously_enable_paste_buffer_read
Whether programs running inside panes are allowed to **read** the system clipboard through the OSC 52 escape sequence. When false, such requests receive an empty reply.

**Warning**: when this is enabled, any program running in any pane - including one running on a remote machine over SSH - can read the contents of the clipboard at any time, without prompting.

Copying to the clipboard (OSC 52 write) is not affected by this option and is always available.

Options:
  - true
  - false (default)

```javascript
dangerously_enable_paste_buffer_read true
```

### scroll_mode_sync
Whether scrolling a pane implicitly enters and exits [`scroll` mode](./keybindings-modes.md#a-note-about-scroll-mode). When false, scrolling a pane (eg. with the mouse wheel) leaves the current mode alone, and `scroll` mode is only entered through an explicit keybinding.

Options:
  - true (default)
  - false

```javascript
scroll_mode_sync false
```

### explicit_theme_hue
Pin the session to a dark or light appearance, ignoring the color scheme reported by the host terminal. It is resolved before the first render, so the session starts with the intended appearance rather than correcting itself once the terminal replies. See [themes](./themes.md#overriding-the-terminals-reported-hue).

Options:
  - "dark" - always treat the terminal as being in dark mode
  - "light" - always treat the terminal as being in light mode

Default: unset - the host terminal decides

This only selects which dark or light theme applies. When [`theme`](#theme) is not set, these are [`theme_dark`](#theme_dark) and [`theme_light`](#theme_light), or the bundled `default` and `default-light` themes in their place. When `theme` is set, both `theme_dark` and `theme_light` must be set for this option to have an effect - otherwise `theme` remains authoritative.

```javascript
explicit_theme_hue "dark"
```

### on_quit
Choose what the `Quit` action (`Ctrl q` by default) does.

Options:
  - "ask_quit" (default) - ask, with quitting preselected
  - "ask_detach" - ask, with detaching preselected
  - "quit" - quit without asking
  - "detach" - detach without asking; the session keeps running

```javascript
on_quit "ask_detach"
```

### bars_hidden_on_start
The bars (eg. the tab bar and status bar) a new session starts with hidden. Hidden bars come back with the "Show bars" item of the [right-click menu](./context-menu.md) or the `ToggleBars` action.

Options:
  - "none" (default) - no bars are hidden
  - "all" - all bars are hidden
  - bar names separated by commas, eg. "tab-bar,status-bar"

A bar is matched by its plugin alias (eg. `tab-bar`, `status-bar`, `compact-bar`) or by its plugin location.

```javascript
bars_hidden_on_start "all"
```

### hidden_bars_notification
Whether to briefly show a note saying what was hidden and how to show it again whenever bars are hidden.

Options:
  - true (default)
  - false

```javascript
hidden_bars_notification false
```

### mode_hints_when_bars_hidden
While the bar that shows the keys of the current mode is hidden, whether to show those keys in a corner of the screen when entering a mode.

Options:
  - true (default)
  - false

```javascript
mode_hints_when_bars_hidden false
```

### session_indicator
Whether to show the other sessions indicator in the tab bar and the compact bar.

Options:
  - true (default)
  - false

```javascript
session_indicator false
```

### swap_layout_notification
Whether to briefly show the name of the new swap layout when it is changed.

Options:
  - true (default)
  - false

```javascript
swap_layout_notification false
```

### stacked_pane_list_orientation
Whether new stacks show their pane titles in a column (one title per line) or in a row (side by side on one line). The orientation of an existing stack can be changed from its right-click menu.

Options:
  - "vertical" (default)
  - "horizontal"

```javascript
stacked_pane_list_orientation "horizontal"
```

### grapheme_clusters
Whether to count each grapheme cluster (an emoji sequence such as a flag or a skin tone, or a letter with its accents) as one unit of width, as the Unicode standard does. When false, width is counted per code point, the way older programs expect, and programs can still ask for clusters with mode 2027. Applies to new panes.

Options:
  - true (default)
  - false

```javascript
grapheme_clusters false
```

### mirror_resizes_source_pane
Whether a focused mirror of a pane (a live copy of the pane shown elsewhere) in this session may resize that pane's program to the mirror's size, and whether new mirrors opened in this session do so by default.

Options:
  - true (default)
  - false

```javascript
mirror_resizes_source_pane false
```

### live_view_release_key
An extra key that stops typing into a live view of a pane (in the [inbox](./inbox.md) or a mirror) and gives the keys back to the plugin showing it. `Alt Enter`, the inbox key or a click outside always do this. A key written twice, eg. `"Esc Esc"`, must be pressed twice in a row.

Default: not set

```javascript
live_view_release_key "Ctrl Alt Home"
```

### keybinds_dir
The folder in which Zellij looks for [keybinding presets](./keybinding-presets.md). Changes to files in this folder are picked up live.

Default: a `keybinds` folder in the config directory

```javascript
keybinds_dir "/path/to/my/keybinds_dir"
```

### context_menu_enabled
Whether a right click opens the [right-click menu](./context-menu.md). When false, right clicks go to the focused pane only, and `Alt` + right click clears the pane group. Plugins can still open the menu through their API.

Options:
  - true (default)
  - false

```javascript
context_menu_enabled false
```

### context_menu
A block that sets the items of the right-click menu. See [the right-click menu](./context-menu.md).

### session_suggestions
A block that sets how other sessions are suggested on the session card and in the session manager. See [session suggestions](./session-suggestions.md).

### terminal
A block with the settings of the [Zellij terminal](./zellij-terminal.md) window (`zellij terminal`), eg. its font, padding and opacity. See [terminal options](./terminal-options.md).

### attention
A block that sets how Zellij tracks and shows what panes, tabs and sessions need: the markers on frames and tabs, the inbox, and the desktop app's tray icon and notifications. See [the inbox](./inbox.md).
