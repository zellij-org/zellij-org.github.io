# Zellij Subscribe

Zellij provides a top-level `subscribe` command that streams the rendered output of one or more panes to stdout in real time. This is useful for monitoring, scripting, and building external tooling around Zellij sessions.

---

- [Usage](#usage) — Command syntax
- [Options](#options) — Available flags and parameters
- [Output Formats](#output-formats) — Raw text and JSON (NDJSON) output modes
- [Behavior](#behavior) — How initial delivery, change detection, and exit work
- [Subscribing to a Different Session](#subscribing-to-a-different-session) — Monitoring panes in background or remote sessions
- [Examples](#examples) — Common usage patterns including `jq` and `awk` filtering

---

## Usage

```
zellij [--session <SESSION_NAME>] subscribe [OPTIONS] --pane-id <PANE_ID>...
```

## Options

```
-p, --pane-id <PANE_ID>    One or more pane IDs to subscribe to (required, repeatable).
                           Accepts terminal_N, plugin_N, or bare integer N
                           (equivalent to terminal_N).
-s, --scrollback [<LINES>] Include scrollback in the initial delivery. If specified
                           without a value, all scrollback is included. If a number
                           is provided, that many lines of scrollback are included.
-f, --format <FORMAT>      Output format: "raw" (default) or "json"
    --ansi                 Preserve ANSI styling escape sequences in the output
```

## Output Formats

### Raw (default)

Viewport lines are printed to stdout each time the pane content changes, followed by a flush. On the initial delivery, scrollback lines (if requested) precede the viewport lines.

### JSON

Output is delivered as NDJSON (one JSON object per line). Two event types are emitted:

**Pane update:**
```json
{"event":"pane_update","pane_id":"terminal_1","viewport":["line1","line2"],"scrollback":null,"is_initial":true}
```

**Pane closed:**
```json
{"event":"pane_closed","pane_id":"terminal_1"}
```

This format is well suited for piping into `jq` for structured processing:

```
$ zellij subscribe --pane-id terminal_1 --format json | jq 'select(.event == "pane_update") | .viewport[]'
```

## Behavior

- On subscription, the full current viewport (and scrollback if requested) is delivered immediately with `is_initial: true`.
- Subsequent deliveries occur only when the viewport content changes. Only changed viewports are sent (no scrollback on subsequent deliveries).
- The client exits automatically when all subscribed panes have been closed or the session ends.

## Subscribing to a Different Session

To subscribe to panes in a session other than the current one, use the global `--session` flag:

```
$ zellij --session my-background-session subscribe --pane-id terminal_1
```

This is especially useful when combined with [background sessions](./cli-recipes.md#starting-and-controlling-background-sessions).

## Examples

Subscribe to a single pane:
```
$ zellij subscribe --pane-id terminal_1
```

Subscribe to multiple panes with ANSI styling preserved:
```
$ zellij subscribe --pane-id terminal_1 --pane-id plugin_2 --ansi
```

Include the last 100 lines of scrollback on initial delivery:
```
$ zellij subscribe --pane-id terminal_1 --scrollback 100
```

Include all scrollback:
```
$ zellij subscribe --pane-id terminal_1 --scrollback
```

Use JSON format and pipe into `jq` to extract viewport lines:
```
$ zellij subscribe --pane-id terminal_1 --format json | jq 'select(.event == "pane_update") | .viewport[]'
```

Use JSON format and pipe into `jq` to detect when a pane closes:
```
$ zellij subscribe --pane-id terminal_1 --format json | jq 'select(.event == "pane_closed") | .pane_id'
```

Filter live output for lines containing a pattern:
```
$ zellij subscribe --pane-id terminal_1 | awk '/ERROR/'
```

Or use JSON mode with `jq` for more structured filtering:
```
$ zellij subscribe --pane-id terminal_1 --format json | jq --unbuffered 'select(.event == "pane_update") | .viewport[] | select(test("ERROR"))'
```

Monitor a pane in a background session:
```
$ zellij --session build-server subscribe --pane-id terminal_1 --format json
```
