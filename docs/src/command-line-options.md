# Command Line Configuration Options

In addition to the [configuration file](./configuration.md), zellij can also be configured through the command line when running it. These options will override options in the configuration file.

> **Migration Note:** The `--disable-mouse-mode` and `--no-pane-frames` flags have been removed. Use `--mouse-mode false` (equivalent of `--disable-mouse-mode`) and `--pane-frames false` (equivalent of `--no-pane-frames`) instead.

Every top-level option that can be set in the [configuration file](./options.md) also has a corresponding flag here (settings inside blocks, such as `ui`, `env`, `web_client`, `terminal`, `attention`, `context_menu` and `session_suggestions`, do not), in nearly all cases using the same name in kebab-case (eg. the `nested_session_handling` option is `--nested-session-handling`). The exceptions are the web server options (`web_server_ip`, `web_server_port`, `web_server_cert`, `web_server_key`, `enforce_https_for_localhost`, `dangerously_allow_web_serving_without_a_certificate`), which are taken as positional arguments rather than flags.

> **Note:** since `0.45.0` (which uses clap 4 for argument parsing), repeating the same flag no longer produces an error - the last occurrence overrides the previous ones. Help output is also styled and colored.

A [keybinding preset](./keybinding-presets.md) can be chosen for a single session with `--keybinds-preset` (a name from the keybinds folder, a built-in preset, or a path to a preset file), together with `--keybinds-primary`, `--keybinds-secondary` and `--keybinds-unlock` to change its keys:

```
$ zellij options --keybinds-preset unlock-first --keybinds-unlock "Ctrl a"
```

The listing below is the output of `zellij options --help`. A shorter summary is available with `zellij options -h`.

