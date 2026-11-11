# Terminal Options

Zellij can open sessions in its own window, the [Zellij terminal](./zellij-terminal.md) (`zellij terminal`), without another terminal emulator. That window is configured in the `terminal` block of the [configuration file](./configuration.md).

Every key is optional. With the whole block absent, the window uses the defaults listed below. Unless noted otherwise, changes apply to open windows right away. The keys marked "requires restart" only apply to windows opened after the change.

These settings can also be changed from the [settings screen](./settings-screen.md).

```javascript
terminal {
    font "Iosevka Term"
    font_size 13
    line_height 1.1
    padding 8
    opacity 0.95
    blur true
    cursor_style "bar"
    theme {
        background "#101010"
    }
}
```

---

- [Fonts](#fonts): [font](#font), [font_bold, font_italic, font_bold_italic](#font_bold-font_italic-font_bold_italic), [font_size](#font_size), [font_weight](#font_weight), [system_fonts](#system_fonts), [ligatures](#ligatures), [font_features](#font_features)
- [Cells and padding](#cells-and-padding): [line_height](#line_height), [cell_width](#cell_width), [baseline_offset](#baseline_offset), [underline_offset and underline_thickness](#underline_offset-and-underline_thickness), [padding](#padding), [padding_balance](#padding_balance), [padding_color](#padding_color), [minimum_contrast](#minimum_contrast)
- [Cursor](#cursor): [cursor_style](#cursor_style), [cursor_blink](#cursor_blink), [cursor_unfocused_hollow](#cursor_unfocused_hollow)
- [Keys](#keys): [paste_keys](#paste_keys), [copy_keys](#copy_keys), [fullscreen_keys](#fullscreen_keys), [zoom_in_keys, zoom_out_keys and zoom_reset_keys](#zoom_in_keys-zoom_out_keys-and-zoom_reset_keys), [macos_option_as_alt](#macos_option_as_alt)
- [Mouse and scrolling](#mouse-and-scrolling): [middle_click_paste](#middle_click_paste), [open_links](#open_links), [open_links_with_shift](#open_links_with_shift), [shift_drag_selects](#shift_drag_selects), [hide_pointer_while_typing](#hide_pointer_while_typing), [smooth_scrolling](#smooth_scrolling), [scroll_animation_duration](#scroll_animation_duration), [scroll_momentum](#scroll_momentum), [scroll_momentum_friction](#scroll_momentum_friction)
- [Window](#window): [opacity](#opacity), [opacity_mode](#opacity_mode), [blur](#blur), [startup_mode](#startup_mode), [initial_columns and initial_rows](#initial_columns-and-initial_rows), [reuse_session_windows](#reuse_session_windows), [terminal_requests](#terminal_requests), [bell](#bell)
- [Clipboard](#clipboard): [allow_remote_clipboard_read](#allow_remote_clipboard_read)
- [Colors](#colors): [theme](#theme)

---

## Fonts

### font
The font family to draw text with, found through the system's font configuration. A family that cannot be found falls back to the font built into Zellij.

Default: the built-in font

```javascript
font "Iosevka Term"
```

### font_bold, font_italic, font_bold_italic
Font families for bold, italic and bold italic text, each used in place of the `font` family's own face for that style. A style without one of these, or whose family cannot be found, keeps the `font` family's face.

Default: not set

```javascript
font_bold "Iosevka Term"
font_italic "Iosevka Term"
font_bold_italic "Iosevka Term"
```

### font_size
The font size in points, as other terminals measure it. Any number above 0.

Default: `12`

```javascript
font_size 13.5
```

### font_weight
The weight of regular text: a number from `100` to `900`, or one of these names: `"thin"` (100), `"extralight"` (200), `"light"` (300), `"regular"` (400), `"medium"` (500), `"semibold"` (600), `"bold"` (700), `"extrabold"` (800), `"black"` (900). Bold text uses a face 300 heavier, up to 900. Variable fonts are set to the exact weight.

Default: `"regular"` (400)

```javascript
font_weight "medium"
```

### system_fonts
Whether to use the system's fonts for characters the main font does not have.

Default: `true`

```javascript
system_fonts false
```

### ligatures
Whether the font's ligatures are formed, so that sequences like `->` or `!=` are drawn as one shape.

Default: `true`

```javascript
ligatures false
```

### font_features
OpenType features to turn on, or to turn off with a leading `-`, as four-character tags. Listing any feature shapes text even with `ligatures false`. In that case, `liga`, `calt` and `dlig` stay off unless they are listed here.

Default: none

```javascript
font_features "ss01" "zero" "-calt"
```

## Cells and padding

### line_height
The height of a cell as a multiple of the font's own line height, from `0.5` to `3.0`. The extra space is shared evenly above and below the text.

Default: `1.0`

```javascript
line_height 1.2
```

### cell_width
The width of a cell as a multiple of the font's own character width, from `0.5` to `3.0`. Characters keep their shape and are centered in the cell.

Default: `1.0`

```javascript
cell_width 1.1
```

### baseline_offset
Pixels to move the text down inside its cell (or up, when negative), from `-64` to `64`.

Default: `0`

```javascript
baseline_offset 1
```

### underline_offset and underline_thickness
Pixels to move the underline down (or up, when negative), and pixels to add to (or remove from) its thickness, each from `-64` to `64`. The underline always stays inside the cell.

Default: `0`

```javascript
underline_offset 1
underline_thickness 1
```

### padding
Empty space around the text, in pixels, from `0` to `1000`. It is scaled with the display, but not with zoom. `padding` sets every side, and `padding_top`, `padding_right`, `padding_bottom` and `padding_left` override one side each.

Default: `0`

```javascript
padding 8
padding_top 4
```

### padding_balance
Whether the pixels left over when the window is not a whole number of cells are shared evenly on all sides, instead of all going to the right and bottom edges.

Default: `false`

```javascript
padding_balance true
```

### padding_color
How the padding is painted:
  - `"background"` (default) - with the theme background and the window [opacity](#opacity)
  - `"extend"` - continuing the background of the nearest cell at the edge of the grid

```javascript
padding_color "extend"
```

### minimum_contrast
The lowest allowed contrast ratio between text and its background, from `1.0` (off) to `21.0`. Text colors below it are adjusted.

Default: `1.0`

```javascript
minimum_contrast 4.5
```

## Cursor

### cursor_style
The cursor shape to draw where the program in the pane has not asked for one: `"block"`, `"bar"` or `"underline"`. A program that asks for a shape (with `CSI <n> q`) still gets the shape it asked for.

Default: not set

```javascript
cursor_style "bar"
```

### cursor_blink
Whether the cursor blinks. Unlike `cursor_style`, this wins over the program: set it to force a blinking or a steady cursor whatever the pane asks for. When it is not set, the cursor blinks exactly when the program asks for a blinking cursor.

Default: not set

```javascript
cursor_blink false
```

### cursor_unfocused_hollow
Whether the cursor is drawn as an outlined block while the window is not focused.

Default: `true`

```javascript
cursor_unfocused_hollow false
```

## Keys
Keys are written as in [keybindings](./keybindings-keys.md), eg. `"Ctrl Shift v"`. Each of these keys takes a list of keys. The window keeps the keys it lists for itself; any other key goes to the session. Listing no keys leaves them all to the session. On macOS, `Super` is the Command key.

### paste_keys
The keys that paste from the clipboard.

Default: `"Ctrl Shift v"` and `"Shift Insert"`, plus `"Super v"` on macOS

```javascript
paste_keys "Ctrl Shift v" "Shift Insert"
```

### copy_keys
The keys that copy the text marked with shift and drag (see [`shift_drag_selects`](#shift_drag_selects)).

Default: `"Ctrl Shift c"`, plus `"Super c"` on macOS

```javascript
copy_keys "Ctrl Shift c"
```

### fullscreen_keys
The keys that switch the window between fullscreen and the size it had before.

Default: `"F11"`

```javascript
fullscreen_keys "F11"
```

### zoom_in_keys, zoom_out_keys and zoom_reset_keys
The keys that make text larger, make it smaller, and return it to the configured [`font_size`](#font_size).

Defaults:
  - `zoom_in_keys`: `"Ctrl ="`, `"Ctrl +"` and `"Ctrl Shift +"`, plus `"Super ="`, `"Super +"` and `"Super Shift +"` on macOS
  - `zoom_out_keys`: `"Ctrl -"` and `"Ctrl Shift _"`, plus `"Super -"` on macOS
  - `zoom_reset_keys`: `"Ctrl 0"`, plus `"Super 0"` on macOS

```javascript
zoom_in_keys "Ctrl ="
zoom_out_keys "Ctrl -"
zoom_reset_keys "Ctrl 0"
```

### macos_option_as_alt
Which Option key acts as Alt on macOS. The other one keeps typing characters such as `å`. Ignored on other platforms.

Options:
  - `"left"` (default)
  - `"right"`
  - `"both"`
  - `"none"`

```javascript
macos_option_as_alt "both"
```

## Mouse and scrolling

### middle_click_paste
Whether the middle mouse button pastes the primary selection (on Linux, the text last selected anywhere). A pane whose program asks for mouse reporting gets the click instead.

Default: `true`

```javascript
middle_click_paste false
```

### open_links
Whether clicking an OSC 8 hyperlink opens it with the system's default handler. A plain left click opens it; over a pane whose program asks for mouse reporting, shift must be held instead. Dragging is a selection and never opens anything, and the click still reaches the pane either way. Only `http`, `https`, `ftp`, `ftps`, `mailto` and `file` links are opened.

Default: `true`

```javascript
open_links false
```

### open_links_with_shift
Whether shift and click opens a link in every pane, not only in panes whose program asks for mouse reporting. Has no effect when `open_links` is `false`.

Default: `true`

```javascript
open_links_with_shift false
```

### shift_drag_selects
Whether dragging with shift held marks text anywhere in the window, including the tab bar, the status bar, pane frames and across pane borders. The marked text is copied with [`copy_keys`](#copy_keys).

Default: `true`

```javascript
shift_drag_selects false
```

### hide_pointer_while_typing
Whether the mouse pointer is hidden while typing, until it moves again.

Default: `false`

```javascript
hide_pointer_while_typing true
```

### smooth_scrolling
Whether scrolling through a pane's scrollback slides the text to its new position instead of jumping. This applies to the mouse wheel, the touchpad and the scroll keys alike.

Default: `true`

```javascript
smooth_scrolling false
```

### scroll_animation_duration
How long one scroll slide takes, in milliseconds, from `1` to `1000`. Ignored when `smooth_scrolling` is `false`.

Default: `100`

```javascript
scroll_animation_duration 150
```

### scroll_momentum
Whether a fast two-finger touchpad swipe through a pane's scrollback keeps scrolling for a moment after the fingers lift, slowing down until it stops. Touching the touchpad again, clicking, typing or moving the pointer to another pane stops it at once. This works independently of `smooth_scrolling`. It currently only has an effect on Wayland; on X11, Windows and macOS it is ignored (macOS already provides its own touchpad momentum).

Default: `true`

```javascript
scroll_momentum false
```

### scroll_momentum_friction
How quickly that continued scrolling slows down, from `0.5` to `10.0`. Higher values stop sooner. Currently only has an effect on Wayland.

Default: `2.0`

```javascript
scroll_momentum_friction 4.0
```

## Window

### opacity
How opaque the window is, from `0.0` (invisible) to `1.0` (solid). This needs a compositor; without one, the window stays solid.

Default: `1.0`

```javascript
opacity 0.9
```

### opacity_mode
What the opacity applies to:
  - `"background"` (default) - only the default background shows through; text, colored cells, the cursor and images stay solid
  - `"everything"` - the whole window fades evenly

```javascript
opacity_mode "everything"
```

### blur
Whether to ask the compositor to blur what is behind the window. It is only visible with an `opacity` below `1.0`. It is supported on macOS, KDE Plasma and Windows 11 22H2 or later, and ignored elsewhere. On Windows it is the system's Acrylic material, which only shows while the window is focused.

Default: `false`

```javascript
blur true
```

### startup_mode
How a new window opens. Requires restart. The `--startup-mode` flag of `zellij terminal` overrides it.

Options:
  - `"remember"` (default) - at the size (counted in rows and columns) and in the state the last window was closed in; with nothing remembered yet, it opens windowed at 120x40
  - `"windowed"`
  - `"maximized"`
  - `"fullscreen"`

```javascript
startup_mode "maximized"
```

### initial_columns and initial_rows
The size, in columns and rows, of a window that has no remembered size to open at, each from `2` to `1000`. A size remembered by `startup_mode "remember"` wins over these. A maximized or fullscreen window returns to this size when it is restored. Requires restart.

Default: 120 columns and 40 rows

```javascript
initial_columns 160
initial_rows 48
```

### reuse_session_windows
Whether a session is shown in at most one window of the desktop app. When on, switching a window to a session that another window already shows brings that other window forward and closes the switching one; the session it left keeps running. When off, the window always switches in place. Windows opened with `zellij terminal --standalone` always switch in place.

Default: `true`

```javascript
reuse_session_windows false
```

### terminal_requests
Where a command opens when another program uses Zellij as its terminal (`zellij terminal -e <command>`, as `xdg-terminal-exec` or a file manager runs it):
  - `"new_session"` (default) - in a session of its own
  - `"existing_session"` - as a new tab in the session whose window was focused last, or in a new session when no window is open

```javascript
terminal_requests "existing_session"
```

### bell
What the window does when a program rings the bell:
  - `"visual"` (default) - asks the desktop to draw attention to the window, eg. by highlighting it in the taskbar
  - `"audible"` - plays the system sound
  - `"both"`
  - `"none"`

```javascript
bell "both"
```

## Clipboard

### allow_remote_clipboard_read
Whether programs in a session on another machine (opened with `zellij terminal https://...`, see [remote attach](./web-client.md#attaching-from-the-zellij-terminal)) may read this computer's clipboard with OSC 52. Local sessions follow [`dangerously_enable_paste_buffer_read`](./options.md#dangerously_enable_paste_buffer_read) instead.

Default: `false`

```javascript
allow_remote_clipboard_read true
```

## Colors

### theme
The colors the window paints itself:

```javascript
terminal {
    theme {
        foreground "#e5e5e5"
        background "#000000"
        cursor "#e5e5e5"
        black "#000000"
        red "#cd0000"
        green "#00cd00"
        yellow "#cdcd00"
        blue "#0000ee"
        magenta "#cd00cd"
        cyan "#00cdcd"
        white "#e5e5e5"
        bright_black "#7f7f7f"
        bright_red "#ff0000"
        bright_green "#00ff00"
        bright_yellow "#ffff00"
        bright_blue "#5c5cff"
        bright_magenta "#ff00ff"
        bright_cyan "#00ffff"
        bright_white "#ffffff"
    }
}
```

Every color is optional, and is given as `RGB` (eg. `229 229 229`) or as a hex string. The sixteen ANSI colors (`black` to `bright_white`) cannot be given as a number from the 256-color palette, because that palette is built from them.

Where the colors come from, from lowest to highest priority:
- `foreground` and `background`: the `text_unselected` colors of the active Zellij [theme](./themes.md) (following [dark and light switching](./themes.md#automatic-dark-and-light-theme-switching)), then this block.
- The sixteen ANSI colors: the [`terminal_colors`](./themes.md#terminal_colors) section of the active Zellij theme, then this block. Colors that neither of them sets keep the usual xterm defaults (eg. `red` is `205 0 0`).
- `cursor`: only this block.

So with no `theme` block here, the window follows the Zellij theme, including its `terminal_colors`. Colors set in this block stay the same whatever Zellij theme is active.
