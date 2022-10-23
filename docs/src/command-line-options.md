# Command Line Configuration Options

In addition to the [configuration file](./configuration.md), zellij can also be configured through the command line when running it. These options will override options in the configuration file.

```
USAGE:
    zellij options [OPTIONS]

OPTIONS:
        --attach-to-session <ATTACH_TO_SESSION>
            Whether to attach to a session specified in "session-name" if it exists [possible
            values: true, false]

        --copy-clipboard <COPY_CLIPBOARD>
            OSC52 destination clipboard [possible values: system, primary]

        --copy-command <COPY_COMMAND>
            Switch to using a user supplied command for clipboard instead of OSC52

        --copy-on-select <COPY_ON_SELECT>
            Automatically copy when selecting text (true or false) [possible values: true, false]

        --default-layout <DEFAULT_LAYOUT>
            Set the default layout

        --default-mode <DEFAULT_MODE>
            Set the default mode

        --default-shell <DEFAULT_SHELL>
            Set the default shell

        --disable-mouse-mode
            Disable handling of mouse events

            Print help information

        --layout-dir <LAYOUT_DIR>
            Set the layout_dir, defaults to subdirectory of config dir

        --mirror-session <MIRROR_SESSION>
            Mirror session when multiple users are connected (true or false) [possible values: true,
            false]

        --mouse-mode <MOUSE_MODE>
            Set the handling of mouse events (true or false) Can be temporarily bypassed by the
            [SHIFT] key [possible values: true, false]

        --no-pane-frames
            Disable display of pane frames

        --on-force-close <ON_FORCE_CLOSE>
            Set behaviour on force close (quit or detach)

        --pane-frames <PANE_FRAMES>
            Set display of the pane frames (true or false) [possible values: true, false]

        --scroll-buffer-size <SCROLL_BUFFER_SIZE>
            

        --scrollback-editor <SCROLLBACK_EDITOR>
            Explicit full path to open the scrollback editor (default is $EDITOR or $VISUAL)

        --session-name <SESSION_NAME>
            The name of the session to create when starting Zellij

        --simplified-ui <SIMPLIFIED_UI>
            Allow plugins to use a more simplified layout that is compatible with more fonts (true
            or false) [possible values: true, false]

        --theme <THEME>
            Set the default theme

        --theme-dir <THEME_DIR>
            Set the theme_dir, defaults to subdirectory of config dir
```
