# Legacy Themes
This file defines the original Zellij theme specification. It is still supported, but new themes should be written in the new spec defined at the root of this section.

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
