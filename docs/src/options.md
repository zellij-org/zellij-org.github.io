# Options

You can make use of these options either by invoking zellij with
`zellij options [OPTION]` or binding them in the configuration file.

Eg. `zellij options --simplified-ui true` is equivalent to `simplified_ui: true` in the config file.

|Option         | Config            |      Default   | Description
|---------------|-------------------|:--------------:|------------|
| default-mode  | default_mode      | normal         | The first mode on startup. |
| default-shell | default_shell     | $SHELL         | The default shell.         |
| default-layout | default_layout     | default         | The name of the default layout.        |
| mouse-mode | mouse_mode     | true         | Enable mouse mode.         |
| disable-mouse-mode | -     | false         | Disable mouse mode.         |
| simplified-ui | simplified_ui     | false          | Request the Plugins to use a more compatible ui.  |
| pane-frames | pane_frames   | true          | Display frames around the panes. |
| no-pane-frames | -   | false          | Disable display of frames around the panes. |
| on-force-close| on_force_close    | detach         | What to do when receiving a SIGTERM, SIGINT, SIGQUIT or SIGHUP.|
| theme         | theme             | default        | Switch to a theme configured under the `themes` section.  |
| scroll-buffer-size| scroll_buffer_size | 10000 | The number of lines zellij stores for each pane in the scroll back buffer.|
| _ | env | empty | A map of key value pairs for environment variables. |
| copy-command | copy_command | _ | Command to execute when copying text, instead of using OSC52 (for example wl-copy, xclip, pbcopy). |
| copy-clipboard | copy_clipboard | system | Destination selection buffer (x11/linux) for OSC52 copy, can be system or primary. |
| copy-on-select | copy_on_select | true | Automatically copy when selecting text. |
| scrollback-editor | scrollback_editor | - | Path to the editor to use to edit scrollback (eg. `/usr/bin/vim`) |



A small example:
```
default_mode: locked
mouse_mode: false
env:
  RUST_BACKTRACE: 1 # set RUST_BACKTRACE=1
```
