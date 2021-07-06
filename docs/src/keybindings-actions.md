# Actions
These are the actions that can be assigned to key sequences when [configuring keybindings](./keybindings.md).

## `Quit`
Quit Zellij.

## `SwitchToMode: <InputMode>`
Switch to the specified [input mode](./keybindings-modes.md).
The mode should be capitalized, eg. `SwitchToMode: Normal`.

Note that there's a "hidden" mode called `RenameTab` which can be used in order to trigger the renaming of a tab.

## `Resize: <Direction>`
Resize focused pane in specified direction.
Direction should be one of `Left`, `Right`, `Up` or `Down`.

eg. `Resize: Down`

## `FocusNextPane`
Switch focus to next pane to the right or below if on screen edge.

## `FocusPreviousPane`
Switch focus to next pane to the left or above if on screen edge.

## `SwitchFocus`
Switch focus to pane with the next ID (this is mostly left around for legacy support, `FocusNextPane` or `FocusPreviousPane` should be preferred).

## `MoveFocus: <Direction>`
Move focus to the pane with the greatest overlap with the current pane in the specified direction. 
Direction should be one of `Left`, `Right`, `Up` or `Down`.

eg. `MoveFocus: Left`

## `ScrollUp`
Scroll up 1 line inside the focused pane.

## `ScrollDown`
Scroll down 1 line inside the focused pane.

## `ToggleFocusFullscreen`
Toggle between fullscreen focus pane and normal layout.

## `NewPane: <Direction>`
Open a new pane in the specified direction (relative to focus).
If no direction is specified, will try to use the biggest available space.
Direction should be one of `Left`, `Right`, `Up` or `Down`.
Specifying no direction should be done by introducing a space character (this is a bug and should be fixed).

eg. `NewPane: Left` or `NewPane: `

## `CloseFocus`
Close the focused pane.

## `NewTab`
Create a new tab.

## `GoToNextTab`
Go to the next tab.

## `GoToPreviousTab`
Go to the previous tab.

## `CloseTab`
Close the current tab.

## `GoToTab: <index>`
Go to the tab of the specified index.

## `Run: {cmd: <path>}`
Run the specified command in a new pane.
A comma separated list of arguments, or the split
direction is optional:

`Run: {cmd: <path>, args: [ARGS], direction: <direction>}`

