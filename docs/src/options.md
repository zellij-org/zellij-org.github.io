# Options

You can make use of these options either by invoking zellij with
`zellij options [OPTION]` or binding them in the configuration file.

Eg. `zellij options --simplified-ui` is equivalent to `simplified_ui: true` in the config file.

|Option         | Config            |      Default   | Description
|---------------|-------------------|:--------------:|------------|
| default-mode  | default_mode      | normal         | The first mode on startup. |
| default-shell | default_shell     | $SHELL         | The default shell.         |
| simplified-ui | simplified_ui     | false          | Request the Plugins to use a more compatible ui.  |
| no-pane-frames | no_pane_frames   | false          | Display frames around the frames. |
| on-force-close| on_force_close    | detach         | What to do when receiving a SIGTERM, SIGINT, SIGQUIT or SIGHUP.|
| theme         | theme             | default        | Switch to a theme configured under the `themes` section.  |