```
Change the behaviour of zellij

Usage: zellij options [OPTIONS] [WEB_SERVER_IP] [WEB_SERVER_PORT] [WEB_SERVER_CERT] [WEB_SERVER_KEY] [ENFORCE_HTTPS_FOR_LOCALHOST] [DANGEROUSLY_ALLOW_WEB_SERVING_WITHOUT_A_CERTIFICATE]

Arguments:
  [WEB_SERVER_IP]


  [WEB_SERVER_PORT]


  [WEB_SERVER_CERT]


  [WEB_SERVER_KEY]


  [ENFORCE_HTTPS_FOR_LOCALHOST]
          [possible values: true, false]

  [DANGEROUSLY_ALLOW_WEB_SERVING_WITHOUT_A_CERTIFICATE]
          [possible values: true, false]

Options:
      --simplified-ui <SIMPLIFIED_UI>
          Allow plugins to use a more simplified layout that is compatible with more fonts (true or false)

          [possible values: true, false]

      --theme <THEME>
          Set the default theme

      --theme-dark <THEME_DARK>
          Theme name to apply when the host terminal reports a dark color palette (CSI 2031 / DSR 997). Requires
          `theme_light` to also be set; if either is missing the static `theme` remains authoritative

      --theme-light <THEME_LIGHT>
          Theme name to apply when the host terminal reports a light color palette (CSI 2031 / DSR 997). Requires
          `theme_dark` to also be set; if either is missing the static `theme` remains authoritative

      --explicit-theme-hue <EXPLICIT_THEME_HUE>
          Pin the session to a dark or light appearance ("dark" or "light"), resolved before the first render and kept
          authoritative over ambient host terminal reports (CSI 2031 / DSR 997). When unset, the session follows the
          host terminal

      --default-mode <DEFAULT_MODE>
          Set the default mode

      --default-shell <DEFAULT_SHELL>
          Set the default shell

      --default-cwd <DEFAULT_CWD>
          Set the default cwd

      --default-layout <DEFAULT_LAYOUT>
          Set the default layout

      --layout-dir <LAYOUT_DIR>
          Set the layout_dir, defaults to subdirectory of config dir

      --theme-dir <THEME_DIR>
          Set the theme_dir, defaults to subdirectory of config dir

      --keybinds-dir <KEYBINDS_DIR>
          Set the keybinds_dir, defaults to subdirectory of config dir

      --keybinds-preset <KEYBINDS_PRESET>
          Use this keybinding preset for this session: a name from the keybinds folder, a built-in preset, or a path to
          a preset file

      --keybinds-primary <KEYBINDS_PRIMARY>
          The primary leader key for the keybinding preset (for example "Ctrl")

      --keybinds-secondary <KEYBINDS_SECONDARY>
          The secondary leader key for the keybinding preset (for example "Alt")

      --keybinds-unlock <KEYBINDS_UNLOCK>
          The unlock key for the keybinding preset (for example "Ctrl g")

      --mouse-mode <MOUSE_MODE>
          Set the handling of mouse events (true or false) Can be temporarily bypassed by the [SHIFT] key

          [possible values: true, false]

      --pane-frames <PANE_FRAMES>
          Set display of the pane frames (true or false)

          [possible values: true, false]

      --pane-frame-style <PANE_FRAME_STYLE>


      --mirror-session <MIRROR_SESSION>
          Mirror session when multiple users are connected (true or false)

          [possible values: true, false]

      --on-force-close <ON_FORCE_CLOSE>
          Set behaviour on force close (quit or detach)

      --scroll-buffer-size <SCROLL_BUFFER_SIZE>


      --copy-command <COPY_COMMAND>
          Switch to using a user supplied command for clipboard instead of OSC52

      --copy-clipboard <COPY_CLIPBOARD>
          OSC52 destination clipboard

          [possible values: system, primary]

      --copy-on-select <COPY_ON_SELECT>
          Automatically copy when selecting text (true or false)

          [possible values: true, false]

      --osc8-hyperlinks <OSC8_HYPERLINKS>
          Enable OSC8 hyperlink output (true or false)

          [possible values: true, false]

      --scrollback-editor <SCROLLBACK_EDITOR>
          Explicit full path to open the scrollback editor (default is $EDITOR or $VISUAL)

      --session-name <SESSION_NAME>
          The name of the session to create when starting Zellij

      --attach-to-session <ATTACH_TO_SESSION>
          Whether to attach to a session specified in "session-name" if it exists

          [possible values: true, false]

      --auto-layout <AUTO_LAYOUT>
          Whether to lay out panes in a predefined set of layouts whenever possible

          [possible values: true, false]

      --session-serialization <SESSION_SERIALIZATION>
          Whether sessions should be serialized to the HD so that they can be later resurrected, default is true

          [possible values: true, false]

      --serialize-pane-viewport <SERIALIZE_PANE_VIEWPORT>
          Whether pane viewports are serialized along with the session, default is false

          [possible values: true, false]

      --scrollback-lines-to-serialize <SCROLLBACK_LINES_TO_SERIALIZE>
          Scrollback lines to serialize along with the pane viewport when serializing sessions, 0 defaults to the
          scrollback size. If this number is higher than the scrollback size, it will also default to the scrollback
          size

      --styled-underlines <STYLED_UNDERLINES>
          Whether to use ANSI styled underlines

          [possible values: true, false]

      --serialization-interval <SERIALIZATION_INTERVAL>
          The interval at which to serialize sessions for resurrection (in seconds)

      --disable-session-metadata <DISABLE_SESSION_METADATA>
          If true, will disable writing session metadata to disk

          [possible values: true, false]

      --support-kitty-keyboard-protocol <SUPPORT_KITTY_KEYBOARD_PROTOCOL>
          Whether to enable support for the Kitty keyboard protocol (must also be supported by the host terminal),
          defaults to true if the terminal supports it

          [possible values: true, false]

      --support-kitty-graphics-protocol <SUPPORT_KITTY_GRAPHICS_PROTOCOL>
          Whether to enable support for the Kitty graphics (image) protocol (must also be supported by the host
          terminal), defaults to true if the terminal supports it

          [possible values: true, false]

      --grapheme-clusters <GRAPHEME_CLUSTERS>
          Count each grapheme cluster (an emoji sequence, a letter with its accents) as one unit of width, as the
          Unicode standard does (true or false, default true). When false, widths are counted per code point and
          programs may still ask for clusters with mode 2027

          [possible values: true, false]

      --mirror-resizes-source-pane <MIRROR_RESIZES_SOURCE_PANE>
          Whether a focused mirror of a pane may resize that pane's program to the mirror's size, and whether new
          mirrors resize their source pane by default (true or false, default true)

          [possible values: true, false]

      --live-view-release-key <LIVE_VIEW_RELEASE_KEY>
          An extra key that gives typing back to a plugin while a live pane view inside it is taking the keyboard
          (default: none, Alt Enter, the inbox key or a click outside always do it; a key written twice means pressing
          it twice)

      --web-server <WEB_SERVER>
          Whether to make sure a local web server is running when a new Zellij session starts. This web server will
          allow creating new sessions and attaching to existing ones that have opted in to being shared in the browser.

          Note: a local web server can still be manually started from within a Zellij session or from the CLI. If this
          is not desired, one can use a version of Zellij compiled without web_server_capability

          Possible values: - true - false Default: false

          [possible values: true, false]

      --web-sharing <WEB_SHARING>
          Whether to allow new sessions to be shared through a local web server, assuming one is running (see the
          `web_server` option for more details).

          Note: if Zellij was compiled without web_server_capability, this option will be locked to "disabled"

          Possible values: - "on" (new sessions will allow web sharing through the local web server if it is online) -
          "off" (new sessions will not allow web sharing unless they explicitly opt-in to it) - "disabled" (new sessions
          will not allow web sharing and will not be able to opt-in to it) Default: "off"

          [possible values: on, off, disabled]

      --stacked-resize <STACKED_RESIZE>
          Whether to stack panes when resizing beyond a certain size default is true

          [possible values: true, false]

      --stacked-pane-list <STACKED_PANE_LIST>
          [possible values: true, false]

      --stacked-pane-list-orientation <STACKED_PANE_LIST_ORIENTATION>
          Whether new stacks show their titles in a column (vertical) or in a row (horizontal) default is vertical

      --show-startup-tips <SHOW_STARTUP_TIPS>
          Whether to show startup tips when starting a new session default is true

          [possible values: true, false]

      --show-release-notes <SHOW_RELEASE_NOTES>
          Whether to show release notes on first run of a new version default is true

          [possible values: true, false]

      --advanced-mouse-actions <ADVANCED_MOUSE_ACTIONS>
          Whether to enable mouse hover effects and pane grouping functionality default is true

          [possible values: true, false]

      --mouse-scroll-resize <MOUSE_SCROLL_RESIZE>
          Whether Ctrl+ScrollWheel resizes panes default is true

          [possible values: true, false]

      --scroll-mode-sync <SCROLL_MODE_SYNC>
          Whether scrolling a pane implicitly enters (and leaving the scroll implicitly exits) Scroll mode default is
          true

          [possible values: true, false]

      --mouse-hover-effects <MOUSE_HOVER_EFFECTS>
          Whether to enable mouse hover visual effects (frame highlight and help text) default is true

          [possible values: true, false]

      --mouse-hover-tips <MOUSE_HOVER_TIPS>
          Whether to show mouse hover help-text tips (resize help and group shortcuts) default is true

          [possible values: true, false]

      --visual-bell <VISUAL_BELL>
          Whether to show visual bell indicators (pane/tab frame flash and [!] suffix) default is true

          [possible values: true, false]

      --focus-follows-mouse <FOCUS_FOLLOWS_MOUSE>
          Whether to focus panes on mouse hover (true or false) default is false

          [possible values: true, false]

      --mouse-click-through <MOUSE_CLICK_THROUGH>
          Whether clicking a pane to focus it also sends the click into the pane (true or false) default is false

          [possible values: true, false]

      --context-menu-enabled <CONTEXT_MENU_ENABLED>
          Whether a right click opens the right-click menu (true or false), default is true

          [possible values: true, false]

      --osc133-command-selection <OSC133_COMMAND_SELECTION>
          Whether triple-clicking inside shell-marked (OSC 133) command output selects the command and its output rather
          than the logical line default is true

          [possible values: true, false]

      --word-separators <WORD_SEPARATORS>
          Characters that terminate a word when double-clicking to select it, in addition to whitespace (which is always
          a separator) default is "[]{}<>()"

      --host-notification-protocol <HOST_NOTIFICATION_PROTOCOL>
          [possible values: auto, osc9, osc99, bell, off]

      --post-command-discovery-hook <POST_COMMAND_DISCOVERY_HOOK>
          A command to run after the discovery of running commands when serializing, for the purpose of manipulating the
          command (eg. with a regex) before it gets serialized

      --client-async-worker-tasks <CLIENT_ASYNC_WORKER_TASKS>
          Number of background threads used by `zellij attach <url>` when it connects to a session on another machine.
          One set is made for that program, not one per client; the web server, browser clients and local sessions are
          not affected.

          Most of the work runs on the main thread, so these threads are usually idle. Set to 0 to use the number of
          (physical) CPU cores.

      --nested-session-handling <NESTED_SESSION_HANDLING>
          How to handle a nested Zellij session detected inside a pane (ask, fullscreen, descend, never)

      --dangerously-enable-paste-buffer-read <DANGEROUSLY_ENABLE_PASTE_BUFFER_READ>
          [possible values: true, false]

      --session-indicator <SESSION_INDICATOR>
          Whether to show the other sessions indicator in the tab bar and compact bar (true or false), default is true

          [possible values: true, false]

      --swap-layout-notification <SWAP_LAYOUT_NOTIFICATION>
          Whether to briefly show the new swap layout name when it is changed (true or false), default is true

          [possible values: true, false]

      --on-quit <ON_QUIT>
          What the quit action does: ask_quit (ask, Quit preselected), ask_detach (ask, Detach preselected), quit or
          detach. Default is ask_quit

          [possible values: ask_quit, ask_detach, quit, detach]

      --bars-hidden-on-start <BARS_HIDDEN_ON_START>
          Which bars a new session starts with hidden: bar names separated by commas (eg. tab-bar,status-bar), all or
          none. Default is none

      --hidden-bars-notification <HIDDEN_BARS_NOTIFICATION>
          Whether to briefly show what was hidden and how to show it again when bars are hidden (true or false), default
          is true

          [possible values: true, false]

      --mode-hints-when-bars-hidden <MODE_HINTS_WHEN_BARS_HIDDEN>
          Whether to show the current mode's keys in a corner while a bar that would show them is hidden (true or
          false), default is true

          [possible values: true, false]

  -h, --help
          Print help (see a summary with '-h')
```
