# Themes

### **Please see the [up-to-date documentation](/documentation) for the most recent features.**

## Color
You can specify a color theme, that will be picked up by
zellij in the following way:

```yaml
themes:
  default:
    fg: [0,0,0]
    bg: [0,0,0]
    black: [0,0,0]
    red: [0,0,0]
    green: [0,0,0]
    yellow: [0,0,0]
    blue: [0,0,0]
    magenta: [0,0,0]
    cyan: [0,0,0]
    white: [0,0,0]
    orange: [0,0,0]
```
for truecolor, or:
```yaml
themes:
  default:
    fg: 0
    bg: 0
    black: 0
    red: 0
    green: 0
    yellow: 0
    blue: 0
    magenta: 0
    cyan: 0
    white: 0
    orange: 0
```
for 256 color, or you can use hexdecimal color:
```yaml
themes:
  default:
    fg: "#000000"
    bg: "#000000"
    black: "#000000"
    red: "#000000"
    green: "#000000"
    yellow: "#000000"
    blue: "#000000"
    magenta: "#000000"
    cyan: "#000000"
    white: "#000000"
    orange: "#000000"
```

If the theme is called `default`, then zellij will pick it on startup.
To specify a different theme, run zellij with:
```
zellij options --theme [NAME]
```
or put the name in the configuration file with `theme: [NAME]` as follows:

```yaml
keybinds:
  ...

# Choose the theme that is specified in the themes section.
theme: default

themes:
  default:
    fg: #000000
    ...
```

or If you don't want to modify the configuration file, just add a theme, you can use the `themes` directory.

`themes` is located in `CONFIG_DIR/themes` by default. You can check it through `zellij setup --check`.

If you place the theme file in this folder, zelij will automatically merge the themes.

And you can set the theme through the options (`options --theme`) as in the first method. 

Here are [some example themes](https://github.com/zellij-org/zellij/tree/main/example/themes).

## UI
Certain non-color aspects of Zellij's interface can also be customized.

### Rounded Pane Corners
If your font has support for rounded corners (most do), then you can enable
them by adding the following to your configuration file:

```yaml
ui:
  pane_frames:
    rounded_corners: true
```

Zellij should pick up this change automatically next time the config is loaded.
