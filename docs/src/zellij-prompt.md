# Zellij Prompt

Zellij includes a top-level `prompt` command that shows a small UI element (a question, a list, a text field, a notice...) as a popup over the pane it was run from, waits for the user to answer, and prints the answer to stdout. This makes it possible to ask the user something from a shell script without leaving Zellij.

```
$ zellij prompt confirm "Force push?" && git push --force
$ BRANCH=$(git branch --format='%(refname:short)' | zellij prompt choose --title Branch)
$ zellij prompt notify "Build finished" --timeout 5s
```

---

- [Usage](#usage) - Command syntax and requirements
- [Exit Codes](#exit-codes) - How the result is reported
- [Common Options](#common-options) - Flags shared by all or most elements
- [Elements](#elements) - `confirm`, `choose`, `input`, `number`, `toggle`, `select`, `menu`, `form` and `notify`
- [JSON Output](#json-output) - Machine-readable results with `--json`
- [Closing Notices](#closing-notices) - The `dismiss-info-popups` action
- [Opening Plugins as Popups](#opening-plugins-as-popups) - The `--popup` flags of `zellij action pipe`

---

## Usage

```
zellij prompt [--title <TITLE>] [--timeout <DURATION>] <ELEMENT> [OPTIONS] [ARGS]
```

`zellij prompt` must be run inside a Zellij pane: it reads the `ZELLIJ_PANE_ID` environment variable to know which pane it was called from, and exits with status `2` if it is not set.

The popup is drawn by the built-in `prompt` plugin (`zellij:prompt`). If a plugin alias named `prompt` is defined in the configuration, that plugin is used instead (see [the prompt alias](./prompt-alias.md)).

Running `zellij prompt <ELEMENT> --help` shows the options and examples of each element.

## Exit Codes

| Exit code | Meaning |
|-----------|---------|
| `0` | The prompt was answered (for `confirm`: the user chose the "yes" button) |
| `1` | The prompt was cancelled or closed (for `confirm`: the user chose the "no" button) |
| `2` | An error, eg. a wrong flag, or the command was not run inside a Zellij pane |
| `124` | The `--timeout` ran out and no `--default` was given |

When the `--timeout` runs out and a `--default` was given, the default is used as the answer and the exit code is the same as if the user had chosen it.

Answers are printed to stdout followed by a newline. Nothing is printed when the prompt is cancelled or times out without a default.

## Common Options

These two options apply to every element. They can be given before or after the element name:

```
    --title <TITLE>        Title shown at the top of the popup (eg. --title "Git")
    --timeout <TIMEOUT>    How long the popup stays open (eg. 30s, 500ms, 2m or 1h); an
                           unanswered prompt then exits 124 and a notice just closes
```

The following options apply to every element except `notify`:

```
    --default <DEFAULT>                Initial value, and the answer used when --timeout runs out
    --json                             Print JSON with the result and why the prompt ended
    --at-mouse                         Open the popup where the mouse pointer last was, or at the
                                       cursor if the mouse has not moved yet
    --at-cursor                        Open the popup just below the cursor, in the focused pane
    --at-center                        Open the popup in the middle of the screen
    --capture-all-keys                 Send every key to the prompt, including the ones bound to
                                       Zellij actions
    --outside-click <OUTSIDE_CLICK>    What a click outside the popup does: block (ignore it, the
                                       default) or close (cancel the prompt)
```

Only one of `--at-mouse`, `--at-cursor` and `--at-center` can be given. Without them, the popup opens over the pane the command was run from.

## Elements

### confirm

Ask a yes/no question. Nothing is printed: the exit code is the answer (`0` for yes, `1` for no).

```
zellij prompt confirm [OPTIONS] <MESSAGE>

    --yes <YES>    Label of the confirming button (default: Yes)
    --no <NO>      Label of the refusing button (default: No)
```

`--default` takes `yes` or `no` (also `true`/`false`, `on`/`off`, `y`/`n`, `1`/`0`).

```
$ zellij prompt confirm "Force push?"
$ zellij prompt confirm "Force push?" --yes Push --no Cancel && git push --force
$ zellij prompt confirm "Deploy?" --title Production --timeout 10s --default no
```

### choose

Choose one or more items from a list. The items are given as arguments, or read from stdin (one per line) when no items are given. Items read from stdin are added to the list as they arrive. The chosen item is printed, or with `--multi` every ticked item is printed, one per line.

```
zellij prompt choose [OPTIONS] [ITEMS]...

    --item <ITEM>            An item written as value=Label: the label is shown, the value is
                             printed (repeatable)
    --multi                  Allow ticking several items
    --labels                 Each stdin line is value<TAB>label
-0, --null                   Input and output are NUL-separated
    --selected <SELECTED>    An item ticked in advance (repeatable)
```

```
$ git branch --format='%(refname:short)' | zellij prompt choose
$ zellij prompt choose main develop feature/login --title Branch
$ zellij prompt choose --multi --selected b a b c d
$ printf 'main\tMain branch\ndev\tDevelopment\n' | zellij prompt choose --labels
$ zellij prompt choose --item "rm=Delete file" --item "mv=Rename file"
$ find . -print0 | zellij prompt choose -0 --multi | xargs -0 ls -l
```

### input

Ask for a line of text. The text is printed.

```
zellij prompt input [OPTIONS] [MESSAGE]

    --placeholder <PLACEHOLDER>    Text shown while the field is empty
    --validate <VALIDATE>          A regular expression the answer must match
    --required                     Refuse an empty answer
```

```
$ zellij prompt input "Commit message" --placeholder "what changed" --required
$ zellij prompt input Branch --validate '^[a-z-]+$' --default my-branch
$ zellij prompt input Name --timeout 10s --default anonymous
```

### number

Ask for a whole number. The number is printed.

```
zellij prompt number [OPTIONS] [MESSAGE]

    --min <MIN>      Smallest allowed value
    --max <MAX>      Largest allowed value
    --step <STEP>    Step used by the arrow keys (must be larger than 0)
```

```
$ zellij prompt number Port --min 1 --max 65535 --default 8080
$ zellij prompt number Workers --min 1 --max 64 --step 4 --default 8
```

### toggle

Ask for on or off. Prints `true` or `false`. `--default` takes `on` or `off` (also `true`/`false`, `yes`/`no`).

```
zellij prompt toggle [OPTIONS] <MESSAGE>
```

```
$ zellij prompt toggle "Enable CI" --default on
$ zellij prompt toggle Verbose --json
```

### select

Choose one value from a dropdown. The first argument is the label, the rest are the options. The chosen option is printed. A `--default` must be one of the options.

```
zellij prompt select [OPTIONS] <MESSAGE> <OPTIONS>...
```

```
$ zellij prompt select License MIT Apache-2.0 GPL-3.0
$ zellij prompt select License MIT Apache-2.0 --default Apache-2.0
```

### menu

Show a menu and print the chosen item.

```
zellij prompt menu [OPTIONS] [ITEMS]...

    --item <ITEM>    An item written as value=Label: the label is shown, the value is printed
                     (repeatable)
```

```
$ zellij prompt menu Open Rename Delete
$ zellij prompt menu --item "o=Open" --item "r=Rename" --item "d=Delete" --at-mouse
$ zellij prompt menu Copy Paste --at-cursor
```

### form

Show several fields at once and print the answers as one JSON object, keyed by field id. The form is described in JSON, read from a file with `--spec` or from stdin.

```
zellij prompt form [OPTIONS]

    --spec <SPEC>    File with the form description; read from stdin when not given
```

The description is a JSON object with these keys:

| Key | Description |
|-----|-------------|
| `title` | Title of the form (optional) |
| `message` | Text shown above the fields (optional) |
| `fields` | List of fields (required, at least one) |
| `buttons` | Object with `submit` and `cancel` button labels (optional, default "Save" and "Cancel") |

Each field is an object with:

| Key | Description |
|-----|-------------|
| `id` | Unique id of the field, used as its key in the output (required) |
| `type` | One of `input`, `select`, `toggle`, `number` or `choose` (required) |
| `label` | Label shown next to the field (defaults to the id) |
| `required` | `true` to refuse an empty answer |
| `validate` | Regular expression the answer must match |
| `placeholder` | Text shown while the field is empty |
| `options` | List of strings (required for `select` and `choose`) |
| `multi` | `true` to allow ticking several options (for `choose`) |
| `min`, `max`, `step` | Limits and arrow-key step (for `number`) |
| `default` | Initial value: a string, a number, `true`/`false`, or a list of strings (for `choose` with `multi`) |

`--default` for a form must be a JSON object.

```
$ echo '{"title":"New project","fields":[{"id":"name","type":"input","label":"Name","required":true},{"id":"ci","type":"toggle","label":"Use CI","default":true}]}' | zellij prompt form
$ zellij prompt form --spec form.json
```

Output of the first example:

```json
{"name":"demo","ci":true}
```

### notify

Show a notice that does not take the keyboard, and return at once with exit code `0`. The notice stays open until its `--timeout` runs out or it is closed. It includes the name of the pane that sent it, and the tab name if that pane is in another tab. Clicking the notice focuses the pane that sent it.

```
zellij prompt notify [OPTIONS] <MESSAGE>

    --at <AT>         Where to show it: top-right (default), top-left, bottom-right,
                      bottom-left, pane, center, mouse or cursor
    --no-pane-name    Leave out the line with the name of the pane that sent the notice
    --no-tab-name     Leave out the line with the tab name
```

Long text is wrapped.

```
$ zellij prompt notify "Build finished"
$ make && zellij prompt notify "Build finished" --title make --timeout 5s
$ zellij prompt notify "Tests failed" --at bottom-left
$ zellij prompt notify "Saved" --no-pane-name --no-tab-name --timeout 3s
```

## JSON Output

With `--json`, a single JSON object is printed that says why the prompt ended:

```json
{"result":"answered","value":"main"}
{"result":"cancelled"}
{"result":"timeout"}
{"result":"timeout","value":8080}
{"result":"error","error":"..."}
```

`value` has the type of the answer: a string, a number, `true`/`false`, a list of strings (`choose --multi`) or an object (`form`). For `confirm` it is `true` or `false`. The exit codes are the same as without `--json`.

## Closing Notices

Notices and other popups that do not take the keyboard can be closed with:

```
$ zellij action dismiss-info-popups
```

See [dismiss-info-popups](./cli-actions.md#dismiss-info-popups). This action can also be bound to a key (`DismissInfoPopups`).

## Opening Plugins as Popups

`zellij prompt` is built on the popup flags of [`zellij action pipe`](./cli-actions.md#pipe), which can open any plugin as a popup over the calling pane when the pipe launches it:

```
    --popup <PLACEMENT>                Open the launched plugin as a popup: pane, center, mouse,
                                       cursor, top-left, top-right, bottom-left or bottom-right
    --popup-no-focus                   An information popup that does not take key focus
    --popup-capture-all-keys           Send every key to the popup, including the ones bound to
                                       Zellij actions
    --popup-outside-click <BEHAVIOR>   What a click outside the popup does: block (ignore it) or
                                       close (close the popup)
```

- `--popup` cannot be combined with `--floating-plugin` or `--in-place-plugin`.
- `--popup-no-focus`, `--popup-capture-all-keys` and `--popup-outside-click` require `--popup`.
- `--popup-capture-all-keys` and `--popup-outside-click` cannot be combined with `--popup-no-focus`.

```
$ zellij action pipe --plugin file:/path/to/my-plugin.wasm --popup center -- my_payload
$ zellij action pipe --plugin file:/path/to/my-plugin.wasm --popup top-right --popup-no-focus
$ zellij action pipe --plugin file:/path/to/my-plugin.wasm --popup mouse --popup-outside-click close
```

The plugin answers through the pipe as usual (see [Pipes](./plugin-pipes.md)), and can set the exit code of the command (see [Zellij Pipe](./zellij-plugin-and-pipe.md#exit-status)).
