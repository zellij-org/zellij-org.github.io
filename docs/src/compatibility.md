# Compatibility

## Issues
Please report issues [here.](https://github.com/zellij-org/zellij/issues)

---------------------------

# Known Issues

## The status bar fonts don't render correctly:

This most likely is caused by a missing character in the font.

Fonts from [nerdfonts](https://github.com/ryanoasis/nerd-fonts) can fix this problem.


Some Options:

| Package Manager   |      Name      |
|-------------------|:--------------:|
| apt               |fonts-powerline |
| nix               |    nerdfonts   |

## Alt button mapping on darwin systems:

This can be mitigated individually on a terminal emulator level,
some inspiration can be found [here](https://github.com/zellij-org/zellij/issues/265).


## Pane frame title has issues with kitty:

This sadly seems to be an issue that can not be mitigated easily,
more information can be found [here](https://github.com/zellij-org/zellij/issues/689#issuecomment-914057955).

## Mouse issues:

If `mouse_mode` is turned on zellij handles these events, zellij provides an
escape mechanism in the form of the `SHIFT` Key, once it is pressed zellij lets
the terminal handle selection, clicking on links, copying, scrolling.

More information can be found [here](https://github.com/zellij-org/zellij/issues/627)
