# Themes
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
for 256 color.

If the theme is called `default`, then zellij will pick it on startup.
To specify a different theme, run zellij with:
```
zellij options --theme [NAME]
```
or put the name in the configuration file with `theme: [NAME]`.

Here are [some example themes](https://github.com/zellij-org/zellij/tree/main/example/themes).

To declare one or more custom themes to choose from:
```yaml
# select a theme other than "default"
theme: mytheme1
# declare one or more custom themes
themes:
  mytheme1:
    fg: [169,177,214] #A9B1D6
    bg: [26,27,38] #1A1B26
    black: [56,62,90] #383E5A
    ...
  mytheme2:
    fg: [9,17,214] 
    bg: [26,27,138] 
    black: [56,22,90] 
    ...
```

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
