# Themes
Themes can be specified either in the [configuration file](./configuration.md) under the `themes` section, or directly in a separate file.

## Truecolor themes

```javascript
themes {
   dracula {
        fg 248 248 242
        bg 40 42 54
        black 0 0 0
        red 255 85 85
        green 80 250 123
        yellow 241 250 140
        blue 98 114 164
        magenta 255 121 198
        cyan 139 233 253
        white 255 255 255
        orange 255 184 108
    }
}
```

## 256 color themes

```javascript
themes {
    default {
        fg 1
        bg 10
        black 20
        red 30
        green 40
        yellow 50
        blue 60
        magenta 70
        cyan 80
        white 90
        orange 254
    }
}
```

## Hexadecimal color themes
```javascript
themes {
    nord {
        fg "#D8DEE9"
        bg "#2E3440"
        black "#3B4252"
        red "#BF616A"
        green "#A3BE8C"
        yellow "#EBCB8B"
        blue "#81A1C1"
        magenta "#B48EAD"
        cyan "#88C0D0"
        white "#E5E9F0"
        orange "#D08770"
    }
}
```

## Getting Zellij to pick up the theme
If the theme is called `default`, then zellij will pick it on startup.
To specify a different theme, run zellij with:
```
zellij options --theme [NAME]
```
or put the name in the configuration file with `theme: [NAME]` as follows:

```javascript
keybinds {
    // ...
}
// ...

// Choose the theme that is specified in the themes section.
theme "default"

themes {
  default {
    fg "#000000"
    // ...
  }
}
```

or If you don't want to modify the configuration file, just add a theme, you can use the `themes` directory.

`themes` is located in `CONFIG_DIR/themes` by default. You can check it through `zellij setup --check`.

If you place the theme file in this folder, zelij will automatically merge the themes.

And you can set the theme through the options (`options --theme`) as in the first method. 

Here are [some example themes](https://github.com/zellij-org/zellij/tree/main/example/themes).
